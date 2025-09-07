import { FindAllCoursesUseCase } from './find-all-courses';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { makeAdmin } from 'test/factories/make-admin';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeTeacher } from 'test/factories/make-teacher';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';

let inMemoryCoursesRepository: InMemoryCoursesRepository;

let sut: FindAllCoursesUseCase;

describe('Find All Courses', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    sut = new FindAllCoursesUseCase(inMemoryCoursesRepository);
  });

  it('should be able to find all courses with admin session', async () => {
    const admin = makeAdmin();

    const course1 = makeCourse();
    const course2 = makeCourse();
    const course3 = makeCourse();

    inMemoryCoursesRepository.courses.push(course1, course2, course3);

    const result = await sut.execute({
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courses: [course1, course2, course3],
    });
  });

  it('should be able to find all courses with teacher session', async () => {
    const teacher = makeTeacher();

    const course1 = makeCourse();
    const course2 = makeCourse();
    const course3 = makeCourse();

    const teacherCourse = makeTeacherCourse({
      course: course1,
      teacher: teacher,
      courseId: course1.id.toString(),
      teacherId: teacher.id.toString(),
    });

    inMemoryCoursesRepository.courses.push(course1, course2, course3);

    inMemoryCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courses: [course1],
    });
  });
});
