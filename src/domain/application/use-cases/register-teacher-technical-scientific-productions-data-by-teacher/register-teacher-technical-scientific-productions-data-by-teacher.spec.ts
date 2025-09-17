import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase } from './register-teacher-technical-scientific-productions-data-by-teacher';
import { makeCourse } from 'test/factories/make-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeTeacher } from 'test/factories/make-teacher';
import { InMemoryTeacherTechnicalScientificProductionsDataRepository } from 'test/repositories/in-memory-teacher-technical-scientific-productions-data-repository';
import { makeTeacherTechnicalScientificProductionsData } from 'test/factories/make-teacher-technical-scientific-productions-data';
import { TeacherTechnicalScientificProductionsDataAlreadyExistsError } from '../errors/teacher-technical-scientific-productions-data-already-exists-error';

let inMemoryTeacherTechnicalScientificProductionsDataRepository: InMemoryTeacherTechnicalScientificProductionsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase;

describe('Register Teacher Technical Scientific Productions Data By Teacher', () => {
  beforeEach(() => {
    inMemoryTeacherTechnicalScientificProductionsDataRepository =
      new InMemoryTeacherTechnicalScientificProductionsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase(
      inMemoryTeacherTechnicalScientificProductionsDataRepository,
      authorizationService,
    );
  });

  it('should be able to register teacher technical scientific productions data', async () => {
    const teacher = makeTeacher();

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        year: 2025,
        semester: 'first',
        periodicals: 10,
        congress: 10,
        booksChapter: 10,
        programs: 10,
        abstracts: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherTechnicalScientificProductionsData:
        inMemoryTeacherTechnicalScientificProductionsDataRepository
          .teacherTechnicalScientificProductionsData[0],
    });
  });

  it('should not be able to register teacher technical scientific productions data if already exists', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newTeacherTechnicalScientificProductionsData =
      makeTeacherTechnicalScientificProductionsData(
        {
          semester: 'first',
          year: 2025,
          teacherId: 'teacher-1',
        },
        new UniqueEntityId('TeacherTechnicalScientificProductionsData-1'),
      );

    inMemoryTeacherTechnicalScientificProductionsDataRepository.create(
      newTeacherTechnicalScientificProductionsData,
    );

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        year: 2025,
        semester: 'first',
        periodicals: 10,
        congress: 10,
        booksChapter: 10,
        programs: 10,
        abstracts: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      TeacherTechnicalScientificProductionsDataAlreadyExistsError,
    );
  });

  it('should not be able to register teacher technical scientific productions data if session user is student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      teacherTechnicalScientificProductionsData: {
        year: 2025,
        semester: 'first',
        periodicals: 10,
        congress: 10,
        booksChapter: 10,
        programs: 10,
        abstracts: 10,
      },
      sessionUser: makeSessionUser(student),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
