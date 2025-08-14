import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import {
  CourseStudentsDataRepository,
  FindAllCourseStudentsDataFilter,
} from '../../repositories/course-students-data-repository';
import { CourseStudentsData } from '@/domain/entities/course-students-data';

interface FindAllCourseStudentsDataUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllCourseStudentsDataFilter;
}

type FindAllCourseStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseStudentsData: CourseStudentsData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllCourseStudentsDataUseCase {
  constructor(
    private courseStudentsDataRepository: CourseStudentsDataRepository,
  ) {}

  async execute({
    pagination,
    filters,
  }: FindAllCourseStudentsDataUseCaseRequest): Promise<FindAllCourseStudentsDataUseCaseResponse> {
    const courseStudentsData = await this.courseStudentsDataRepository.findAll(
      pagination,
      filters,
    );

    return right(courseStudentsData);
  }
}
