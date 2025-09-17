import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseExtensionActivitiesDataUseCase } from './register-course-extension-activities-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryCourseExtensionActivitiesDataRepository } from 'test/repositories/in-memory-course-extension-activities-data-repository';
import { makeCourseExtensionActivitiesData } from 'test/factories/make-course-extension-activities-data copy';
import { CourseExtensionActivitiesDataAlreadyExistsError } from '../errors/course-extension-activities-data-already-exists-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseExtensionActivitiesDataRepository: InMemoryCourseExtensionActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseExtensionActivitiesDataUseCase;

describe('Register Course Extension Activities Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseExtensionActivitiesDataRepository =
      new InMemoryCourseExtensionActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseExtensionActivitiesDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseExtensionActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course extension activities data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseExtensionActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        specialProjects: 10,
        participationInCompetitions: 10,
        entrepreneurshipAndInnovation: 10,
        eventOrganization: 10,
        externalInternship: 10,
        cultureAndExtensionProjects: 10,
        semiannualProjects: 10,
        workNonGovernmentalOrganization: 10,
        juniorCompanies: 10,
        provisionOfServicesWithSelfEmployedWorkers: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseExtensionActivitiesData:
        inMemoryCourseExtensionActivitiesDataRepository
          .courseExtensionActivitiesData[0],
    });
  });

  it('should not be able to register course extension activities data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseExtensionActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        specialProjects: 10,
        participationInCompetitions: 10,
        entrepreneurshipAndInnovation: 10,
        eventOrganization: 10,
        externalInternship: 10,
        cultureAndExtensionProjects: 10,
        semiannualProjects: 10,
        workNonGovernmentalOrganization: 10,
        juniorCompanies: 10,
        provisionOfServicesWithSelfEmployedWorkers: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course extension activities data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseExtensionActivitiesData = makeCourseExtensionActivitiesData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseExtensionActivitiesData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseExtensionActivitiesDataRepository.create(
      newCourseExtensionActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        specialProjects: 10,
        participationInCompetitions: 10,
        entrepreneurshipAndInnovation: 10,
        eventOrganization: 10,
        externalInternship: 10,
        cultureAndExtensionProjects: 10,
        semiannualProjects: 10,
        workNonGovernmentalOrganization: 10,
        juniorCompanies: 10,
        provisionOfServicesWithSelfEmployedWorkers: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      CourseExtensionActivitiesDataAlreadyExistsError,
    );
  });

  it('should not be able to register course extension activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseExtensionActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        specialProjects: 10,
        participationInCompetitions: 10,
        entrepreneurshipAndInnovation: 10,
        eventOrganization: 10,
        externalInternship: 10,
        cultureAndExtensionProjects: 10,
        semiannualProjects: 10,
        workNonGovernmentalOrganization: 10,
        juniorCompanies: 10,
        provisionOfServicesWithSelfEmployedWorkers: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course extension activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseExtensionActivitiesData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        specialProjects: 10,
        participationInCompetitions: 10,
        entrepreneurshipAndInnovation: 10,
        eventOrganization: 10,
        externalInternship: 10,
        cultureAndExtensionProjects: 10,
        semiannualProjects: 10,
        workNonGovernmentalOrganization: 10,
        juniorCompanies: 10,
        provisionOfServicesWithSelfEmployedWorkers: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
