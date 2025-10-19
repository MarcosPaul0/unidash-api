import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';
import { CourseActiveStudentsDataRepository } from '../../repositories/course-active-students-data-repository';
import { ActiveStudentsByIngressUseCaseRequest } from '../register-course-active-students-data/register-course-active-students-data';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseActiveStudentsData {
  year?: number;
  semester?: Semester;
  activeStudentsByIngress?: ActiveStudentsByIngressUseCaseRequest[];
}

interface UpdateCourseActiveStudentsDataUseCaseRequest {
  courseActiveStudentsDataId: string;
  data: UpdateCourseActiveStudentsData;
  sessionUser: SessionUser;
}

type UpdateCourseActiveStudentsDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseActiveStudentsData: CourseActiveStudentsData;
  }
>;

@Injectable()
export class UpdateCourseActiveStudentsDataUseCase {
  constructor(
    private courseActiveStudentsDataRepository: CourseActiveStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseActiveStudentsDataId,
    data,
    sessionUser,
  }: UpdateCourseActiveStudentsDataUseCaseRequest): Promise<UpdateCourseActiveStudentsDataUseCaseResponse> {
    const courseActiveStudentsData =
      await this.courseActiveStudentsDataRepository.findById(
        courseActiveStudentsDataId,
      );

    if (!courseActiveStudentsData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseActiveStudentsData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseActiveStudentsData, data);

    await this.courseActiveStudentsDataRepository.save(
      courseActiveStudentsData,
    );

    return right({
      courseActiveStudentsData,
    });
  }
}
