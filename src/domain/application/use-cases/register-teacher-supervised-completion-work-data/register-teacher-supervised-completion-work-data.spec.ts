import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterTeacherSupervisedCompletionWorkDataUseCase } from './register-teacher-supervised-completion-work-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryTeacherSupervisedCompletionWorkDataRepository } from 'test/repositories/in-memory-teacher-supervised-completion-work-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { TeacherSupervisedCompletionWorkDataAlreadyExistsError } from '../errors/teacher-supervised-completion-work-data-already-exists-error';
import { makeTeacherSupervisedCompletionWorkData } from 'test/factories/make-teacher-supervised-completion-work-data';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherSupervisedCompletionWorkDataRepository: InMemoryTeacherSupervisedCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterTeacherSupervisedCompletionWorkDataUseCase;

describe('Register Teacher Supervised Completion Work Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherSupervisedCompletionWorkDataRepository =
      new InMemoryTeacherSupervisedCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherSupervisedCompletionWorkDataUseCase(
      inMemoryCoursesRepository,
      inMemoryTeacherSupervisedCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to register teacher supervised completion work data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherSupervisedCompletionWorkData:
        inMemoryTeacherSupervisedCompletionWorkDataRepository
          .teacherSupervisedCompletionWorkData[0],
    });
  });

  it('should not be able to register teacher supervised completion work data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register teacher supervised completion work data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newTeacherSupervisedCompletionWorkData =
      makeTeacherSupervisedCompletionWorkData(
        { semester: 'first', year: 2025, courseId: 'course-1' },
        new UniqueEntityId('TeacherSupervisedCompletionWorkData-1'),
      );

    inMemoryCoursesRepository.create(course);
    inMemoryTeacherSupervisedCompletionWorkDataRepository.create(
      newTeacherSupervisedCompletionWorkData,
    );

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      TeacherSupervisedCompletionWorkDataAlreadyExistsError,
    );
  });

  it('should not be able to register teacher supervised completion work data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register teacher supervised completion work data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
