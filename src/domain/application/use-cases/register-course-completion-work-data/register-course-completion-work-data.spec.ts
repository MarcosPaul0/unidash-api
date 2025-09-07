import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { RegisterCourseCompletionWorkDataUseCase } from './register-course-completion-work-data';
import { InMemoryCourseCompletionWorkDataRepository } from 'test/repositories/in-memory-course-completion-work-data-repository';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeCourseCompletionWorkData } from 'test/factories/make-course-completion-work-data';
import { CourseCompletionWorkDataAlreadyExistsError } from '../errors/course-completion-work-data-already-exists-error';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCourseCompletionWorkDataRepository: InMemoryCourseCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseCompletionWorkDataUseCase;

describe('Register Course Completion Work Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryCourseCompletionWorkDataRepository =
      new InMemoryCourseCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseCompletionWorkDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCourseCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course completion work data', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        enrollments: 10,
        defenses: 10,
        abandonments: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseCompletionWorkData:
        inMemoryCourseCompletionWorkDataRepository.courseCompletionWorkData[0],
    });
  });

  it('should not be able to register course completion work data if course not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        enrollments: 10,
        defenses: 10,
        abandonments: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course completion work data if already exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseCompletionWorkData = makeCourseCompletionWorkData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('CourseCompletionWorkData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryCourseCompletionWorkDataRepository.create(
      newCourseCompletionWorkData,
    );

    const result = await sut.execute({
      courseCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        enrollments: 10,
        defenses: 10,
        abandonments: 10,
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(CourseCompletionWorkDataAlreadyExistsError);
  });

  it('should not be able to register course completion work data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        enrollments: 10,
        defenses: 10,
        abandonments: 10,
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course completion work data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseCompletionWorkData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        enrollments: 10,
        defenses: 10,
        abandonments: 10,
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
