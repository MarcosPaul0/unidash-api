import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { CoursesRepository } from '../../repositories/courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { Course } from '@/domain/entities/course';
import { CourseAlreadyExistsError } from '../errors/course-already-exists-error';

interface RegisterCourseUseCaseRequest {
  course: {
    name: string;
  };
  sessionUser: SessionUser;
}

type RegisterCourseUseCaseResponse = Either<
  CourseAlreadyExistsError,
  {
    course: Course;
  }
>;

@Injectable()
export class RegisterCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    course: { name },
    sessionUser,
  }: RegisterCourseUseCaseRequest): Promise<RegisterCourseUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseAlreadyExists = await this.coursesRepository.findByName(name);

    if (courseAlreadyExists) {
      return left(new CourseAlreadyExistsError(name));
    }

    const course = Course.create({
      name,
    });

    await this.coursesRepository.create(course);

    return right({
      course,
    });
  }
}
