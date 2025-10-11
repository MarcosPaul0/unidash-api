import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseTeacherWorkloadDataRepository } from '../../repositories/course-teacher-workload-data-repository';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';
import { CourseTeacherWorkloadDataAlreadyExistsError } from '../errors/course-teacher-workload-data-already-exists-error';

interface RegisterCourseTeacherWorkloadDataUseCaseRequest {
  courseTeacherWorkloadData: {
    courseId: string;
    teacherId: string;
    year: number;
    semester: Semester;
    workloadInHours: number;
  };
  sessionUser: SessionUser;
}

type RegisterCourseTeacherWorkloadDataUseCaseResponse = Either<
  CourseTeacherWorkloadDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseTeacherWorkloadData: CourseTeacherWorkloadData;
  }
>;

@Injectable()
export class RegisterCourseTeacherWorkloadDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseTeacherWorkloadDataRepository: CourseTeacherWorkloadDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeacherWorkloadData: {
      courseId,
      year,
      semester,
      teacherId,
      workloadInHours,
    },
    sessionUser,
  }: RegisterCourseTeacherWorkloadDataUseCaseRequest): Promise<RegisterCourseTeacherWorkloadDataUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseTeacherWorkloadDataAlreadyExists =
      await this.courseTeacherWorkloadDataRepository.findByPeriod(
        courseId,
        teacherId,
        year,
        semester,
      );

    if (courseTeacherWorkloadDataAlreadyExists) {
      return left(new CourseTeacherWorkloadDataAlreadyExistsError());
    }

    const courseTeacherWorkloadData = CourseTeacherWorkloadData.create({
      courseId,
      year,
      semester,
      teacherId,
      workloadInHours,
    });

    await this.courseTeacherWorkloadDataRepository.create(
      courseTeacherWorkloadData,
    );

    return right({
      courseTeacherWorkloadData,
    });
  }
}
