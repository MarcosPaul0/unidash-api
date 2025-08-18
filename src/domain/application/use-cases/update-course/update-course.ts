import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { CoursesRepository } from '../../repositories/courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { Course } from '@/domain/entities/course';
import { CourseAlreadyExistsError } from '../errors/course-already-exists-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface UpdateCourseData {
  name?: string;
}

interface UpdateCourseUseCaseRequest {
  courseId: string;
  data: UpdateCourseData;
  sessionUser: SessionUser;
}

type UpdateCourseUseCaseResponse = Either<
  CourseAlreadyExistsError,
  {
    course: Course;
  }
>;

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    data,
    sessionUser,
  }: UpdateCourseUseCaseRequest): Promise<UpdateCourseUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    Object.assign(course, data);

    await this.coursesRepository.save(course);

    return right({
      course,
    });
  }
}
