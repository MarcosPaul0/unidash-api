import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseSearchComplementaryActivitiesDataUseCase } from './delete-course-search-complementary-activities-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseSearchComplementaryActivitiesDataRepository } from 'test/repositories/in-memory-course-search-complementary-activities-data-repository';
import { makeCourseSearchComplementaryActivitiesData } from 'test/factories/make-course-search-complementary-activities-data';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseSearchComplementaryActivitiesDataRepository: InMemoryCourseSearchComplementaryActivitiesDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseSearchComplementaryActivitiesDataUseCase;

describe('Delete Course Search Complementary Activities Data', () => {
  beforeEach(() => {
    inMemoryCourseSearchComplementaryActivitiesDataRepository =
      new InMemoryCourseSearchComplementaryActivitiesDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseSearchComplementaryActivitiesDataUseCase(
      inMemoryCourseSearchComplementaryActivitiesDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course search complementary activities data', async () => {
    const adminUser = makeAdmin();
    const newCourseSearchComplementaryActivitiesData =
      makeCourseSearchComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseSearchComplementaryActivitiesData-1'),
      );

    inMemoryCourseSearchComplementaryActivitiesDataRepository.create(
      newCourseSearchComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseSearchComplementaryActivitiesDataId:
        'courseSearchComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseSearchComplementaryActivitiesDataRepository.courseSearchComplementaryActivitiesData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course search complementary activities data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseSearchComplementaryActivitiesDataId:
        'courseSearchComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course search complementary activities data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseSearchComplementaryActivitiesData =
      makeCourseSearchComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseSearchComplementaryActivitiesData-1'),
      );

    inMemoryCourseSearchComplementaryActivitiesDataRepository.create(
      newCourseSearchComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseSearchComplementaryActivitiesDataId:
        'courseSearchComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course search complementary activities data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseSearchComplementaryActivitiesData =
      makeCourseSearchComplementaryActivitiesData(
        {},
        new UniqueEntityId('courseSearchComplementaryActivitiesData-1'),
      );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseSearchComplementaryActivitiesDataRepository.create(
      newCourseSearchComplementaryActivitiesData,
    );

    const result = await sut.execute({
      courseSearchComplementaryActivitiesDataId:
        'courseSearchComplementaryActivitiesData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
