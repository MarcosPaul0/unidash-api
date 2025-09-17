import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseTeachingComplementaryActivitiesDataUseCase } from './delete-course-teaching-complementary-activities-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseTeachingComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-teaching-complementary-activities-data-repository';
import { makeCourseTeachingComplementaryActivitiesData } from 'test/factories/make-course-teaching-complementary-activities-data';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseTeachingComplementaryActivitiesDataRepository: InMemoryCourseTeachingComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseTeachingComplementaryActivitiesDataUseCase;

describe('Delete Course Teaching Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseTeachingComplementaryActivitiesDataRepository =
      new InMemoryCourseTeachingComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseTeachingComplementaryActivitiesDataUseCase(
      inMemoryCourseTeachingComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course teaching complementary activities data', async () => {
    const adminUser = makeAdmin();
    const newCourseTeachingComplementaryActivitiesData =
      makeCourseTeachingComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseTeachingComplementaryActivitiesData-1'),
      );

    inMemoryCourseTeachingComplementaryActivitiesDataRepository.create(
      newCourseTeachingComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesDataId:
        'courseTeachingComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseTeachingComplementaryActivitiesDataRepository.courseTeachingComplementaryActivitiesData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course teaching complementary activities data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesDataId:
        'courseTeachingComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course teaching complementary activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseTeachingComplementaryActivitiesData =
      makeCourseTeachingComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseTeachingComplementaryActivitiesData-1'),
      );

    inMemoryCourseTeachingComplementaryActivitiesDataRepository.create(
      newCourseTeachingComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesDataId:
        'courseTeachingComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course teaching complementary activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseTeachingComplementaryActivitiesData =
      makeCourseTeachingComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseTeachingComplementaryActivitiesData-1'),
      );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseTeachingComplementaryActivitiesDataRepository.create(
      newCourseTeachingComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseTeachingComplementaryActivitiesDataId:
        'courseTeachingComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
