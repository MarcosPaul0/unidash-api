import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';
import { CourseExtensionComplementaryActivitiesDataRepository } from '../../repositories/course-extension-complementary-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseExtensionComplementaryActivitiesData {
  year?: number;
  semester?: Semester;
  culturalActivities?: number;
  sportsCompetitions?: number;
  awardsAtEvents?: number;
  studentRepresentation?: number;
  participationInCollegiateBodies?: number;
}

interface UpdateCourseExtensionComplementaryActivitiesDataUseCaseRequest {
  courseExtensionComplementaryActivitiesDataId: string;
  data: UpdateCourseExtensionComplementaryActivitiesData;
  sessionUser: SessionUser;
}

type UpdateCourseExtensionComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData;
  }
>;

@Injectable()
export class UpdateCourseExtensionComplementaryActivitiesDataUseCase {
  constructor(
    private courseExtensionComplementaryActivitiesDataRepository: CourseExtensionComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionComplementaryActivitiesDataId,
    data,
    sessionUser,
  }: UpdateCourseExtensionComplementaryActivitiesDataUseCaseRequest): Promise<UpdateCourseExtensionComplementaryActivitiesDataUseCaseResponse> {
    const courseExtensionComplementaryActivitiesData =
      await this.courseExtensionComplementaryActivitiesDataRepository.findById(
        courseExtensionComplementaryActivitiesDataId,
      );

    if (!courseExtensionComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseExtensionComplementaryActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseExtensionComplementaryActivitiesData, data);

    await this.courseExtensionComplementaryActivitiesDataRepository.save(
      courseExtensionComplementaryActivitiesData,
    );

    return right({
      courseExtensionComplementaryActivitiesData,
    });
  }
}
