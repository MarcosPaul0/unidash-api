import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeStudent } from 'test/factories/make-student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { FindAllTeachersByCourseUseCase } from './find-all-teachers-by-course';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeachersByCourseUseCase;

describe('Find All Teachers By Course', () => {
  beforeEach(() => {
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeachersByCourseUseCase(
      inMemoryTeacherCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to find all teachers by course if session user is a admin', async () => {
    const admin = makeAdmin();

    const teacherCourse1 = makeTeacherCourse({ courseId: 'course-1' });
    const teacherCourse2 = makeTeacherCourse({ courseId: 'course-1' });
    const teacherCourse3 = makeTeacherCourse({ courseId: 'course-2' });

    inMemoryTeacherCoursesRepository.teacherCourses.push(
      teacherCourse1,
      teacherCourse2,
      teacherCourse3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: admin,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherCourses: [teacherCourse1, teacherCourse2],
      totalItems: 2,
      totalPages: 1,
    });
  });

  it('should be able to find all teachers by course if session user is a teacher with valid role', async () => {
    const teacherCourse0 = makeTeacherCourse({
      teacherRole: 'courseManagerTeacher',
      courseId: 'course-1',
    });

    const teacherCourse1 = makeTeacherCourse({ courseId: 'course-1' });
    const teacherCourse2 = makeTeacherCourse({ courseId: 'course-1' });
    const teacherCourse3 = makeTeacherCourse({ courseId: 'course-2' });

    inMemoryTeacherCoursesRepository.teacherCourses.push(
      teacherCourse0,
      teacherCourse1,
      teacherCourse2,
      teacherCourse3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: teacherCourse0.teacher,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherCourses: [teacherCourse0, teacherCourse1],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should not be able to find all teachers by course if session user is a teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'normalTeacher',
      courseId: 'course-1',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to find all teachers by course if session user is a student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: student,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
