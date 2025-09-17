import { FindAllTeacherResearchAndExtensionProjectsDataUseCase } from './find-all-teacher-research-and-extension-projects-data';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherResearchAndExtensionProjectsDataRepository } from 'test/repositories/in-memory-teacher-research-and-extension-projects-data-repository';
import { makeTeacherResearchAndExtensionProjectsData } from 'test/factories/make-teacher-research-and-extension-projects-data';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryTeacherResearchAndExtensionProjectsDataRepository: InMemoryTeacherResearchAndExtensionProjectsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllTeacherResearchAndExtensionProjectsDataUseCase;

describe('Find All Teacher Research And Extension Projects Data', () => {
  beforeEach(() => {
    inMemoryTeacherResearchAndExtensionProjectsDataRepository =
      new InMemoryTeacherResearchAndExtensionProjectsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllTeacherResearchAndExtensionProjectsDataUseCase(
      inMemoryTeacherResearchAndExtensionProjectsDataRepository,
      authorizationService,
    );
  });

  it('should be able to find all teacher research and extension projects data', async () => {
    const admin = makeAdmin();

    const teacherResearchAndExtensionProjectsData1 =
      makeTeacherResearchAndExtensionProjectsData({
        teacherId: 'teacher-1',
      });
    const teacherResearchAndExtensionProjectsData2 =
      makeTeacherResearchAndExtensionProjectsData({
        teacherId: 'teacher-1',
      });
    const teacherResearchAndExtensionProjectsData3 =
      makeTeacherResearchAndExtensionProjectsData({
        teacherId: 'teacher-1',
      });

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.teacherResearchAndExtensionProjectsData.push(
      teacherResearchAndExtensionProjectsData1,
      teacherResearchAndExtensionProjectsData2,
      teacherResearchAndExtensionProjectsData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'first', year: 2025 },
      sessionUser: makeSessionUser(admin),
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
    const admin = makeAdmin();

    const teacherResearchAndExtensionProjectsData1 =
      makeTeacherResearchAndExtensionProjectsData({
        semester: 'first',
        year: 2025,
      });
    const teacherResearchAndExtensionProjectsData2 =
      makeTeacherResearchAndExtensionProjectsData({
        semester: 'second',
        year: 2025,
      });
    const teacherResearchAndExtensionProjectsData3 =
      makeTeacherResearchAndExtensionProjectsData({
        semester: 'second',
        year: 2024,
      });

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.teacherResearchAndExtensionProjectsData.push(
      teacherResearchAndExtensionProjectsData1,
      teacherResearchAndExtensionProjectsData2,
      teacherResearchAndExtensionProjectsData3,
    );

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      filters: { semester: 'second', year: 2024 },
      sessionUser: makeSessionUser(admin),
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
