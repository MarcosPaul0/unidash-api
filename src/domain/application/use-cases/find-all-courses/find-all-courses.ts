import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Course } from '@/domain/entities/course';
import { CoursesRepository } from '../../repositories/courses-repository';
import { SessionUser } from '@/domain/entities/user';

interface FindAllCoursesUseCaseRequest {
  sessionUser: SessionUser;
}

type FindAllCoursesUseCaseResponse = Either<
  NotAllowedError,
  {
    courses: Course[];
  }
>;

@Injectable()
export class FindAllCoursesUseCase {
  constructor(private coursesRepository: CoursesRepository) {}

  async execute({
    sessionUser,
  }: FindAllCoursesUseCaseRequest): Promise<FindAllCoursesUseCaseResponse> {
    if (sessionUser.role === 'admin') {
      const courses = await this.coursesRepository.findAll();

      return right({ courses });
    }

    const courses = await this.coursesRepository.findAllByTeacher(
      sessionUser.id,
    );

    return right({ courses });
  }
}
