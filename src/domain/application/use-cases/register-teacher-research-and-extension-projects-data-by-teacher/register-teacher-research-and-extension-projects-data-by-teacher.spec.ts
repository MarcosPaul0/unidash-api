import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCase } from './register-teacher-research-and-extension-projects-data-by-teacher';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeTeacher } from 'test/factories/make-teacher';
import { InMemoryTeacherResearchAndExtensionProjectsDataRepository } from 'test/repositories/in-memory-teacher-research-and-extension-projects-data-repository';
import { makeTeacherResearchAndExtensionProjectsData } from 'test/factories/make-teacher-research-and-extension-projects-data';
import { TeacherResearchAndExtensionProjectsDataAlreadyExistsError } from '../errors/teacher-research-and-extension-projects-data-already-exists-error';

let inMemoryTeacherResearchAndExtensionProjectsDataRepository: InMemoryTeacherResearchAndExtensionProjectsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCase;

describe('Register Teacher Research And Extension Projects Data By Teacher', () => {
  beforeEach(() => {
    inMemoryTeacherResearchAndExtensionProjectsDataRepository =
      new InMemoryTeacherResearchAndExtensionProjectsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCase(
      inMemoryTeacherResearchAndExtensionProjectsDataRepository,
      authorizationService,
    );
  });

  it('should be able to register teacher research and extension projects data', async () => {
    const teacher = makeTeacher();

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherResearchAndExtensionProjectsData:
        inMemoryTeacherResearchAndExtensionProjectsDataRepository
          .teacherResearchAndExtensionProjectsData[0],
    });
  });

  it('should not be able to register teacher research and extension projects data if already exists', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newTeacherResearchAndExtensionProjectsData =
      makeTeacherResearchAndExtensionProjectsData(
        {
          semester: 'first',
          year: 2025,
          teacherId: 'teacher-1',
        },
        new UniqueEntityId('TeacherResearchAndExtensionProjectsData-1'),
      );

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.create(
      newTeacherResearchAndExtensionProjectsData,
    );

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      TeacherResearchAndExtensionProjectsDataAlreadyExistsError,
    );
  });

  it('should not be able to register teacher research and extension projects data if session user is student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(student),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
