import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeUser } from 'test/factories/make-user';
import { makeCourse } from 'test/factories/make-course';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UpdateCourseUseCase } from './update-course';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: UpdateCourseUseCase;

describe('Update Course', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateCourseUseCase(
      inMemoryCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to update a course', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const course = makeCourse({
      name: 'Fake course',
    });

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      courseId: course.id.toString(),
      data: {
        name: 'Fake course 2',
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCoursesRepository.courses[0].name).toEqual('Fake course 2');
  });

  it('should not be able to update a course if not exists', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const result = await sut.execute({
      courseId: 'fake course id',
      data: {
        name: 'Fake course 2',
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to update a course if user session is teacher', async () => {
    const teacherUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'teacher',
    });

    const result = await sut.execute({
      courseId: 'fake course id',
      data: {
        name: 'Fake course 2',
      },
      sessionUser: teacherUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to update a course if user session is student', async () => {
    const studentUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'student',
    });

    const result = await sut.execute({
      courseId: 'fake course id',
      data: {
        name: 'Fake course 2',
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
