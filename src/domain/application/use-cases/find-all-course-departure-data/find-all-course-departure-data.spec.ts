import { FindAllCourseDepartureDataUseCase } from './find-all-course-departure-data';
import { InMemoryCourseDepartureDataRepository } from 'test/repositories/in-memory-course-departure-data-repository';
import { makeCourseDepartureData } from 'test/factories/make-course-departure-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryCourseDepartureDataRepository: InMemoryCourseDepartureDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllCourseDepartureDataUseCase;

describe('Find All Course Departure Data', () => {
  beforeEach(() => {
    inMemoryCourseDepartureDataRepository =
      new InMemoryCourseDepartureDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllCourseDepartureDataUseCase(
      inMemoryCourseDepartureDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all course departure data', async () => {
    const admin = makeAdmin();

    const courseDepartureData1 = makeCourseDepartureData({
      courseId: 'course-1',
    });
    const courseDepartureData2 = makeCourseDepartureData({
      courseId: 'course-1',
    });
    const courseDepartureData3 = makeCourseDepartureData({
      courseId: 'course-1',
    });

    inMemoryCourseDepartureDataRepository.courseDepartureData.push(
      courseDepartureData1,
      courseDepartureData2,
      courseDepartureData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseDepartureData: [courseDepartureData1, courseDepartureData2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all course departure data with filters', async () => {
    const admin = makeAdmin();

    const courseDepartureData1 = makeCourseDepartureData({
      courseId: 'course-1',
      semester: 'first',
      year: 2025,
    });
    const courseDepartureData2 = makeCourseDepartureData({
      courseId: 'course-1',
      semester: 'second',
      year: 2025,
    });
    const courseDepartureData3 = makeCourseDepartureData({
      courseId: 'course-1',
      semester: 'second',
      year: 2024,
    });

    inMemoryCourseDepartureDataRepository.courseDepartureData.push(
      courseDepartureData1,
      courseDepartureData2,
      courseDepartureData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseDepartureData: [courseDepartureData3],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
