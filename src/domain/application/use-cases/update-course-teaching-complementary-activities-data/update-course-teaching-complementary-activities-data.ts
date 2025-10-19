import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';
import { CourseTeachingComplementaryActivitiesDataRepository } from '../../repositories/course-teaching-complementary-activities-data-repository';
import { Semester } from '@/domain/entities/course-data';

interface UpdateCourseTeachingComplementaryActivitiesData {
  year?: number;
  semester?: Semester;
  subjectMonitoring?: number;
  sponsorshipOfNewStudents?: number;
  providingTraining?: number;
  coursesInTheArea?: number;
  coursesOutsideTheArea?: number;
  electivesDisciplines?: number;
  complementaryCoursesInTheArea?: number;
  preparationForTest?: number;
}

interface UpdateCourseTeachingComplementaryActivitiesDataUseCaseRequest {
  courseTeachingComplementaryActivitiesDataId: string;
  data: UpdateCourseTeachingComplementaryActivitiesData;
  sessionUser: SessionUser;
}

type UpdateCourseTeachingComplementaryActivitiesDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData;
  }
>;

@Injectable()
export class UpdateCourseTeachingComplementaryActivitiesDataUseCase {
  constructor(
    private courseTeachingComplementaryActivitiesDataRepository: CourseTeachingComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeachingComplementaryActivitiesDataId,
    data,
    sessionUser,
  }: UpdateCourseTeachingComplementaryActivitiesDataUseCaseRequest): Promise<UpdateCourseTeachingComplementaryActivitiesDataUseCaseResponse> {
    const courseTeachingComplementaryActivitiesData =
      await this.courseTeachingComplementaryActivitiesDataRepository.findById(
        courseTeachingComplementaryActivitiesDataId,
      );

    if (!courseTeachingComplementaryActivitiesData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseTeachingComplementaryActivitiesData.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    Object.assign(courseTeachingComplementaryActivitiesData, data);

    await this.courseTeachingComplementaryActivitiesDataRepository.save(
      courseTeachingComplementaryActivitiesData,
    );

    return right({
      courseTeachingComplementaryActivitiesData,
    });
  }
}
