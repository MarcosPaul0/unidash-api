import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import {
  ConclusionTime,
  CourseInternshipData,
} from '@/domain/entities/course-internship-data';
import { CourseInternshipDataRepository } from '../../repositories/course-internship-data-repository';
import { CourseInternshipDataAlreadyExistsError } from '../errors/course-internship-data-already-exists-error';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { StudentsRepository } from '../../repositories/students-repository';
import { InvalidStudentForCourseDataError } from '../errors/invalid-student-for-course-data-error';
import { CitiesRepository } from '../../repositories/cities-repository';

interface RegisterCourseInternshipDataUseCaseRequest {
  courseInternshipData: {
    courseId: string;
    year: number;
    semester: Semester;
    studentMatriculation: string;
    enterpriseCnpj: string;
    role: string;
    conclusionTime: ConclusionTime;
    cityId: string;
    advisorId: string;
  };
  sessionUser: SessionUser;
}

type RegisterCourseInternshipDataUseCaseResponse = Either<
  | CourseInternshipDataAlreadyExistsError
  | ResourceNotFoundError
  | InvalidStudentForCourseDataError,
  {
    courseInternshipData: CourseInternshipData;
  }
>;

@Injectable()
export class RegisterCourseInternshipDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private citiesRepository: CitiesRepository,
    private teachersRepository: TeachersRepository,
    private studentsRepository: StudentsRepository,
    private courseInternshipDataRepository: CourseInternshipDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseInternshipData: {
      courseId,
      year,
      semester,
      advisorId,
      cityId,
      conclusionTime,
      enterpriseCnpj,
      role,
      studentMatriculation,
    },
    sessionUser,
  }: RegisterCourseInternshipDataUseCaseRequest): Promise<RegisterCourseInternshipDataUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher', 'internshipManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacher = await this.teachersRepository.findById(advisorId);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    const city = await this.citiesRepository.findById(cityId);

    if (!city) {
      return left(new ResourceNotFoundError());
    }

    const student =
      await this.studentsRepository.findByMatriculation(studentMatriculation);

    if (student && student.courseId != courseId) {
      return left(new InvalidStudentForCourseDataError());
    }

    const courseInternshipDataAlreadyExists =
      await this.courseInternshipDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseInternshipDataAlreadyExists) {
      return left(new CourseInternshipDataAlreadyExistsError());
    }

    const courseInternshipData = CourseInternshipData.create({
      courseId,
      year,
      semester,
      advisorId,
      cityId,
      conclusionTime,
      enterpriseCnpj,
      role,
      studentMatriculation,
    });

    await this.courseInternshipDataRepository.create(courseInternshipData);

    return right({
      courseInternshipData,
    });
  }
}
