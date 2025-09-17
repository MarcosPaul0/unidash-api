import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindForIndicatorsFilter } from '../../repositories/course-coordination-data-repository';
import { CourseTeachingComplementaryActivitiesDataRepository } from '../../repositories/course-teaching-complementary-activities-data-repository';
import { CourseExtensionActivitiesDataRepository } from '../../repositories/course-extension-activities-data-repository';
import { CourseExtensionComplementaryActivitiesDataRepository } from '../../repositories/course-extension-complementary-activities-data-repository';
import { CourseSearchComplementaryActivitiesDataRepository } from '../../repositories/course-search-complementary-activities-data-repository';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';

interface GetCourseActivitiesIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseActivitiesIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData[];
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData[];
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData[];
    courseExtensionActivitiesData: CourseExtensionActivitiesData[];
  }
>;

@Injectable()
export class GetCourseActivitiesIndicatorsUseCase {
  constructor(
    private courseTeachingComplementaryActivitiesDataRepository: CourseTeachingComplementaryActivitiesDataRepository,
    private courseExtensionComplementaryActivitiesDataRepository: CourseExtensionComplementaryActivitiesDataRepository,
    private courseSearchComplementaryActivitiesDataRepository: CourseSearchComplementaryActivitiesDataRepository,
    private courseExtensionActivitiesDataRepository: CourseExtensionActivitiesDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseActivitiesIndicatorsUseCaseRequest): Promise<GetCourseActivitiesIndicatorsUseCaseResponse> {
    const courseTeachingComplementaryActivitiesData =
      await this.courseTeachingComplementaryActivitiesDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseExtensionComplementaryActivitiesData =
      await this.courseExtensionComplementaryActivitiesDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseSearchComplementaryActivitiesData =
      await this.courseSearchComplementaryActivitiesDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseExtensionActivitiesData =
      await this.courseExtensionActivitiesDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right({
      courseTeachingComplementaryActivitiesData,
      courseExtensionComplementaryActivitiesData,
      courseSearchComplementaryActivitiesData,
      courseExtensionActivitiesData,
    });
  }
}
