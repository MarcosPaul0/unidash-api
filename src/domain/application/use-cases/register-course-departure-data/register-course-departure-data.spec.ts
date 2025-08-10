import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryCourseDepartureDataRepository } from 'test/repositories/in-memory-course-departure-data-repository';
import { makeCourseDepartureData } from 'test/factories/make-course-departure-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseDepartureDataUseCase } from './register-course-departure-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { CourseDepartureDataAlreadyExistsError } from '../errors/course-departure-data-already-exists-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseDepartureDataRepository: InMemoryCourseDepartureDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseDepartureDataUseCase;

describe('Register Course Departure Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseDepartureDataRepository =
      new InMemoryCourseDepartureDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseDepartureDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseDepartureDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course departure data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseDepartureData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
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

  it('should not be able to register course departure data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseDepartureData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
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

  it('should not be able to register course departure data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseDepartureData = makeCourseDepartureData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseDepartureData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseDepartureDataRepository.create(newCourseDepartureData);

    const result = await sut.execute({
      courseDepartureData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
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
    expect(result.value).instanceOf(CourseDepartureDataAlreadyExistsError);
  });

  it('should not be able to register course departure data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseDepartureData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
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

  it('should not be able to register course departure data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseDepartureData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
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
