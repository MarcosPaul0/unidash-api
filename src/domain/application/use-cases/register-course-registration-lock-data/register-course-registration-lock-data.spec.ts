import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseRegistrationLockDataRepository } from 'test/repositories/in-memory-course-registration-lock-data-repository';
import { RegisterCourseRegistrationLockDataUseCase } from './register-course-registration-lock-data';
import { makeCourseRegistrationLockData } from 'test/factories/make-course-registration-lock-data';
import { CourseRegistrationLockDataAlreadyExistsError } from '../errors/course-registration-lock-data-already-exists-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseRegistrationLockDataRepository: InMemoryCourseRegistrationLockDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseRegistrationLockDataUseCase;

describe('Register Course RegistrationLock Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseRegistrationLockDataRepository =
      new InMemoryCourseRegistrationLockDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseRegistrationLockDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseRegistrationLockDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course registration lock data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseRegistrationLockData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        difficultyInDiscipline: 10,
        workload: 10,
        teacherMethodology: 10,
        incompatibilityWithWork: 10,
        lossOfInterest: 10,
        other: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseRegistrationLockData:
        inMemoryCourseRegistrationLockDataRepository
          .courseRegistrationLockData[0],
    });
  });

  it('should not be able to register course registration lock data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseRegistrationLockData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        difficultyInDiscipline: 10,
        workload: 10,
        teacherMethodology: 10,
        incompatibilityWithWork: 10,
        lossOfInterest: 10,
        other: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course registration lock data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseRegistrationLockData = makeCourseRegistrationLockData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseRegistrationLockDataRepository.create(
      newCourseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        difficultyInDiscipline: 10,
        workload: 10,
        teacherMethodology: 10,
        incompatibilityWithWork: 10,
        lossOfInterest: 10,
        other: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      CourseRegistrationLockDataAlreadyExistsError,
    );
  });

  it('should not be able to register course registration lock data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseRegistrationLockData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        difficultyInDiscipline: 10,
        workload: 10,
        teacherMethodology: 10,
        incompatibilityWithWork: 10,
        lossOfInterest: 10,
        other: 10,
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course registration lock data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseRegistrationLockData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        difficultyInDiscipline: 10,
        workload: 10,
        teacherMethodology: 10,
        incompatibilityWithWork: 10,
        lossOfInterest: 10,
        other: 10,
      },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
