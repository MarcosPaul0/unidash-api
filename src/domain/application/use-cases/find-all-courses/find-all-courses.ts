import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Course } from '@/domain/entities/course';
import { CoursesRepository } from '../../repositories/courses-repository';
import { SessionUser } from '@/domain/entities/user';
import { StudentsRepository } from '../../repositories/students-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface FindAllCoursesUseCaseRequest {
  sessionUser?: SessionUser;
}

type FindAllCoursesUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    courses: Course[];
  }
>;

@Injectable()
export class FindAllCoursesUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute({
    sessionUser,
  }: FindAllCoursesUseCaseRequest): Promise<FindAllCoursesUseCaseResponse> {
    if (sessionUser?.role === 'teacher') {
      const courses = await this.coursesRepository.findAllByTeacher(
        sessionUser.id,
      );

      return right({ courses });
    }

    if (sessionUser?.role === 'student') {
      const student = await this.studentsRepository.findById(sessionUser.id);

      if (!student) {
        return left(new ResourceNotFoundError());
      }

      const course = await this.coursesRepository.findById(student.courseId);

      if (!course) {
        return left(new ResourceNotFoundError());
      }

      return right({ courses: [course] });
    }

    const courses = await this.coursesRepository.findAll();

    return right({ courses });
  }
}
