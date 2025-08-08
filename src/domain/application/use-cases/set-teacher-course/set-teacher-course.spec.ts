import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { makeUser } from 'test/factories/make-user';
import { makeCourse } from 'test/factories/make-course';
import { CourseAlreadyExistsError } from '../errors/course-already-exists-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { RegisterTeacherCourseUseCase } from './set-teacher-course';
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';

let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: RegisterTeacherCourseUseCase;

describe('Register Teacher Course', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterTeacherCourseUseCase(
      inMemoryCoursesRepository,
      inMemoryTeachersRepository,
      inMemoryTeacherCoursesRepository,
      authorizationService,
    );
  });

  it('should be able to set a teacher course with admin when teacher course not exists', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    inMemoryTeachersRepository.teachers.push(teacher);

    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'internshipManagerTeacher',
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherCourse: inMemoryTeacherCoursesRepository.teacherCourses[0],
    });
  });

  it('should be able to set a teacher course with admin when teacher course already exists', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const teacherCourse = makeTeacherCourse({
      teacherId: 'teacher-1',
      courseId: 'course-1',
      teacherRole: 'courseManagerTeacher',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);
    inMemoryTeachersRepository.teachers.push(teacherCourse.teacher);
    inMemoryCoursesRepository.courses.push(teacherCourse.course);

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'extensionsActivitiesManagerTeacher',
      },
      sessionUser: adminUser,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherCourse: inMemoryTeacherCoursesRepository.teacherCourses[0],
    });
  });

  it('should be able to set a teacher course with teacher manager of course', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherId: 'teacher-1',
      courseId: 'course-1',
      teacherRole: 'courseManagerTeacher',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    inMemoryTeachersRepository.teachers.push(teacher);

    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'internshipManagerTeacher',
      },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      teacherCourse: inMemoryTeacherCoursesRepository.teacherCourses[0],
    });
  });

  it('should not able to set a teacher course if teacher not exists', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'internshipManagerTeacher',
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not able to set a teacher course if course not exists', async () => {
    const adminUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
    });

    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'));

    inMemoryTeachersRepository.teachers.push(teacher);

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'internshipManagerTeacher',
      },
      sessionUser: adminUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not able to set a teacher course if session user is student', async () => {
    const studentUser = makeUser({
      name: 'John Doe',
      email: 'johnDoe@fake.com',
      role: 'student',
    });

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'internshipManagerTeacher',
      },
      sessionUser: studentUser,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not able to set a teacher course if session user is a teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherId: 'teacher-1',
      courseId: 'course-1',
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });

    inMemoryTeacherCoursesRepository.teacherCourses.push(teacherCourse);

    const result = await sut.execute({
      data: {
        courseId: 'course-1',
        teacherId: 'teacher-1',
        teacherRole: 'internshipManagerTeacher',
      },
      sessionUser: teacherCourse.teacher,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
