import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import {
  CourseInternshipData,
  EmploymentType,
} from '@/domain/entities/course-internship-data';
import { CourseInternshipDataRepository } from '../../repositories/course-internship-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseInternshipData {
  year?: number;
  semester?: Semester;
  studentMatriculation?: string;
  enterpriseCnpj?: string;
  employmentType?: EmploymentType;
  role?: string;
  conclusionTimeInDays?: number;
  cityId?: string;
  advisorId?: string;
}

interface UpdateCourseInternshipDataUseCaseRequest {
  courseInternshipDataId: string;
  data: UpdateCourseInternshipData;
  sessionUser: SessionUser;
}

type UpdateCourseInternshipDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseInternshipData: CourseInternshipData;
  }
>;

@Injectable()
export class UpdateCourseInternshipDataUseCase {
  constructor(
    private courseInternshipDataRepository: CourseInternshipDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseInternshipDataId,
    data,
    sessionUser,
  }: UpdateCourseInternshipDataUseCaseRequest): Promise<UpdateCourseInternshipDataUseCaseResponse> {
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
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseInternshipData, data);

    await this.courseInternshipDataRepository.save(courseInternshipData);

    return right({
      courseInternshipData,
    });
  }
}
