import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseTeachingComplementaryActivitiesDataUseCase } from './register-course-teaching-complementary-activities-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseTeachingComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-teaching-complementary-activities-data-repository';
import { CourseTeachingComplementaryActivitiesDataAlreadyExistsError } from '../errors/course-teaching-complementary-activities-data-already-exists-error';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeCourseTeachingComplementaryActivitiesData } from 'test/factories/make-course-teaching-complementary-activities-data';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseTeachingComplementaryActivitiesDataRepository: InMemoryCourseTeachingComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseTeachingComplementaryActivitiesDataUseCase;

describe('Register Course Teaching Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseTeachingComplementaryActivitiesDataRepository =
      new InMemoryCourseTeachingComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseTeachingComplementaryActivitiesDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseTeachingComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course teaching complementary activities data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        subjectMonitoring: 10,
        sponsorshipOfNewStudents: 10,
        providingTraining: 10,
        coursesInTheArea: 10,
        coursesOutsideTheArea: 10,
        electivesDisciplines: 10,
        complementaryCoursesInTheArea: 10,
        preparationForTest: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseTeachingComplementaryActivitiesData:
        inMemoryCourseTeachingComplementaryActivitiesDataRepository
          .courseTeachingComplementaryActivitiesData[0],
    });
  });

  it('should not be able to register course teaching complementary activities data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        subjectMonitoring: 10,
        sponsorshipOfNewStudents: 10,
        providingTraining: 10,
        coursesInTheArea: 10,
        coursesOutsideTheArea: 10,
        electivesDisciplines: 10,
        complementaryCoursesInTheArea: 10,
        preparationForTest: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course teaching complementary activities data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseTeachingComplementaryActivitiesData =
      makeCourseTeachingComplementaryActivitiesData(
        { semester: 'first', year: 2025, courseId: 'course-1' },
        new UniqueEntityId('courseTeachingComplementaryActivitiesData-1'),
      );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseTeachingComplementaryActivitiesDataRepository.create(
      newCourseTeachingComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        subjectMonitoring: 10,
        sponsorshipOfNewStudents: 10,
        providingTraining: 10,
        coursesInTheArea: 10,
        coursesOutsideTheArea: 10,
        electivesDisciplines: 10,
        complementaryCoursesInTheArea: 10,
        preparationForTest: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      CourseTeachingComplementaryActivitiesDataAlreadyExistsError,
    );
  });

  it('should not be able to register course teaching complementary activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        subjectMonitoring: 10,
        sponsorshipOfNewStudents: 10,
        providingTraining: 10,
        coursesInTheArea: 10,
        coursesOutsideTheArea: 10,
        electivesDisciplines: 10,
        complementaryCoursesInTheArea: 10,
        preparationForTest: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course teaching complementary activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        subjectMonitoring: 10,
        sponsorshipOfNewStudents: 10,
        providingTraining: 10,
        coursesInTheArea: 10,
        coursesOutsideTheArea: 10,
        electivesDisciplines: 10,
        complementaryCoursesInTheArea: 10,
        preparationForTest: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
