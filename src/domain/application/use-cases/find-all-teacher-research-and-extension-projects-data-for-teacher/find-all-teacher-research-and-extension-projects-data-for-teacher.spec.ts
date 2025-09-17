import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherResearchAndExtensionProjectsDataRepository } from 'test/repositories/in-memory-teacher-research-and-extension-projects-data-repository';
import { makeTeacherResearchAndExtensionProjectsData } from 'test/factories/make-teacher-research-and-extension-projects-data';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase } from './find-all-teacher-research-and-extension-projects-data-for-teacher';

let inMemoryTeacherResearchAndExtensionProjectsDataRepository: InMemoryTeacherResearchAndExtensionProjectsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase;

describe('Find All Teacher Research And Extension Projects Data For Teacher', () => {
  beforeEach(() => {
    inMemoryTeacherResearchAndExtensionProjectsDataRepository =
      new InMemoryTeacherResearchAndExtensionProjectsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase(
      inMemoryTeacherResearchAndExtensionProjectsDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all teacher research and extension projects data', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherResearchAndExtensionProjectsData1 =
      makeTeacherResearchAndExtensionProjectsData({
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherResearchAndExtensionProjectsData2 =
      makeTeacherResearchAndExtensionProjectsData({
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherResearchAndExtensionProjectsData3 =
      makeTeacherResearchAndExtensionProjectsData({
        teacher,
        teacherId: 'teacher-1',
      });

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.teacherResearchAndExtensionProjectsData.push(
      teacherResearchAndExtensionProjectsData1,
      teacherResearchAndExtensionProjectsData2,
      teacherResearchAndExtensionProjectsData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherResearchAndExtensionProjectsData: [
        teacherResearchAndExtensionProjectsData1,
        teacherResearchAndExtensionProjectsData2,
      ],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should be able to find all teacher research and extension projects data with filters', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherResearchAndExtensionProjectsData1 =
      makeTeacherResearchAndExtensionProjectsData({
        semester: 'first',
        year: 2025,
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherResearchAndExtensionProjectsData2 =
      makeTeacherResearchAndExtensionProjectsData({
        semester: 'second',
        year: 2025,
        teacher,
        teacherId: 'teacher-1',
      });
    const teacherResearchAndExtensionProjectsData3 =
      makeTeacherResearchAndExtensionProjectsData({
        semester: 'second',
        year: 2024,
        teacher,
        teacherId: 'teacher-1',
      });

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.teacherResearchAndExtensionProjectsData.push(
      teacherResearchAndExtensionProjectsData1,
      teacherResearchAndExtensionProjectsData2,
      teacherResearchAndExtensionProjectsData3,
    );

    const result = await sut.execute({
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherResearchAndExtensionProjectsData: [
        teacherResearchAndExtensionProjectsData3,
      ],
      totalItems: 1,
      totalPages: 1,
    });
  });
});
