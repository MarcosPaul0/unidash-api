import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseExtensionActivitiesDataUseCase } from './delete-course-extension-activities-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryCourseExtensionActivitiesDataRepository } from 'test/repositories/in-memory-course-extension-activities-data-repository';
import { makeCourseExtensionActivitiesData } from 'test/factories/make-course-extension-activities-data copy';

let inMemoryCourseExtensionActivitiesDataRepository: InMemoryCourseExtensionActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseExtensionActivitiesDataUseCase;

describe('Delete Course Extension Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseExtensionActivitiesDataRepository =
      new InMemoryCourseExtensionActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseExtensionActivitiesDataUseCase(
      inMemoryCourseExtensionActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course extension activities data', async () => {
    const adminUser = makeAdmin();
    const newCourseExtensionActivitiesData = makeCourseExtensionActivitiesData(
      {},
      new UniqueEntityId('courseExtensionActivitiesData-1'),
    );

    inMemoryCourseExtensionActivitiesDataRepository.create(
      newCourseExtensionActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionActivitiesDataId: 'courseExtensionActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseExtensionActivitiesDataRepository.courseExtensionActivitiesData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course extension activities data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseExtensionActivitiesDataId: 'courseExtensionActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course extension activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseExtensionActivitiesData = makeCourseExtensionActivitiesData(
      {},
      new UniqueEntityId('courseExtensionActivitiesData-1'),
    );

    inMemoryCourseExtensionActivitiesDataRepository.create(
      newCourseExtensionActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionActivitiesDataId: 'courseExtensionActivitiesData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course extension activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseExtensionActivitiesData = makeCourseExtensionActivitiesData(
      {},
      new UniqueEntityId('courseExtensionActivitiesData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseExtensionActivitiesDataRepository.create(
      newCourseExtensionActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionActivitiesDataId: 'courseExtensionActivitiesData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
