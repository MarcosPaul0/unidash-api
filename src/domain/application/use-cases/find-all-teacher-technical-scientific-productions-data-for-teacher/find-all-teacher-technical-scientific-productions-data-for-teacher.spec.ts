import { FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCase } from './find-all-teacher-technical-scientific-productions-data-for-teacher';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherTechnicalScientificProductionsDataRepository } from 'test/repositories/in-memory-teacher-technical-scientific-productions-data-repository';
import { makeTeacherTechnicalScientificProductionsData } from 'test/factories/make-teacher-technical-scientific-productions-data';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryTeacherTechnicalScientificProductionsDataRepository: InMemoryTeacherTechnicalScientificProductionsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCase;

describe('Find All Teacher Technical Scientific Productions Data ForTeacher', () => {
  beforeEach(() => {
    inMemoryTeacherTechnicalScientificProductionsDataRepository =
      new InMemoryTeacherTechnicalScientificProductionsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCase(
      inMemoryTeacherTechnicalScientificProductionsDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all teacher technical scientific productions data', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherTechnicalScientificProductionsData1 =
      makeTeacherTechnicalScientificProductionsData({
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherTechnicalScientificProductionsData2 =
      makeTeacherTechnicalScientificProductionsData({
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherTechnicalScientificProductionsData3 =
      makeTeacherTechnicalScientificProductionsData({
        teacher,
        teacherId: 'teacher-1',
      });

    inMemoryTeacherTechnicalScientificProductionsDataRepository.teacherTechnicalScientificProductionsData.push(
      teacherTechnicalScientificProductionsData1,
      teacherTechnicalScientificProductionsData2,
      teacherTechnicalScientificProductionsData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherTechnicalScientificProductionsData: [
        teacherTechnicalScientificProductionsData1,
        teacherTechnicalScientificProductionsData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all teacher technical scientific productions data with filters', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherTechnicalScientificProductionsData1 =
      makeTeacherTechnicalScientificProductionsData({
        semester: 'first',
        year: 2025,
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherTechnicalScientificProductionsData2 =
      makeTeacherTechnicalScientificProductionsData({
        semester: 'second',
        year: 2025,
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherTechnicalScientificProductionsData3 =
      makeTeacherTechnicalScientificProductionsData({
        semester: 'second',
        year: 2024,
        teacher,
        teacherId: 'teacher-1',
      });

    inMemoryTeacherTechnicalScientificProductionsDataRepository.teacherTechnicalScientificProductionsData.push(
      teacherTechnicalScientificProductionsData1,
      teacherTechnicalScientificProductionsData2,
      teacherTechnicalScientificProductionsData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherTechnicalScientificProductionsData: [
        teacherTechnicalScientificProductionsData3,
      ],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
