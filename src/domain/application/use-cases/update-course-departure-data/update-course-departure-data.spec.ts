import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseDepartureDataRepository } from 'test/repositories/in-memory-course-departure-data-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { UpdateCourseDepartureDataUseCase } from './update-course-departure-data';
import { makeCourseDepartureData } from 'test/factories/make-course-departure-data';

let inMemoryCourseDepartureDataRepository: InMemoryCourseDepartureDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: UpdateCourseDepartureDataUseCase;

describe('Update Course Departure Data', () => {
  beforeEach(() => {
    inMemoryCourseDepartureDataRepository =
      new InMemoryCourseDepartureDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateCourseDepartureDataUseCase(
      inMemoryCourseDepartureDataRepository,
      authorizationService,
    );
  });

  it('should be able to update course departure data', async () => {
    const adminUser = makeAdmin();
    const courseDepartureData = makeCourseDepartureData(
      {},
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryCourseDepartureDataRepository.create(courseDepartureData);

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      data: {
        completed: 10,
        maximumDuration: 10,
        dropouts: 10,
        transfers: 10,
        withdrawals: 10,
        removals: 10,
        newExams: 10,
        deaths: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseDepartureData:
        inMemoryCourseDepartureDataRepository.courseDepartureData[0],
    });
  });

  it('should not be able to update course departure data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      data: {
        completed: 10,
        maximumDuration: 10,
        dropouts: 10,
        transfers: 10,
        withdrawals: 10,
        removals: 10,
        newExams: 10,
        deaths: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to update course departure data if session user is student', async () => {
    const studentUser = makeStudent();
    const courseDepartureData = makeCourseDepartureData(
      {},
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryCourseDepartureDataRepository.create(courseDepartureData);

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      data: {
        completed: 10,
        maximumDuration: 10,
        dropouts: 10,
        transfers: 10,
        withdrawals: 10,
        removals: 10,
        newExams: 10,
        deaths: 10,
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to update course departure data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const courseDepartureData = makeCourseDepartureData(
      {},
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseDepartureDataRepository.create(courseDepartureData);

    const result = await sut.execute({
      courseDepartureDataId: 'courseDepartureData-1',
      data: {
        completed: 10,
        maximumDuration: 10,
        dropouts: 10,
        transfers: 10,
        withdrawals: 10,
        removals: 10,
        newExams: 10,
        deaths: 10,
      },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
