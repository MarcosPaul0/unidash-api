import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { UpdateCourseStudentsDataUseCase } from './update-course-students-data';
import { makeCourseStudentsData } from 'test/factories/make-course-students-data';
import { InMemoryCourseStudentsDataRepository } from 'test/repositories/in-memory-course-students-data-repository';

let inMemoryCourseStudentsDataRepository: InMemoryCourseStudentsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: UpdateCourseStudentsDataUseCase;

describe('Update Course Students Data', () => {
  beforeEach(() => {
    inMemoryCourseStudentsDataRepository =
      new InMemoryCourseStudentsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateCourseStudentsDataUseCase(
      inMemoryCourseStudentsDataRepository,
      authorizationService,
    );
  });

  it('should be able to update course students data', async () => {
    const adminUser = makeAdmin();
    const courseStudentsData = makeCourseStudentsData(
      {},
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryCourseStudentsDataRepository.create(courseStudentsData);

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      data: {
        entrants: 10,
        actives: 10,
        locks: 10,
        canceled: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseStudentsData:
        inMemoryCourseStudentsDataRepository.courseStudentsData[0],
    });
  });

  it('should not be able to update course students data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      data: {
        entrants: 10,
        actives: 10,
        locks: 10,
        canceled: 10,
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to update course students data if session user is student', async () => {
    const studentUser = makeStudent();
    const courseStudentsData = makeCourseStudentsData(
      {},
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryCourseStudentsDataRepository.create(courseStudentsData);

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      data: {
        entrants: 10,
        actives: 10,
        locks: 10,
        canceled: 10,
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to update course students data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const courseStudentsData = makeCourseStudentsData(
      {},
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseStudentsDataRepository.create(courseStudentsData);

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      data: {
        entrants: 10,
        actives: 10,
        locks: 10,
        canceled: 10,
      },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
