import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseCoordinationDataUseCase } from './delete-course-coordination-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseCoordinationDataRepository } from 'test/repositories/in-memory-course-coordination-data-repository';
import { makeCourseCoordinationData } from 'test/factories/make-course-coordination-data';

let inMemoryCourseCoordinationDataRepository: InMemoryCourseCoordinationDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseCoordinationDataUseCase;

describe('Delete Course Coordination Data', () => {
  beforeEach(() => {
    inMemoryCourseCoordinationDataRepository =
      new InMemoryCourseCoordinationDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseCoordinationDataUseCase(
      inMemoryCourseCoordinationDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course coordination data', async () => {
    const adminUser = makeAdmin();
    const newCourseCoordinationData = makeCourseCoordinationData(
      {},
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryCourseCoordinationDataRepository.create(newCourseCoordinationData);

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseCoordinationDataRepository.courseCoordinationData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course coordination data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course coordination data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseCoordinationData = makeCourseCoordinationData(
      {},
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryCourseCoordinationDataRepository.create(newCourseCoordinationData);

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course coordination data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseCoordinationData = makeCourseCoordinationData(
      {},
      new UniqueEntityId('courseCoordinationData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseCoordinationDataRepository.create(newCourseCoordinationData);

    const result = await sut.execute({
      courseCoordinationDataId: 'courseCoordinationData-1',
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
