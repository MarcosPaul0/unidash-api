import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { UpdateStudentData, UpdateStudentUseCase } from './update-student';
import { makeStudent } from 'test/factories/make-student';
import { makeAdmin } from 'test/factories/make-admin';
import { makeSessionUser } from 'test/factories/make-session-user';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';

let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let authorizationService: AuthorizationService;

let sut: UpdateStudentUseCase;

describe('Update Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateStudentUseCase(
      inMemoryStudentsRepository,
      authorizationService,
    );
  });

  it('should be able to update student', async () => {
    const admin = makeAdmin();

    const student = makeStudent(
      {
        email: 'johndoe@example.com',
        password: '123456',
      },
      new UniqueEntityId('student-1'),
    );

    inMemoryStudentsRepository.items.push(student);

    const data: UpdateStudentData = {
      name: 'John Doe',
      matriculation: '121123567890',
    };

    const result = await sut.execute({
      studentId: 'student-1',
      data,
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].name).toEqual('John Doe');
    expect(inMemoryStudentsRepository.items[0].matriculation).toEqual(
      '121123567890',
    );
  });

  it('should not be able to update student if session user is a teacher with invalid role', async () => {
    const teacher = makeTeacher();
    const teacherCourse = makeTeacherCourse({
      teacher,
      teacherId: teacher.id.toString(),
      teacherRole: 'normalTeacher',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const student = makeStudent(
      {
        email: 'johndoe@example.com',
        password: '123456',
      },
      new UniqueEntityId('student-1'),
    );

    inMemoryStudentsRepository.items.push(student);

    const data: UpdateStudentData = {
      name: 'John Doe',
      matriculation: '121123567890',
    };

    const result = await sut.execute({
      studentId: 'student-1',
      data,
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to update student if the student was not found', async () => {
    const admin = makeAdmin();

    const data: UpdateStudentData = {
      name: 'John Doe',
      matriculation: '121123567890',
    };

    const result = await sut.execute({
      studentId: 'fakeId',
      data,
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });
});
