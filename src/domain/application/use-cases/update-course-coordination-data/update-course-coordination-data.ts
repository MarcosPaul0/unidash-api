import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseCoordinationDataRepository } from '../../repositories/course-coordination-data-repository';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';

interface UpdateCourseCoordinationData {
  servicesRequestsBySystem?: number;
  servicesRequestsByEmail?: number;
  resolutionActions?: number;
  administrativeDecisionActions?: number;
  meetingsByBoardOfDirectors?: number;
  meetingsByUndergraduateChamber?: number;
  meetingsByCourseCouncil?: number;
}

interface UpdateCourseCoordinationDataUseCaseRequest {
  courseCoordinationDataId: string;
  data: UpdateCourseCoordinationData;
  sessionUser: SessionUser;
}

type UpdateCourseCoordinationDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseCoordinationData: CourseCoordinationData;
  }
>;

@Injectable()
export class UpdateCourseCoordinationDataUseCase {
  constructor(
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCoordinationDataId,
    data,
    sessionUser,
  }: UpdateCourseCoordinationDataUseCaseRequest): Promise<UpdateCourseCoordinationDataUseCaseResponse> {
    const courseCoordinationData =
      await this.courseCoordinationDataRepository.findById(
        courseCoordinationDataId,
      );

    if (!courseCoordinationData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseCoordinationData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseCoordinationData, data);

    await this.courseCoordinationDataRepository.save(courseCoordinationData);

    return right({
      courseCoordinationData,
    });
  }
}
