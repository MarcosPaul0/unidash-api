import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository';
import { FindAllStudentsByCourseUseCase } from './find-all-students-by-course';
import { makeStudent } from 'test/factories/make-student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { makeSessionUser } from 'test/factories/make-session-user';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: FindAllStudentsByCourseUseCase;

describe('Find All Students By Course', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new FindAllStudentsByCourseUseCase(
      inMemoryStudentsRepository,
      authorizationService,
    );
  });

  it('should be able to find all students', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const teacherCourse = makeTeacherCourse({
      teacher,
      teacherId: 'teacher-1',
      courseId: 'course-1',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const student1 = makeStudent({
      courseId: 'course-1',
    });
    const student2 = makeStudent();
    const student3 = makeStudent();

    inMemoryStudentsRepository.items.push(student1, student2, student3);

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      students: [student1, student2],
      totalItems: 3,
      totalPages: 2,
    });
  });

  it('should not be able to find all students if session user is a teacher outside of course', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to find all students if session user is a student', async () => {
    const student = makeStudent();

    const result = await sut.execute({
      courseId: 'course-1',
      pagination: { page: 1, itemsPerPage: 2 },
      sessionUser: makeSessionUser(student),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
