import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseCoordinationDataUseCase } from './register-course-coordination-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseCoordinationDataRepository } from 'test/repositories/in-memory-course-coordination-data-repository';
import { makeCourseCoordinationData } from 'test/factories/make-course-coordination-data';
import { CourseCoordinationDataAlreadyExistsError } from '../errors/course-coordination-data-already-exists-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseCoordinationDataRepository: InMemoryCourseCoordinationDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseCoordinationDataUseCase;

describe('Register Course Coordination Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseCoordinationDataRepository =
      new InMemoryCourseCoordinationDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseCoordinationDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseCoordinationDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course coordination data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseCoordinationData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        servicesRequestsBySystem: 10,
        servicesRequestsByEmail: 10,
        resolutionActions: 10,
        administrativeDecisionActions: 10,
        meetingsByBoardOfDirectors: 10,
        meetingsByUndergraduateChamber: 10,
        meetingsByCourseCouncil: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCoordinationData:
        inMemoryCourseCoordinationDataRepository.courseCoordinationData[0],
    });
  });

  it('should not be able to register course coordination data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseCoordinationData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        servicesRequestsBySystem: 10,
        servicesRequestsByEmail: 10,
        resolutionActions: 10,
        administrativeDecisionActions: 10,
        meetingsByBoardOfDirectors: 10,
        meetingsByUndergraduateChamber: 10,
        meetingsByCourseCouncil: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course coordination data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseCoordinationData = makeCourseCoordinationData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseCoordinationDataRepository.create(newCourseCoordinationData);

    const result = await sut.execute({
      courseCoordinationData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        servicesRequestsBySystem: 10,
        servicesRequestsByEmail: 10,
        resolutionActions: 10,
        administrativeDecisionActions: 10,
        meetingsByBoardOfDirectors: 10,
        meetingsByUndergraduateChamber: 10,
        meetingsByCourseCouncil: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(CourseCoordinationDataAlreadyExistsError);
  });

  it('should not be able to register course coordination data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseCoordinationData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        servicesRequestsBySystem: 10,
        servicesRequestsByEmail: 10,
        resolutionActions: 10,
        administrativeDecisionActions: 10,
        meetingsByBoardOfDirectors: 10,
        meetingsByUndergraduateChamber: 10,
        meetingsByCourseCouncil: 10,
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course coordination data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseCoordinationData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        servicesRequestsBySystem: 10,
        servicesRequestsByEmail: 10,
        resolutionActions: 10,
        administrativeDecisionActions: 10,
        meetingsByBoardOfDirectors: 10,
        meetingsByUndergraduateChamber: 10,
        meetingsByCourseCouncil: 10,
      },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
