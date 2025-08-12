import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import {
  CourseDepartureDataRepository,
  FindAllCourseDepartureDataFilter,
} from '../../repositories/course-departure-data-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { Pagination } from '@/core/pagination/pagination';

interface FindAllCourseDepartureDataUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllCourseDepartureDataFilter;
}

type FindAllCourseDepartureDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseDepartureData: CourseDepartureData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseDepartureDataUseCase {
  constructor(
    private courseDepartureDataRepository: CourseDepartureDataRepository,
  ) {}

  async execute({
    pagination,
    filters,
  }: FindAllCourseDepartureDataUseCaseRequest): Promise<FindAllCourseDepartureDataUseCaseResponse> {
    const courseDepartureData =
      await this.courseDepartureDataRepository.findAll(pagination, filters);

    return right(courseDepartureData);
  }
}
