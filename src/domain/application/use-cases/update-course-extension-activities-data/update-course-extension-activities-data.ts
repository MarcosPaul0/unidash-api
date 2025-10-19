import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';
import { CourseExtensionActivitiesDataRepository } from '../../repositories/course-extension-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseExtensionActivitiesData {
  year?: number;
  semester?: Semester;
  specialProjects?: number;
  participationInCompetitions?: number;
  entrepreneurshipAndInnovation?: number;
  eventOrganization?: number;
  externalInternship?: number;
  cultureAndExtensionProjects?: number;
  semiannualProjects?: number;
  workNonGovernmentalOrganization?: number;
  juniorCompanies?: number;
  provisionOfServicesWithSelfEmployedWorkers?: number;
}

interface UpdateCourseExtensionActivitiesDataUseCaseRequest {
  courseExtensionActivitiesDataId: string;
  data: UpdateCourseExtensionActivitiesData;
  sessionUser: SessionUser;
}

type UpdateCourseExtensionActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseExtensionActivitiesData: CourseExtensionActivitiesData;
  }
>;

@Injectable()
export class UpdateCourseExtensionActivitiesDataUseCase {
  constructor(
    private courseExtensionActivitiesDataRepository: CourseExtensionActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionActivitiesDataId,
    data,
    sessionUser,
  }: UpdateCourseExtensionActivitiesDataUseCaseRequest): Promise<UpdateCourseExtensionActivitiesDataUseCaseResponse> {
    const courseExtensionActivitiesData =
      await this.courseExtensionActivitiesDataRepository.findById(
        courseExtensionActivitiesDataId,
      );

    if (!courseExtensionActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseExtensionActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseExtensionActivitiesData, data);

    await this.courseExtensionActivitiesDataRepository.save(
      courseExtensionActivitiesData,
    );

    return right({
      courseExtensionActivitiesData,
    });
  }
}
