import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { RegisterCourseUseCase } from './register-course';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeUser } from 'test/factories/make-user';
import { makeCourse } from 'test/factories/make-course';
import { CourseAlreadyExistsError } from '../errors/course-already-exists-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: RegisterCourseUseCase;

describe('Register Course', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseUseCase(
      inMemoryCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to register a new course', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const result = await sut.execute({
      course: {
        name: 'Fake course',
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      course: inMemoryCoursesRepository.courses[0],
    });
  });

  it('should not be able to register a new course if already exists', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const course = makeCourse({
      name: 'Fake course',
    });

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      course: {
        name: 'Fake course',
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(CourseAlreadyExistsError);
  });

  it('should not be able to register a new course if user session is teacher', async () => {
    const teacherUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'teacher',
    });

    const result = await sut.execute({
      course: {
        name: 'Fake course',
      },
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register a new course if user session is student', async () => {
    const studentUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'student',
    });

    const result = await sut.execute({
      course: {
        name: 'Fake course',
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
