import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindForIndicatorsFilter } from '../../repositories/course-coordination-data-repository';
import { CourseInternshipDataRepository } from '../../repositories/course-internship-data-repository';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';

interface GetCourseInternshipIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseInternshipIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseInternshipData: CourseInternshipData[];
  }
>;

@Injectable()
export class GetCourseInternshipIndicatorsUseCase {
  constructor(
    private courseInternshipDataRepository: CourseInternshipDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseInternshipIndicatorsUseCaseRequest): Promise<GetCourseInternshipIndicatorsUseCaseResponse> {
    const courseInternshipData =
      await this.courseInternshipDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right({
      courseInternshipData,
    });
  }
}
