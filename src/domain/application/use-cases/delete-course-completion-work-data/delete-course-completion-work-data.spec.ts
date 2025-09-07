import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseCompletionWorkDataRepository } from 'test/repositories/in-memory-course-completion-work-data-repository';
import { DeleteCourseCompletionWorkDataUseCase } from './delete-course-completion-work-data';
import { makeCourseCompletionWorkData } from 'test/factories/make-course-completion-work-data';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseCompletionWorkDataRepository: InMemoryCourseCompletionWorkDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseCompletionWorkDataUseCase;

describe('Delete Course Completion Work Data', () => {
  beforeEach(() => {
    inMemoryCourseCompletionWorkDataRepository =
      new InMemoryCourseCompletionWorkDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseCompletionWorkDataUseCase(
      inMemoryCourseCompletionWorkDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course completion work data', async () => {
    const adminUser = makeAdmin();
    const newCourseCompletionWorkData = makeCourseCompletionWorkData(
      {},
      new UniqueEntityId('courseCompletionWorkData-1'),
    );

    inMemoryCourseCompletionWorkDataRepository.create(
      newCourseCompletionWorkData,
    );

    const result = await sut.execute({
      courseCompletionWorkDataId: 'courseCompletionWorkData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseCompletionWorkDataRepository.courseCompletionWorkData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course completion work data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseCompletionWorkDataId: 'courseCompletionWorkData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course completion work data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseCompletionWorkData = makeCourseCompletionWorkData(
      {},
      new UniqueEntityId('courseCompletionWorkData-1'),
    );

    inMemoryCourseCompletionWorkDataRepository.create(
      newCourseCompletionWorkData,
    );

    const result = await sut.execute({
      courseCompletionWorkDataId: 'courseCompletionWorkData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course completion work data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseCompletionWorkData = makeCourseCompletionWorkData(
      {},
      new UniqueEntityId('courseCompletionWorkData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseCompletionWorkDataRepository.create(
      newCourseCompletionWorkData,
    );

    const result = await sut.execute({
      courseCompletionWorkDataId: 'courseCompletionWorkData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
