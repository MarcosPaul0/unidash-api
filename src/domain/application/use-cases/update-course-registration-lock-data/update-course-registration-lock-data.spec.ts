import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { UpdateCourseRegistrationLockDataUseCase } from './update-course-registration-lock-data';
import { InMemoryCourseRegistrationLockDataRepository } from 'test/repositories/in-memory-course-registration-lock-data-repository';
import { makeCourseRegistrationLockData } from 'test/factories/make-course-registration-lock-data';

let inMemoryCourseRegistrationLockDataRepository: InMemoryCourseRegistrationLockDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: UpdateCourseRegistrationLockDataUseCase;

describe('Update Course RegistrationLock Data', () => {
  beforeEach(() => {
    inMemoryCourseRegistrationLockDataRepository =
      new InMemoryCourseRegistrationLockDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateCourseRegistrationLockDataUseCase(
      inMemoryCourseRegistrationLockDataRepository,
      authorizationService,
    );
  });

  it('should be able to update course registration lock data', async () => {
    const adminUser = makeAdmin();
    const courseRegistrationLockData = makeCourseRegistrationLockData(
      {},
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryCourseRegistrationLockDataRepository.create(
      courseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      data: {
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

  it('should not be able to update course registration lock data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      data: {
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

  it('should not be able to update course registration lock data if session user is student', async () => {
    const studentUser = makeStudent();
    const courseRegistrationLockData = makeCourseRegistrationLockData(
      {},
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryCourseRegistrationLockDataRepository.create(
      courseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      data: {
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

  it('should not be able to update course registration lock data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const courseRegistrationLockData = makeCourseRegistrationLockData(
      {},
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseRegistrationLockDataRepository.create(
      courseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      data: {
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
