import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import {
  CourseCoordinationDataRepository,
  FindForIndicatorsFilter,
} from '../../repositories/course-coordination-data-repository';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';

interface GetCourseCoordinationIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseCoordinationIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  CourseCoordinationData[]
>;

@Injectable()
export class GetCourseCoordinationIndicatorsUseCase {
  constructor(
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseCoordinationIndicatorsUseCaseRequest): Promise<GetCourseCoordinationIndicatorsUseCaseResponse> {
    const courseCoordinationData =
      await this.courseCoordinationDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right(courseCoordinationData);
  }
}
