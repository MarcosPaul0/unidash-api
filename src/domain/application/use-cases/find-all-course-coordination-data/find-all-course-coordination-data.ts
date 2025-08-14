import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import {
  CourseCoordinationDataRepository,
  FindAllCourseCoordinationDataFilter,
} from '../../repositories/course-coordination-data-repository';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';

interface FindAllCourseCoordinationDataUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllCourseCoordinationDataFilter;
}

type FindAllCourseCoordinationDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseCoordinationData: CourseCoordinationData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseCoordinationDataUseCase {
  constructor(
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
  ) {}

  async execute({
    pagination,
    filters,
  }: FindAllCourseCoordinationDataUseCaseRequest): Promise<FindAllCourseCoordinationDataUseCaseResponse> {
    const courseCoordinationData =
      await this.courseCoordinationDataRepository.findAll(pagination, filters);

    return right(courseCoordinationData);
  }
}
