import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase } from './register-teacher-supervised-completion-work-data-by-teacher';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryTeacherSupervisedCompletionWorkDataRepository } from 'test/repositories/in-memory-teacher-supervised-completion-work-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { TeacherSupervisedCompletionWorkDataAlreadyExistsError } from '../errors/teacher-supervised-completion-work-data-already-exists-error';
import { makeTeacherSupervisedCompletionWorkData } from 'test/factories/make-teacher-supervised-completion-work-data';
import { makeTeacher } from 'test/factories/make-teacher';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherSupervisedCompletionWorkDataRepository: InMemoryTeacherSupervisedCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase;

describe('Register Teacher Supervised Completion Work Data By Teacher', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherSupervisedCompletionWorkDataRepository =
      new InMemoryTeacherSupervisedCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase(
      inMemoryCoursesRepository,
      inMemoryTeacherSupervisedCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to register teacher supervised completion work data', async () => {
    const teacher = makeTeacher();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherSupervisedCompletionWorkData:
        inMemoryTeacherSupervisedCompletionWorkDataRepository
          .teacherSupervisedCompletionWorkData[0],
    });
  });

  it('should not be able to register teacher supervised completion work data if course not exists', async () => {
    const teacher = makeTeacher();

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register teacher supervised completion work data if already exists', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newTeacherSupervisedCompletionWorkData =
      makeTeacherSupervisedCompletionWorkData(
        {
          semester: 'first',
          year: 2025,
          courseId: 'course-1',
          teacherId: 'teacher-1',
        },
        new UniqueEntityId('TeacherSupervisedCompletionWorkData-1'),
      );

    inMemoryCoursesRepository.create(course);
    inMemoryTeacherSupervisedCompletionWorkDataRepository.create(
      newTeacherSupervisedCompletionWorkData,
    );

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(
      TeacherSupervisedCompletionWorkDataAlreadyExistsError,
    );
  });

  it('should not be able to register teacher supervised completion work data if session user is student', async () => {
    const student = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      teacherSupervisedCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        approved: 10,
        failed: 10,
      },
      sessionUser: makeSessionUser(student),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
