import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseTeacherWorkloadDataUseCase } from './register-course-teacher-workload-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseTeacherWorkloadDataRepository } from 'test/repositories/in-memory-course-teacher-workload-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { CourseTeacherWorkloadDataAlreadyExistsError } from '../errors/course-teacher-workload-data-already-exists-error';
import { makeCourseTeacherWorkloadData } from 'test/factories/make-course-teacher-workload-data';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseTeacherWorkloadDataRepository: InMemoryCourseTeacherWorkloadDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseTeacherWorkloadDataUseCase;

describe('Register Course TeacherWorkload Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseTeacherWorkloadDataRepository =
      new InMemoryCourseTeacherWorkloadDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseTeacherWorkloadDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseTeacherWorkloadDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course TeacherWorkload data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseTeacherWorkloadData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        workloadInMinutes: 120,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseTeacherWorkloadData:
        inMemoryCourseTeacherWorkloadDataRepository
          .courseTeacherWorkloadData[0],
    });
  });

  it('should not be able to register course TeacherWorkload data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseTeacherWorkloadData: {
        teacherId: 'teacher-1',
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        workloadInMinutes: 120,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course TeacherWorkload data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseTeacherWorkloadData = makeCourseTeacherWorkloadData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseTeacherWorkloadData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseTeacherWorkloadDataRepository.create(
      newCourseTeacherWorkloadData,
    );

    const result = await sut.execute({
      courseTeacherWorkloadData: {
        teacherId: 'teacher-1',
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        workloadInMinutes: 120,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      CourseTeacherWorkloadDataAlreadyExistsError,
    );
  });

  it('should not be able to register course TeacherWorkload data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseTeacherWorkloadData: {
        teacherId: 'teacher-1',
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        workloadInMinutes: 120,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course TeacherWorkload data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseTeacherWorkloadData: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        workloadInMinutes: 120,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
