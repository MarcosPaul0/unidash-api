import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import {
  CourseRegistrationLockDataRepository,
  FindAllCourseRegistrationLockDataFilter,
} from '../../repositories/course-registration-lock-data-repository';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';

interface FindAllCourseRegistrationLockDataUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllCourseRegistrationLockDataFilter;
}

type FindAllCourseRegistrationLockDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseRegistrationLockData: CourseRegistrationLockData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseRegistrationLockDataUseCase {
  constructor(
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
  ) {}

  async execute({
    pagination,
    filters,
  }: FindAllCourseRegistrationLockDataUseCaseRequest): Promise<FindAllCourseRegistrationLockDataUseCaseResponse> {
    const courseRegistrationLockData =
      await this.courseRegistrationLockDataRepository.findAll(
        pagination,
        filters,
      );

    return right(courseRegistrationLockData);
  }
}
