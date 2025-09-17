import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseSearchComplementaryActivitiesDataUseCase } from './register-course-search-complementary-activities-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseSearchComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-search-complementary-activities-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeCourseSearchComplementaryActivitiesData } from 'test/factories/make-course-search-complementary-activities-data';
import { CourseSearchComplementaryActivitiesDataAlreadyExistsError } from '../errors/course-search-complementary-activities-data-already-exists-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseSearchComplementaryActivitiesDataRepository: InMemoryCourseSearchComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseSearchComplementaryActivitiesDataUseCase;

describe('Register Course Search Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseSearchComplementaryActivitiesDataRepository =
      new InMemoryCourseSearchComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseSearchComplementaryActivitiesDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseSearchComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course search complementary activities data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseSearchComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        scientificInitiation: 10,
        developmentInitiation: 10,
        publishedArticles: 10,
        fullPublishedArticles: 10,
        publishedAbstracts: 10,
        presentationOfWork: 10,
        participationInEvents: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseSearchComplementaryActivitiesData:
        inMemoryCourseSearchComplementaryActivitiesDataRepository
          .courseSearchComplementaryActivitiesData[0],
    });
  });

  it('should not be able to register course search complementary activities data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseSearchComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        scientificInitiation: 10,
        developmentInitiation: 10,
        publishedArticles: 10,
        fullPublishedArticles: 10,
        publishedAbstracts: 10,
        presentationOfWork: 10,
        participationInEvents: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course search complementary activities data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseSearchComplementaryActivitiesData =
      makeCourseSearchComplementaryActivitiesData(
        { semester: 'first', year: 2025, courseId: 'course-1' },
        new UniqueEntityId('courseSearchComplementaryActivitiesData-1'),
      );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseSearchComplementaryActivitiesDataRepository.create(
      newCourseSearchComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseSearchComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        scientificInitiation: 10,
        developmentInitiation: 10,
        publishedArticles: 10,
        fullPublishedArticles: 10,
        publishedAbstracts: 10,
        presentationOfWork: 10,
        participationInEvents: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      CourseSearchComplementaryActivitiesDataAlreadyExistsError,
    );
  });

  it('should not be able to register course search complementary activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseSearchComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        scientificInitiation: 10,
        developmentInitiation: 10,
        publishedArticles: 10,
        fullPublishedArticles: 10,
        publishedAbstracts: 10,
        presentationOfWork: 10,
        participationInEvents: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course search complementary activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseSearchComplementaryActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        scientificInitiation: 10,
        developmentInitiation: 10,
        publishedArticles: 10,
        fullPublishedArticles: 10,
        publishedAbstracts: 10,
        presentationOfWork: 10,
        participationInEvents: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
