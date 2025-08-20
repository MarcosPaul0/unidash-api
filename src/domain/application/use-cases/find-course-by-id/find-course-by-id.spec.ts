import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { FindCourseByIdUseCase } from './find-course-by-id';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindCourseByIdUseCase;

describe('Find Course By Id', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindCourseByIdUseCase(
      inMemoryCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to find a course by id', async () => {
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const teacher = makeTeacher();

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      courseId: 'course-1',
      sessionUser: {
        createdAt: teacher.createdAt,
        email: teacher.email,
        id: teacher.id.toString(),
        name: teacher.name,
        role: teacher.role,
        accountActivatedAt: teacher.accountActivatedAt,
        updatedAt: teacher.updatedAt,
      },
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      course,
    });
  });

  it('should throw if the course was not found', async () => {
    const teacher = makeTeacher();

    const result = await sut.execute({
      courseId: 'course-2',
      sessionUser: {
        createdAt: teacher.createdAt,
        email: teacher.email,
        id: teacher.id.toString(),
        name: teacher.name,
        role: teacher.role,
        accountActivatedAt: teacher.accountActivatedAt,
        updatedAt: teacher.updatedAt,
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the user is not an teacher and admin', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      courseId: 'course-1',
      sessionUser: {
        createdAt: student.createdAt,
        email: student.email,
        id: student.id.toString(),
        name: student.name,
        role: student.role,
        accountActivatedAt: student.accountActivatedAt,
        updatedAt: student.updatedAt,
      },
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
