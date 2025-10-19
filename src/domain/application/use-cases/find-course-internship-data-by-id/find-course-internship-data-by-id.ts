import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';
import { CourseInternshipDataRepository } from '../../repositories/course-internship-data-repository';

interface FindCourseInternshipDataByIdUseCaseRequest {
  courseInternshipDataId: string;
  sessionUser: SessionUser;
}

type FindCourseInternshipDataByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseInternshipData: CourseInternshipData;
  }
>;

@Injectable()
export class FindCourseInternshipDataByIdUseCase {
  constructor(
    private courseInternshipDataRepository: CourseInternshipDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseInternshipDataId,
    sessionUser,
  }: FindCourseInternshipDataByIdUseCaseRequest): Promise<FindCourseInternshipDataByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseInternshipData =
      await this.courseInternshipDataRepository.findById(
        courseInternshipDataId,
      );

    if (!courseInternshipData) {
      return left(new ResourceNotFoundError());
    }

    return right({
      courseInternshipData,
    });
  }
}
