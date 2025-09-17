import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseInternshipDataRepository } from '../../repositories/course-internship-data-repository';

interface DeleteCourseInternshipDataUseCaseRequest {
  courseInternshipDataId: string;
  sessionUser: SessionUser;
}

type DeleteCourseInternshipDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteCourseInternshipDataUseCase {
  constructor(
    private courseInternshipDataRepository: CourseInternshipDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseInternshipDataId,
    sessionUser,
  }: DeleteCourseInternshipDataUseCaseRequest): Promise<DeleteCourseInternshipDataUseCaseResponse> {
    const courseInternshipData =
      await this.courseInternshipDataRepository.findById(
        courseInternshipDataId,
      );

    if (!courseInternshipData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseInternshipData.courseId,
        ['courseManagerTeacher', 'internshipManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.courseInternshipDataRepository.delete(courseInternshipData);

    return right({});
  }
}
