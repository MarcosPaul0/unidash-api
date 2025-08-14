import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { DeleteCourseStudentsDataUseCase } from './delete-course-students-data';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseStudentsDataRepository } from 'test/repositories/in-memory-course-students-data-repository';
import { makeCourseStudentsData } from 'test/factories/make-course-students-data';

let inMemoryCourseStudentsDataRepository: InMemoryCourseStudentsDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseStudentsDataUseCase;

describe('Delete Course Students Data', () => {
  beforeEach(() => {
    inMemoryCourseStudentsDataRepository =
      new InMemoryCourseStudentsDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseStudentsDataUseCase(
      inMemoryCourseStudentsDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course students data', async () => {
    const adminUser = makeAdmin();
    const newCourseStudentsData = makeCourseStudentsData(
      {},
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryCourseStudentsDataRepository.create(newCourseStudentsData);

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseStudentsDataRepository.courseStudentsData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course students data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course students data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseStudentsData = makeCourseStudentsData(
      {},
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryCourseStudentsDataRepository.create(newCourseStudentsData);

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course students data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseStudentsData = makeCourseStudentsData(
      {},
      new UniqueEntityId('courseStudentsData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseStudentsDataRepository.create(newCourseStudentsData);

    const result = await sut.execute({
      courseStudentsDataId: 'courseStudentsData-1',
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
