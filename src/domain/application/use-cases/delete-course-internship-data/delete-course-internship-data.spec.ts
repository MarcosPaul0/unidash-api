import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { InMemoryCourseInternshipDataRepository } from 'test/repositories/in-memory-course-internship-data-repository copy';
import { DeleteCourseInternshipDataUseCase } from './delete-course-internship-data';
import { makeCourseInternshipData } from 'test/factories/make-course-internship-data';
import { makeSessionUser } from 'test/factories/make-session-user';

let inMemoryCourseInternshipDataRepository: InMemoryCourseInternshipDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: DeleteCourseInternshipDataUseCase;

describe('Delete Course Internship Data', () => {
  beforeEach(() => {
    inMemoryCourseInternshipDataRepository =
      new InMemoryCourseInternshipDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new DeleteCourseInternshipDataUseCase(
      inMemoryCourseInternshipDataRepository,
      authorizationService,
    );
  });

  it('should be able to delete course internship data', async () => {
    const adminUser = makeAdmin();
    const newCourseInternshipData = makeCourseInternshipData(
      {},
      new UniqueEntityId('courseInternshipData-1'),
    );

    inMemoryCourseInternshipDataRepository.create(newCourseInternshipData);

    const result = await sut.execute({
      courseInternshipDataId: 'courseInternshipData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryCourseInternshipDataRepository.courseInternshipData,
    ).toHaveLength(0);
  });

  it('should not be able to delete course internship data if not exists', async () => {
    const adminUser = makeAdmin();

    const result = await sut.execute({
      courseInternshipDataId: 'courseInternshipData-1',
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to delete course internship data if session user is student', async () => {
    const studentUser = makeStudent();
    const newCourseInternshipData = makeCourseInternshipData(
      {},
      new UniqueEntityId('courseInternshipData-1'),
    );

    inMemoryCourseInternshipDataRepository.create(newCourseInternshipData);

    const result = await sut.execute({
      courseInternshipDataId: 'courseInternshipData-1',
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to delete course internship data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const newCourseInternshipData = makeCourseInternshipData(
      {},
      new UniqueEntityId('courseInternshipData-1'),
    );

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCourseInternshipDataRepository.create(newCourseInternshipData);

    const result = await sut.execute({
      courseInternshipDataId: 'courseInternshipData-1',
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
