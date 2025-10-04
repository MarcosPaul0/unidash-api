import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseStudentsDataUseCase } from './register-course-students-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseStudentsDataRepository } from 'test/repositories/in-memory-course-students-data-repository';
import { makeCourseStudentsData } from 'test/factories/make-course-students-data';
import { CourseStudentsDataAlreadyExistsError } from '../errors/course-students-data-already-exists-error';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseStudentsDataRepository: InMemoryCourseStudentsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseStudentsDataUseCase;

describe('Register Course Students Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseStudentsDataRepository =
      new InMemoryCourseStudentsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseStudentsDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseStudentsDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course students data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseStudentsData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        entrants: 10,
        subscribers: 10,
        vacancies: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseStudentsData:
        inMemoryCourseStudentsDataRepository.courseStudentsData[0],
    });
  });

  it('should not be able to register course students data if course not exists', async () => {
    const admin = makeAdmin();

    const result = await sut.execute({
      courseStudentsData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        entrants: 10,
        subscribers: 10,
        vacancies: 10,
      },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course students data if already exists', async () => {
    const admin = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseStudentsData = makeCourseStudentsData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseStudentsDataRepository.create(newCourseStudentsData);

    const result = await sut.execute({
      courseStudentsData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        entrants: 10,
        subscribers: 10,
        vacancies: 10,
      },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(CourseStudentsDataAlreadyExistsError);
  });

  it('should not be able to register course students data if session user is student', async () => {
    const student = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseStudentsData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        entrants: 10,
        subscribers: 10,
        vacancies: 10,
      },
      sessionUser: makeSessionUser(student),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course students data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseStudentsData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        entrants: 10,
        subscribers: 10,
        vacancies: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
