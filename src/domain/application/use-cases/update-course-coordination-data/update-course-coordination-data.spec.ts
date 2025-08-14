import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { UpdateCourseCoordinationDataUseCase } from './update-course-coordination-data';
import { InMemoryCourseCoordinationDataRepository } from 'test/repositories/in-memory-course-coordination-data-repository';
import { makeCourseCoordinationData } from 'test/factories/make-course-coordination-data';

let inMemoryCourseCoordinationDataRepository: InMemoryCourseCoordinationDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: UpdateCourseCoordinationDataUseCase;

describe('Update Course Coordination Data', () => {
  beforeEach(() => {
    inMemoryCourseCoordinationDataRepository =
      new InMemoryCourseCoordinationDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateCourseCoordinationDataUseCase(
      inMemoryCourseCoordinationDataRepository,
      authorizationService,
    );
  });

  it('should be able to update course coordination data', async () => {
    const adminUser = makeAdmin();
    const courseCoordinationData = makeCourseCoordinationData(
      {},
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryCourseCoordinationDataRepository.create(courseCoordinationData);

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      data: {
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

  it('should not be able to update course coordination data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      data: {
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

  it('should not be able to update course coordination data if session user is student', async () => {
    const studentUser = makeStudent();
    const courseCoordinationData = makeCourseCoordinationData(
      {},
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryCourseCoordinationDataRepository.create(courseCoordinationData);

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      data: {
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

  it('should not be able to update course coordination data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const courseCoordinationData = makeCourseCoordinationData(
      {},
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseCoordinationDataRepository.create(courseCoordinationData);

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      data: {
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
