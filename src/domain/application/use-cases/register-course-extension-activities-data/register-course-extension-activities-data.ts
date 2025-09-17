import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';
import { CourseExtensionActivitiesDataRepository } from '../../repositories/course-extension-activities-data-repository';
import { CourseExtensionActivitiesDataAlreadyExistsError } from '../errors/course-extension-activities-data-already-exists-error';

interface RegisterCourseExtensionActivitiesDataUseCaseRequest {
  courseExtensionActivitiesData: {
    courseId: string;
    year: number;
    semester: Semester;
    specialProjects: number;
    participationInCompetitions: number;
    entrepreneurshipAndInnovation: number;
    eventOrganization: number;
    externalInternship: number;
    cultureAndExtensionProjects: number;
    semiannualProjects: number;
    workNonGovernmentalOrganization: number;
    juniorCompanies: number;
    provisionOfServicesWithSelfEmployedWorkers: number;
  };
  sessionUser: SessionUser;
}

type RegisterCourseExtensionActivitiesDataUseCaseResponse = Either<
  CourseExtensionActivitiesDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseExtensionActivitiesData: CourseExtensionActivitiesData;
  }
>;

@Injectable()
export class RegisterCourseExtensionActivitiesDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseExtensionActivitiesDataRepository: CourseExtensionActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionActivitiesData: {
      courseId,
      year,
      semester,
      specialProjects,
      participationInCompetitions,
      entrepreneurshipAndInnovation,
      eventOrganization,
      externalInternship,
      cultureAndExtensionProjects,
      semiannualProjects,
      workNonGovernmentalOrganization,
      juniorCompanies,
      provisionOfServicesWithSelfEmployedWorkers,
    },
    sessionUser,
  }: RegisterCourseExtensionActivitiesDataUseCaseRequest): Promise<RegisterCourseExtensionActivitiesDataUseCaseResponse> {
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

    const courseExtensionActivitiesDataAlreadyExists =
      await this.courseExtensionActivitiesDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseExtensionActivitiesDataAlreadyExists) {
      return left(new CourseExtensionActivitiesDataAlreadyExistsError());
    }

    const courseExtensionActivitiesData = CourseExtensionActivitiesData.create({
      courseId,
      year,
      semester,
      specialProjects,
      participationInCompetitions,
      entrepreneurshipAndInnovation,
      eventOrganization,
      externalInternship,
      cultureAndExtensionProjects,
      semiannualProjects,
      workNonGovernmentalOrganization,
      juniorCompanies,
      provisionOfServicesWithSelfEmployedWorkers,
    });

    await this.courseExtensionActivitiesDataRepository.create(
      courseExtensionActivitiesData,
    );

    return right({
      courseExtensionActivitiesData,
    });
  }
}
