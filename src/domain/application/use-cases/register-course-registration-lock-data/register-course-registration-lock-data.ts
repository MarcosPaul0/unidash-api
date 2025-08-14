import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseRegistrationLockDataAlreadyExistsError } from '../errors/course-registration-lock-data-already-exists-error';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseRegistrationLockDataRepository } from '../../repositories/course-registration-lock-data-repository';

interface RegisterCourseRegistrationLockDataUseCaseRequest {
  courseRegistrationLockData: {
    courseId: string;
    year: number;
    semester: Semester;
    difficultyInDiscipline: number;
    workload: number;
    teacherMethodology: number;
    incompatibilityWithWork: number;
    lossOfInterest: number;
    other: number;
  };
  sessionUser: User;
}

type RegisterCourseRegistrationLockDataUseCaseResponse = Either<
  CourseRegistrationLockDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseRegistrationLockData: CourseRegistrationLockData;
  }
>;

@Injectable()
export class RegisterCourseRegistrationLockDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseRegistrationLockData: {
      courseId,
      year,
      semester,
      difficultyInDiscipline,
      workload,
      teacherMethodology,
      incompatibilityWithWork,
      lossOfInterest,
      other,
    },
    sessionUser,
  }: RegisterCourseRegistrationLockDataUseCaseRequest): Promise<RegisterCourseRegistrationLockDataUseCaseResponse> {
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

    const courseRegistrationLockDataAlreadyExists =
      await this.courseRegistrationLockDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseRegistrationLockDataAlreadyExists) {
      return left(new CourseRegistrationLockDataAlreadyExistsError());
    }

    const courseRegistrationLockData = CourseRegistrationLockData.create({
      courseId,
      year,
      semester,
      difficultyInDiscipline,
      workload,
      teacherMethodology,
      incompatibilityWithWork,
      lossOfInterest,
      other,
    });

    await this.courseRegistrationLockDataRepository.create(
      courseRegistrationLockData,
    );

    return right({
      courseRegistrationLockData,
    });
  }
}
