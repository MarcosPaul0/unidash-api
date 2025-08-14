import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseDepartureDataRepository } from '../../repositories/course-departure-data-repository';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseDepartureDataAlreadyExistsError } from '../errors/course-departure-data-already-exists-error';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';

interface RegisterCourseDepartureDataUseCaseRequest {
  courseDepartureData: {
    courseId: string;
    year: number;
    semester: Semester;
    completed: number;
    maximumDuration: number;
    dropouts: number;
    transfers: number;
    withdrawals: number;
    removals: number;
    newExams: number;
    deaths: number;
  };
  sessionUser: User;
}

type RegisterCourseDepartureDataUseCaseResponse = Either<
  CourseDepartureDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseDepartureData: CourseDepartureData;
  }
>;

@Injectable()
export class RegisterCourseDepartureDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseDepartureDataRepository: CourseDepartureDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseDepartureData: {
      courseId,
      year,
      semester,
      completed,
      maximumDuration,
      dropouts,
      transfers,
      withdrawals,
      removals,
      newExams,
      deaths,
    },
    sessionUser,
  }: RegisterCourseDepartureDataUseCaseRequest): Promise<RegisterCourseDepartureDataUseCaseResponse> {
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

    const courseDepartureDataAlreadyExists =
      await this.courseDepartureDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseDepartureDataAlreadyExists) {
      return left(new CourseDepartureDataAlreadyExistsError());
    }

    const courseDepartureData = CourseDepartureData.create({
      courseId,
      year,
      semester,
      completed,
      maximumDuration,
      dropouts,
      transfers,
      withdrawals,
      removals,
      newExams,
      deaths,
    });

    await this.courseDepartureDataRepository.create(courseDepartureData);

    return right({
      courseDepartureData,
    });
  }
}
