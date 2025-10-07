import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseCoordinationData } from '@/domain/entities/course-coordination-data';
import { CourseCoordinationDataRepository } from '../../repositories/course-coordination-data-repository';
import { CourseCoordinationDataAlreadyExistsError } from '../errors/course-coordination-data-already-exists-error';

interface RegisterCourseCoordinationDataUseCaseRequest {
  courseCoordinationData: {
    courseId: string;
    year: number;
    semester: Semester;
    servicesRequestsBySystem: number;
    servicesRequestsByEmail: number;
    resolutionActions: number;
    administrativeDecisionActions: number;
    meetingsByBoardOfDirectors: number;
    meetingsByUndergraduateChamber: number;
    meetingsByCourseCouncil: number;
    academicActionPlans: number;
    administrativeActionPlans: number;
    actionPlansDescription: string | null;
  };
  sessionUser: SessionUser;
}

type RegisterCourseCoordinationDataUseCaseResponse = Either<
  CourseCoordinationDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseCoordinationData: CourseCoordinationData;
  }
>;

@Injectable()
export class RegisterCourseCoordinationDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseCoordinationDataRepository: CourseCoordinationDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCoordinationData: {
      courseId,
      year,
      semester,
      servicesRequestsBySystem,
      servicesRequestsByEmail,
      resolutionActions,
      administrativeDecisionActions,
      meetingsByBoardOfDirectors,
      meetingsByUndergraduateChamber,
      meetingsByCourseCouncil,
      academicActionPlans,
      administrativeActionPlans,
      actionPlansDescription,
    },
    sessionUser,
  }: RegisterCourseCoordinationDataUseCaseRequest): Promise<RegisterCourseCoordinationDataUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseCoordinationDataAlreadyExists =
      await this.courseCoordinationDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseCoordinationDataAlreadyExists) {
      return left(new CourseCoordinationDataAlreadyExistsError());
    }

    const courseCoordinationData = CourseCoordinationData.create({
      courseId,
      year,
      semester,
      servicesRequestsBySystem,
      servicesRequestsByEmail,
      resolutionActions,
      administrativeDecisionActions,
      meetingsByBoardOfDirectors,
      meetingsByUndergraduateChamber,
      meetingsByCourseCouncil,
      academicActionPlans,
      administrativeActionPlans,
      actionPlansDescription,
    });

    await this.courseCoordinationDataRepository.create(courseCoordinationData);

    return right({
      courseCoordinationData,
    });
  }
}
