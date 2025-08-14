import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { CourseStudentsDataRepository } from '../../repositories/course-students-data-repository';

interface UpdateCourseStudentsData {
  entrants?: number;
  actives?: number;
  locks?: number;
  canceled?: number;
}

interface UpdateCourseStudentsDataUseCaseRequest {
  courseStudentsDataId: string;
  data: UpdateCourseStudentsData;
  sessionUser: User;
}

type UpdateCourseStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseStudentsData: CourseStudentsData;
  }
>;

@Injectable()
export class UpdateCourseStudentsDataUseCase {
  constructor(
    private courseStudentsDataRepository: CourseStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseStudentsDataId,
    data,
    sessionUser,
  }: UpdateCourseStudentsDataUseCaseRequest): Promise<UpdateCourseStudentsDataUseCaseResponse> {
    const courseStudentsData =
      await this.courseStudentsDataRepository.findById(courseStudentsDataId);

    if (!courseStudentsData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseStudentsData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseStudentsData, data);

    await this.courseStudentsDataRepository.save(courseStudentsData);

    return right({
      courseStudentsData,
    });
  }
}
