import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeStudent } from 'test/factories/make-student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeAdmin } from 'test/factories/make-admin';
import { FindAllTeachersOutsideOfCourseUseCase } from './find-all-teachers-outside-of-course';
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';

let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeachersOutsideOfCourseUseCase;

describe('Find All Teachers Outside Course', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeachersOutsideOfCourseUseCase(
      inMemoryCoursesRepository,
      inMemoryTeachersRepository,
      authorizationService,
    );
  });

  it('should be able to find all teachers outside of course if session user is a admin', async () => {
    const admin = makeAdmin();

    const teacherCourse1 = makeTeacherCourse({ courseId: 'course-1' });
    const teacherCourse2 = makeTeacherCourse({ courseId: 'course-1' });
    const teacherCourse3 = makeTeacherCourse({ courseId: 'course-2' });

    inMemoryTeacherCoursesRepository.teacherCourses.push(
      teacherCourse1,
      teacherCourse2,
      teacherCourse3,
    );

    inMemoryTeachersRepository.teacherCourses.push(
      teacherCourse1,
      teacherCourse2,
      teacherCourse3,
    );

    inMemoryTeachersRepository.teachers.push(
      teacherCourse1.teacher,
      teacherCourse2.teacher,
      teacherCourse3.teacher,
    );

    inMemoryCoursesRepository.courses.push(
      teacherCourse1.course,
      teacherCourse2.course,
      teacherCourse3.course,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teachers: [teacherCourse3.teacher],
      totalItems: 1,
      totalPages: 1,
    });
  });

  it('should be able to find all teachers outside of course if session user is a teacher with valid role', async () => {
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

    inMemoryTeachersRepository.teacherCourses.push(
      teacherCourse1,
      teacherCourse2,
      teacherCourse3,
    );

    inMemoryTeachersRepository.teachers.push(
      teacherCourse1.teacher,
      teacherCourse2.teacher,
      teacherCourse3.teacher,
    );

    inMemoryCoursesRepository.courses.push(
      teacherCourse1.course,
      teacherCourse2.course,
      teacherCourse3.course,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(teacherCourse0.teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teachers: [teacherCourse3.teacher],
      totalItems: 1,
      totalPages: 1,
    });
  });

  it('should not be able to find all teachers outside of course if session user is a teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'normalTeacher',
      courseId: 'course-1',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to find all teachers outside of course if session user is a student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(student),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
