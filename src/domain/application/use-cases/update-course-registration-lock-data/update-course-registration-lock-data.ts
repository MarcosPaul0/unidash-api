import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseRegistrationLockDataRepository } from '../../repositories/course-registration-lock-data-repository';

interface UpdateCourseRegistrationLockData {
  difficultyInDiscipline?: number;
  workload?: number;
  teacherMethodology?: number;
  incompatibilityWithWork?: number;
  lossOfInterest?: number;
  other?: number;
}

interface UpdateCourseRegistrationLockDataUseCaseRequest {
  courseRegistrationLockDataId: string;
  data: UpdateCourseRegistrationLockData;
  sessionUser: User;
}

type UpdateCourseRegistrationLockDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseRegistrationLockData: CourseRegistrationLockData;
  }
>;

@Injectable()
export class UpdateCourseRegistrationLockDataUseCase {
  constructor(
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseRegistrationLockDataId,
    data,
    sessionUser,
  }: UpdateCourseRegistrationLockDataUseCaseRequest): Promise<UpdateCourseRegistrationLockDataUseCaseResponse> {
    const courseRegistrationLockData =
      await this.courseRegistrationLockDataRepository.findById(
        courseRegistrationLockDataId,
      );

    if (!courseRegistrationLockData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseRegistrationLockData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseRegistrationLockData, data);

    await this.courseRegistrationLockDataRepository.save(
      courseRegistrationLockData,
    );

    return right({
      courseRegistrationLockData,
    });
  }
}
