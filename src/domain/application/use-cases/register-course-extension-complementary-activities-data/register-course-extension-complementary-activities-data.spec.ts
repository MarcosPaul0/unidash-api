import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseExtensionComplementaryActivitiesDataUseCase } from './register-course-extension-complementary-activities-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseExtensionComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-extension-complementary-activities-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { CourseExtensionComplementaryActivitiesDataAlreadyExistsError } from '../errors/course-extension-complementary-activities-data-already-exists-error';
import { makeCourseExtensionComplementaryActivitiesData } from 'test/factories/make-course-extension-complementary-activities-data';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseExtensionComplementaryActivitiesDataRepository: InMemoryCourseExtensionComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseExtensionComplementaryActivitiesDataUseCase;

describe('Register Course Extension Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseExtensionComplementaryActivitiesDataRepository =
      new InMemoryCourseExtensionComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseExtensionComplementaryActivitiesDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseExtensionComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course extension complementary activities data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        culturalActivities: 10,
        sportsCompetitions: 10,
        awardsAtEvents: 10,
        studentRepresentation: 10,
        participationInCollegiateBodies: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseExtensionComplementaryActivitiesData:
        inMemoryCourseExtensionComplementaryActivitiesDataRepository
          .courseExtensionComplementaryActivitiesData[0],
    });
  });

  it('should not be able to register course extension complementary activities data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        culturalActivities: 10,
        sportsCompetitions: 10,
        awardsAtEvents: 10,
        studentRepresentation: 10,
        participationInCollegiateBodies: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course extension complementary activities data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseExtensionComplementaryActivitiesData =
      makeCourseExtensionComplementaryActivitiesData(
        { semester: 'first', year: 2025, courseId: 'course-1' },
        new UniqueEntityId('courseExtensionComplementaryActivitiesData-1'),
      );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseExtensionComplementaryActivitiesDataRepository.create(
      newCourseExtensionComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        culturalActivities: 10,
        sportsCompetitions: 10,
        awardsAtEvents: 10,
        studentRepresentation: 10,
        participationInCollegiateBodies: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      CourseExtensionComplementaryActivitiesDataAlreadyExistsError,
    );
  });

  it('should not be able to register course extension complementary activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        culturalActivities: 10,
        sportsCompetitions: 10,
        awardsAtEvents: 10,
        studentRepresentation: 10,
        participationInCollegiateBodies: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course extension complementary activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        culturalActivities: 10,
        sportsCompetitions: 10,
        awardsAtEvents: 10,
        studentRepresentation: 10,
        participationInCollegiateBodies: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
