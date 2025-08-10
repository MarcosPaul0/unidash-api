import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseDepartureDataUseCase } from './delete-course-departure-data';
import { InMemoryCourseDepartureDataRepository } from 'test/repositories/in-memory-course-departure-data-repository';
import { makeCourseDepartureData } from 'test/factories/make-course-departure-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';

let inMemoryCourseDepartureDataRepository: InMemoryCourseDepartureDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseDepartureDataUseCase;

describe('Delete Course Departure Data', () => {
  beforeEach(() => {
    inMemoryCourseDepartureDataRepository =
      new InMemoryCourseDepartureDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseDepartureDataUseCase(
      inMemoryCourseDepartureDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course departure data', async () => {
    const adminUser = makeAdmin();
    const newCourseDepartureData = makeCourseDepartureData(
      {},
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryCourseDepartureDataRepository.create(newCourseDepartureData);

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseDepartureDataRepository.courseDepartureData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course departure data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course departure data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseDepartureData = makeCourseDepartureData(
      {},
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryCourseDepartureDataRepository.create(newCourseDepartureData);

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course departure data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseDepartureData = makeCourseDepartureData(
      {},
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseDepartureDataRepository.create(newCourseDepartureData);

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
