import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';
import { CourseTeacherWorkloadDataRepository } from '../../repositories/course-teacher-workload-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseTeacherWorkloadData {
  year?: number;
  semester?: Semester;
  workloadInHours?: number;
}

interface UpdateCourseTeacherWorkloadDataUseCaseRequest {
  courseTeacherWorkloadDataId: string;
  data: UpdateCourseTeacherWorkloadData;
  sessionUser: SessionUser;
}

type UpdateCourseTeacherWorkloadDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseTeacherWorkloadData: CourseTeacherWorkloadData;
  }
>;

@Injectable()
export class UpdateCourseTeacherWorkloadDataUseCase {
  constructor(
    private courseTeacherWorkloadDataRepository: CourseTeacherWorkloadDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeacherWorkloadDataId,
    data,
    sessionUser,
  }: UpdateCourseTeacherWorkloadDataUseCaseRequest): Promise<UpdateCourseTeacherWorkloadDataUseCaseResponse> {
    const courseTeacherWorkloadData =
      await this.courseTeacherWorkloadDataRepository.findById(
        courseTeacherWorkloadDataId,
      );

    if (!courseTeacherWorkloadData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseTeacherWorkloadData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseTeacherWorkloadData, data);

    await this.courseTeacherWorkloadDataRepository.save(
      courseTeacherWorkloadData,
    );

    return right({
      courseTeacherWorkloadData,
    });
  }
}
