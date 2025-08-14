import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseRegistrationLockDataUseCase } from './delete-course-registration-lock-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseRegistrationLockDataRepository } from 'test/repositories/in-memory-course-registration-lock-data-repository';
import { makeCourseRegistrationLockData } from 'test/factories/make-course-registration-lock-data';

let inMemoryCourseRegistrationLockDataRepository: InMemoryCourseRegistrationLockDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseRegistrationLockDataUseCase;

describe('Delete Course Registration Lock Data', () => {
  beforeEach(() => {
    inMemoryCourseRegistrationLockDataRepository =
      new InMemoryCourseRegistrationLockDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseRegistrationLockDataUseCase(
      inMemoryCourseRegistrationLockDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course registration lock data', async () => {
    const adminUser = makeAdmin();
    const newCourseRegistrationLockData = makeCourseRegistrationLockData(
      {},
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryCourseRegistrationLockDataRepository.create(
      newCourseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseRegistrationLockDataRepository.courseRegistrationLockData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course registration lock data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course registration lock data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseRegistrationLockData = makeCourseRegistrationLockData(
      {},
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryCourseRegistrationLockDataRepository.create(
      newCourseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course registration lock data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseRegistrationLockData = makeCourseRegistrationLockData(
      {},
      new UniqueEntityId('courseRegistrationLockData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseRegistrationLockDataRepository.create(
      newCourseRegistrationLockData,
    );

    const result = await sut.execute({
      courseRegistrationLockDataId: 'courseRegistrationLockData-1',
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
