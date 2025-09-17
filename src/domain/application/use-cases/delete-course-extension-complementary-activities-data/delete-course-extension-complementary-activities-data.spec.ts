import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseExtensionComplementaryActivitiesDataUseCase } from './delete-course-extension-complementary-activities-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseExtensionComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-extension-complementary-activities-data-repository';
import { makeCourseExtensionComplementaryActivitiesData } from 'test/factories/make-course-extension-complementary-activities-data';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseExtensionComplementaryActivitiesDataRepository: InMemoryCourseExtensionComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseExtensionComplementaryActivitiesDataUseCase;

describe('Delete Course Extension Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseExtensionComplementaryActivitiesDataRepository =
      new InMemoryCourseExtensionComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseExtensionComplementaryActivitiesDataUseCase(
      inMemoryCourseExtensionComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course extension complementary activities data', async () => {
    const adminUser = makeAdmin();
    const newCourseExtensionComplementaryActivitiesData =
      makeCourseExtensionComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseExtensionComplementaryActivitiesData-1'),
      );

    inMemoryCourseExtensionComplementaryActivitiesDataRepository.create(
      newCourseExtensionComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesDataId:
        'courseExtensionComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseExtensionComplementaryActivitiesDataRepository.courseExtensionComplementaryActivitiesData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course extension complementary activities data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesDataId:
        'courseExtensionComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course Extension Complementary Activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseExtensionComplementaryActivitiesData =
      makeCourseExtensionComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseExtensionComplementaryActivitiesData-1'),
      );

    inMemoryCourseExtensionComplementaryActivitiesDataRepository.create(
      newCourseExtensionComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesDataId:
        'courseExtensionComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course extension complementary activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseExtensionComplementaryActivitiesData =
      makeCourseExtensionComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseExtensionComplementaryActivitiesData-1'),
      );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseExtensionComplementaryActivitiesDataRepository.create(
      newCourseExtensionComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseExtensionComplementaryActivitiesDataId:
        'courseExtensionComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
