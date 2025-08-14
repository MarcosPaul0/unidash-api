import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseStudentsDataAlreadyExistsError } from '../errors/course-students-data-already-exists-error';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { CourseStudentsDataRepository } from '../../repositories/course-students-data-repository';

interface RegisterCourseStudentsDataUseCaseRequest {
  courseStudentsData: {
    courseId: string;
    year: number;
    semester: Semester;
    entrants: number;
    actives: number;
    locks: number;
    canceled: number;
  };
  sessionUser: User;
}

type RegisterCourseStudentsDataUseCaseResponse = Either<
  CourseStudentsDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseStudentsData: CourseStudentsData;
  }
>;

@Injectable()
export class RegisterCourseStudentsDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseStudentsDataRepository: CourseStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseStudentsData: {
      courseId,
      year,
      semester,
      entrants,
      actives,
      locks,
      canceled,
    },
    sessionUser,
  }: RegisterCourseStudentsDataUseCaseRequest): Promise<RegisterCourseStudentsDataUseCaseResponse> {
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

    const courseStudentsDataAlreadyExists =
      await this.courseStudentsDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseStudentsDataAlreadyExists) {
      return left(new CourseStudentsDataAlreadyExistsError());
    }

    const courseStudentsData = CourseStudentsData.create({
      courseId,
      year,
      semester,
      entrants,
      actives,
      locks,
      canceled,
    });

    await this.courseStudentsDataRepository.create(courseStudentsData);

    return right({
      courseStudentsData,
    });
  }
}
