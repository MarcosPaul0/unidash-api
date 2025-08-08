import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { InMemoryAccountActivationTokensRepository } from 'test/repositories/in-memory-account-activation-tokens-repository';
import { FakeNotificationSender } from 'test/notification-sender/fake-notification-sender';
import { MockInstance } from 'vitest';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { SendAccountActivationNotificationParams } from '../../notification-sender/notification-sender';
import { USER_ACTION_TOKEN_TYPE } from '@/domain/entities/user-action-token';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeUser } from 'test/factories/make-user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAccountActivationTokensRepository: InMemoryAccountActivationTokensRepository;
let fakeHasher: FakeHasher;
let notificationSender: FakeNotificationSender;
let authorizationService: AuthorizationService;
let sendAccountActivationNotificationSpy: MockInstance<
  (request: SendAccountActivationNotificationParams) => Promise<void>
>;

let sut: RegisterStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAccountActivationTokensRepository =
      new InMemoryAccountActivationTokensRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    fakeHasher = new FakeHasher();
    notificationSender = new FakeNotificationSender();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sendAccountActivationNotificationSpy = vi.spyOn(
      notificationSender,
      'sendAccountActivationNotification',
    );

    sut = new RegisterStudentUseCase(
      inMemoryUsersRepository,
      inMemoryStudentsRepository,
      inMemoryAccountActivationTokensRepository,
      fakeHasher,
      notificationSender,
      authorizationService,
    );
  });

  it('should be able to register a new student', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
    });

    const teacherUser = makeUser(
      {
        name: teacherCourse.teacher.name,
        email: teacherCourse.teacher.email,
        role: 'teacher',
      },
      teacherCourse.teacher.id,
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      student: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1231231234',
        courseId: teacherCourse.course.id.toString(),
        type: 'incomingStudent',
      },
      sessionUser: teacherUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should hash student password upon registration', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
    });

    const teacherUser = makeUser(
      {
        name: teacherCourse.teacher.name,
        email: teacherCourse.teacher.email,
        role: 'teacher',
      },
      teacherCourse.teacher.id,
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      student: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1231231234',
        courseId: teacherCourse.course.id.toString(),
        type: 'incomingStudent',
      },
      sessionUser: teacherUser,
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });

  it('should not be able to register a new student if the user already exists', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
    });

    const teacherUser = makeUser(
      {
        name: teacherCourse.teacher.name,
        email: teacherCourse.teacher.email,
        role: 'teacher',
      },
      teacherCourse.teacher.id,
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const studentUser = makeUser(
      {
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'student',
      },
      teacherCourse.teacher.id,
    );

    inMemoryUsersRepository.items.push(studentUser);

    const result = await sut.execute({
      student: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1231231234',
        courseId: teacherCourse.course.id.toString(),
        type: 'incomingStudent',
      },
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(UserAlreadyExistsError);
  });

  it('should send an email when an student register', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
    });

    const teacherUser = makeUser(
      {
        name: teacherCourse.teacher.name,
        email: teacherCourse.teacher.email,
        role: 'teacher',
      },
      teacherCourse.teacher.id,
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    await sut.execute({
      student: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1231231234',
        courseId: teacherCourse.course.id.toString(),
        type: 'incomingStudent',
      },
      sessionUser: teacherUser,
    });

    expect(sendAccountActivationNotificationSpy).toHaveBeenCalledOnce();
    expect(sendAccountActivationNotificationSpy).toHaveBeenCalledWith({
      activationToken: expect.any(String),
      user: expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    });

    expect(inMemoryAccountActivationTokensRepository.items[0]).toEqual(
      expect.objectContaining({
        expiresAt: expect.any(Date),
        token: expect.any(String),
        actionType: USER_ACTION_TOKEN_TYPE.accountConfirmation,
      }),
    );
  });

  it('should not be able to register a new student if session user is not teacher', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
    });

    const studentUser = makeUser(
      {
        name: teacherCourse.teacher.name,
        email: teacherCourse.teacher.email,
        role: 'student',
      },
      teacherCourse.teacher.id,
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      student: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1231231234',
        courseId: teacherCourse.course.id.toString(),
        type: 'incomingStudent',
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register a new student if session teacher not belongs to course', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
    });

    const teacherUser = makeUser(
      {
        name: teacherCourse.teacher.name,
        email: teacherCourse.teacher.email,
        role: 'teacher',
      },
      teacherCourse.teacher.id,
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      student: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        matriculation: '1231231234',
        courseId: 'fake-course-id',
        type: 'incomingStudent',
      },
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
