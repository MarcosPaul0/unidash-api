import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Course } from '@/domain/entities/course';
import { CoursesRepository } from '../../repositories/courses-repository';

type FindAllCoursesUseCaseResponse = Either<
  NotAllowedError,
  {
    courses: Course[];
  }
>;

@Injectable()
export class FindAllCoursesUseCase {
  constructor(private coursesRepository: CoursesRepository) {}

  async execute(): Promise<FindAllCoursesUseCaseResponse> {
    const courses = await this.coursesRepository.findAll();

    return right({ courses });
  }
}
