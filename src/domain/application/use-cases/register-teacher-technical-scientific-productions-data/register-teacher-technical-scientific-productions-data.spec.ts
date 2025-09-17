import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherTechnicalScientificProductionsDataRepository } from 'test/repositories/in-memory-teacher-technical-scientific-productions-data-repository';
import { RegisterTeacherTechnicalScientificProductionsDataUseCase } from './register-teacher-technical-scientific-productions-data';
import { makeTeacherTechnicalScientificProductionsData } from 'test/factories/make-teacher-technical-scientific-productions-data';
import { TeacherTechnicalScientificProductionsDataAlreadyExistsError } from '../errors/teacher-technical-scientific-productions-data-already-exists-error';

let inMemoryTeacherTechnicalScientificProductionsDataRepository: InMemoryTeacherTechnicalScientificProductionsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterTeacherTechnicalScientificProductionsDataUseCase;

describe('Register Teacher Technical Scientific Productions Data', () => {
  beforeEach(() => {
    inMemoryTeacherTechnicalScientificProductionsDataRepository =
      new InMemoryTeacherTechnicalScientificProductionsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherTechnicalScientificProductionsDataUseCase(
      inMemoryTeacherTechnicalScientificProductionsDataRepository,
      authorizationService,
    );
  });

  it('should be able to register teacher technical scientific productions data', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        abstracts: 10,
        booksChapter: 10,
        congress: 10,
        periodicals: 10,
        programs: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherTechnicalScientificProductionsData:
        inMemoryTeacherTechnicalScientificProductionsDataRepository
          .teacherTechnicalScientificProductionsData[0],
    });
  });

  it('should not be able to register teacher technical scientific productions data if already exists', async () => {
    const adminUser = makeAdmin();
    const newTeacherTechnicalScientificProductionsData =
      makeTeacherTechnicalScientificProductionsData(
        { semester: 'first', year: 2025 },
        new UniqueEntityId('TeacherTechnicalScientificProductionsData-1'),
      );

    inMemoryTeacherTechnicalScientificProductionsDataRepository.create(
      newTeacherTechnicalScientificProductionsData,
    );

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        abstracts: 10,
        booksChapter: 10,
        congress: 10,
        periodicals: 10,
        programs: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      TeacherTechnicalScientificProductionsDataAlreadyExistsError,
    );
  });

  it('should not be able to register teacher technical scientific productions data if session user is student', async () => {
    const studentUser = makeStudent();

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        abstracts: 10,
        booksChapter: 10,
        congress: 10,
        periodicals: 10,
        programs: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register teacher technical scientific productions data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });

    inMemoryTeacherCoursesRepository.create(teacherCourse);

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        abstracts: 10,
        booksChapter: 10,
        congress: 10,
        periodicals: 10,
        programs: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
