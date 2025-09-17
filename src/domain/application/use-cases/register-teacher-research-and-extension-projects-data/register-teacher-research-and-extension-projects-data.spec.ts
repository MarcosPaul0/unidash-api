import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterTeacherResearchAndExtensionProjectsDataUseCase } from './register-teacher-research-and-extension-projects-data';
import { makeCourse } from 'test/factories/make-course';
import { makeSessionUser } from 'test/factories/make-session-user';
import { InMemoryTeacherResearchAndExtensionProjectsDataRepository } from 'test/repositories/in-memory-teacher-research-and-extension-projects-data-repository';
import { makeTeacherResearchAndExtensionProjectsData } from 'test/factories/make-teacher-research-and-extension-projects-data';
import { TeacherResearchAndExtensionProjectsDataAlreadyExistsError } from '../errors/teacher-research-and-extension-projects-data-already-exists-error';

let inMemoryTeacherResearchAndExtensionProjectsDataRepository: InMemoryTeacherResearchAndExtensionProjectsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterTeacherResearchAndExtensionProjectsDataUseCase;

describe('Register Teacher Research And Extension Projects Data', () => {
  beforeEach(() => {
    inMemoryTeacherResearchAndExtensionProjectsDataRepository =
      new InMemoryTeacherResearchAndExtensionProjectsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherResearchAndExtensionProjectsDataUseCase(
      inMemoryTeacherResearchAndExtensionProjectsDataRepository,
      authorizationService,
    );
  });

  it('should be able to register teacher research and extension projects data', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherResearchAndExtensionProjectsData:
        inMemoryTeacherResearchAndExtensionProjectsDataRepository
          .teacherResearchAndExtensionProjectsData[0],
    });
  });

  it('should not be able to register teacher research and extension projects data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newTeacherResearchAndExtensionProjectsData =
      makeTeacherResearchAndExtensionProjectsData(
        { semester: 'first', year: 2025 },
        new UniqueEntityId('TeacherResearchAndExtensionProjectsData-1'),
      );

    inMemoryTeacherResearchAndExtensionProjectsDataRepository.create(
      newTeacherResearchAndExtensionProjectsData,
    );

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      TeacherResearchAndExtensionProjectsDataAlreadyExistsError,
    );
  });

  it('should not be able to register teacher research and extension projects data if session user is student', async () => {
    const studentUser = makeStudent();

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register teacher research and extension projects data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });

    inMemoryTeacherCoursesRepository.create(teacherCourse);

    const result = await sut.execute({
      teacherResearchAndExtensionProjectsData: {
        teacherId: 'teacher-1',
        year: 2025,
        semester: 'first',
        extensionProjects: 10,
        researchProjects: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
