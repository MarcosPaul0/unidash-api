import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseTeacherWorkloadDataUseCase } from './delete-course-teacher-workload-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeTeacher } from 'test/factories/make-teacher';
import { InMemoryCourseTeacherWorkloadDataRepository } from 'test/repositories/in-memory-course-teacher-workload-data-repository';
import { makeCourseTeacherWorkloadData } from 'test/factories/make-course-teacher-workload-data';
import { makeCourse } from 'test/factories/make-course';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';

let inMemoryCourseTeacherWorkloadDataRepository: InMemoryCourseTeacherWorkloadDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseTeacherWorkloadDataUseCase;

describe('Delete Course Teacher Workload Data', () => {
  beforeEach(() => {
    inMemoryCourseTeacherWorkloadDataRepository =
      new InMemoryCourseTeacherWorkloadDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseTeacherWorkloadDataUseCase(
      inMemoryCourseTeacherWorkloadDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course teacher workload data if session user is teacher course manager', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const teacherCourse = makeTeacherCourse({
      course,
      courseId: course.id.toString(),
      teacher,
      teacherId: teacher.id.toString(),
    });
    const newCourseTeacherWorkloadData = makeCourseTeacherWorkloadData(
      {
        teacher,
        teacherId: 'teacher-1',
        courseId: 'course-1',
      },
      new UniqueEntityId('courseTeacherWorkloadData-1'),
    );

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);
    inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData.push(
      newCourseTeacherWorkloadData,
    );

    const result = await sut.execute({
      courseTeacherWorkloadDataId: 'courseTeacherWorkloadData-1',
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData,
    ).toHaveLength(0);
  });

  it('should be able to delete course teacher workload data if session user is admin', async () => {
    const admin = makeAdmin();
    const newCourseTeacherWorkloadData = makeCourseTeacherWorkloadData(
      {
        teacherId: 'teacher-1',
        courseId: 'course-1',
      },
      new UniqueEntityId('courseTeacherWorkloadData-1'),
    );

    inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData.push(
      newCourseTeacherWorkloadData,
    );

    const result = await sut.execute({
      courseTeacherWorkloadDataId: 'courseTeacherWorkloadData-1',
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course teacher workload data if not exists', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      courseTeacherWorkloadDataId: 'CourseTeacherWorkloadData-1',
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course teacher workload data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseTeacherWorkloadData = makeCourseTeacherWorkloadData(
      {
        teacherId: 'teacher-1',
        courseId: 'course-1',
      },
      new UniqueEntityId('courseTeacherWorkloadData-1'),
    );

    inMemoryCourseTeacherWorkloadDataRepository.courseTeacherWorkloadData.push(
      newCourseTeacherWorkloadData,
    );

    const result = await sut.execute({
      courseTeacherWorkloadDataId: 'courseTeacherWorkloadData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
