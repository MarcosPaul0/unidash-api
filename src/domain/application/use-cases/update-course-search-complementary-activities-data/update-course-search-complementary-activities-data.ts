import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';
import { CourseSearchComplementaryActivitiesDataRepository } from '../../repositories/course-search-complementary-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseSearchComplementaryActivitiesData {
  year?: number;
  semester?: Semester;
  scientificInitiation?: number;
  developmentInitiation?: number;
  publishedArticles?: number;
  fullPublishedArticles?: number;
  publishedAbstracts?: number;
  presentationOfWork?: number;
  participationInEvents?: number;
}

interface UpdateCourseSearchComplementaryActivitiesDataUseCaseRequest {
  courseSearchComplementaryActivitiesDataId: string;
  data: UpdateCourseSearchComplementaryActivitiesData;
  sessionUser: SessionUser;
}

type UpdateCourseSearchComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData;
  }
>;

@Injectable()
export class UpdateCourseSearchComplementaryActivitiesDataUseCase {
  constructor(
    private courseSearchComplementaryActivitiesDataRepository: CourseSearchComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseSearchComplementaryActivitiesDataId,
    data,
    sessionUser,
  }: UpdateCourseSearchComplementaryActivitiesDataUseCaseRequest): Promise<UpdateCourseSearchComplementaryActivitiesDataUseCaseResponse> {
    const courseSearchComplementaryActivitiesData =
      await this.courseSearchComplementaryActivitiesDataRepository.findById(
        courseSearchComplementaryActivitiesDataId,
      );

    if (!courseSearchComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseSearchComplementaryActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseSearchComplementaryActivitiesData, data);

    await this.courseSearchComplementaryActivitiesDataRepository.save(
      courseSearchComplementaryActivitiesData,
    );

    return right({
      courseSearchComplementaryActivitiesData,
    });
  }
}
