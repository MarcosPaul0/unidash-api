import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeAdmin } from 'test/factories/make-admin';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeStudent } from 'test/factories/make-student';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { makeTeacherCourse } from 'test/factories/make-teacher-course';
import { RegisterCourseInternshipDataUseCase } from './register-course-internship-data';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';
import { InMemoryCourseInternshipDataRepository } from 'test/repositories/in-memory-course-internship-data-repository copy';
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeTeacher } from 'test/factories/make-teacher';
import { makeCity } from 'test/factories/make-city';
import { makeSessionUser } from 'test/factories/make-session-user';
import { CourseInternshipDataAlreadyExistsError } from '../errors/course-internship-data-already-exists-error';
import { makeCourseInternshipData } from 'test/factories/make-course-internship-data';
import { InMemoryCitiesRepository } from 'test/repositories/in-memory-cities-repository';

let inMemoryCoursesRepository: InMemoryCoursesRepository;
let inMemoryCitiesRepository: InMemoryCitiesRepository;
let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryCourseInternshipDataRepository: InMemoryCourseInternshipDataRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;
let sut: RegisterCourseInternshipDataUseCase;

describe('Register Course Internship Data', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryCitiesRepository = new InMemoryCitiesRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryCourseInternshipDataRepository =
      new InMemoryCourseInternshipDataRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new RegisterCourseInternshipDataUseCase(
      inMemoryCoursesRepository,
      inMemoryCitiesRepository,
      inMemoryTeachersRepository,
      inMemoryStudentsRepository,
      inMemoryCourseInternshipDataRepository,
      authorizationService,
    );
  });

  it('should be able to register course Internship data', async () => {
    const adminUser = makeAdmin();
    const advisor = makeTeacher({}, new UniqueEntityId('advisor-1'));
    const city = makeCity({}, new UniqueEntityId('city-1'));
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCitiesRepository.cities.push(city);
    inMemoryCoursesRepository.courses.push(course);
    inMemoryTeachersRepository.teachers.push(advisor);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courseInternshipData:
        inMemoryCourseInternshipDataRepository.courseInternshipData[0],
    });
  });

  it('should not be able to register course Internship data if course not exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course Internship data if teacher not exists', async () => {
    const adminUser = makeAdmin();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.courses.push(course);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course Internship data if city not exists', async () => {
    const adminUser = makeAdmin();
    const advisor = makeTeacher({}, new UniqueEntityId('advisor-1'));
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.courses.push(course);
    inMemoryTeachersRepository.teachers.push(advisor);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should not be able to register course Internship data if already exists', async () => {
    const adminUser = makeAdmin();
    const advisor = makeTeacher({}, new UniqueEntityId('advisor-1'));
    const city = makeCity({}, new UniqueEntityId('city-1'));

    const course = makeCourse({}, new UniqueEntityId('course-1'));
    const newCourseInternshipData = makeCourseInternshipData(
      { semester: 'first', year: 2025, courseId: 'course-1' },
      new UniqueEntityId('courseInternshipData-1'),
    );

    inMemoryCoursesRepository.create(course);
    inMemoryTeachersRepository.teachers.push(advisor);
    inMemoryCitiesRepository.cities.push(city);
    inMemoryCourseInternshipDataRepository.create(newCourseInternshipData);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(adminUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(CourseInternshipDataAlreadyExistsError);
  });

  it('should not be able to register course Internship data if session user is student', async () => {
    const studentUser = makeStudent();
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(studentUser),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to register course Internship data if session user is teacher with invalid role', async () => {
    const teacherCourse = makeTeacherCourse({
      teacherRole: 'extensionsActivitiesManagerTeacher',
    });
    const course = makeCourse({}, new UniqueEntityId('course-1'));

    inMemoryTeacherCoursesRepository.create(teacherCourse);
    inMemoryCoursesRepository.create(course);

    const result = await sut.execute({
      courseInternshipData: {
        courseId: 'course-1',
        year: 2025,
        semester: 'first',
        advisorId: 'advisor-1',
        cityId: 'city-1',
        conclusionTime: 'medium',
        enterpriseCnpj: 'fake-cnpj',
        role: 'fake-role',
        studentMatriculation: 'fake-matriculation',
      },
      sessionUser: makeSessionUser(teacherCourse.teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
