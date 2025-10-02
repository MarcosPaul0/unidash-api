import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';
import { CourseExtensionComplementaryActivitiesDataRepository } from '../../repositories/course-extension-complementary-activities-data-repository';
import { CourseExtensionComplementaryActivitiesDataAlreadyExistsError } from '../errors/course-extension-complementary-activities-data-already-exists-error';

interface RegisterCourseExtensionComplementaryActivitiesDataUseCaseRequest {
  courseExtensionComplementaryActivitiesData: {
    courseId: string;
    year: number;
    semester: Semester;
    culturalActivities: number;
    sportsCompetitions: number;
    awardsAtEvents: number;
    studentRepresentation: number;
    participationInCollegiateBodies: number;
  };
  sessionUser: SessionUser;
}

type RegisterCourseExtensionComplementaryActivitiesDataUseCaseResponse = Either<
  | CourseExtensionComplementaryActivitiesDataAlreadyExistsError
  | ResourceNotFoundError,
  {
    courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData;
  }
>;

@Injectable()
export class RegisterCourseExtensionComplementaryActivitiesDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseExtensionComplementaryActivitiesDataRepository: CourseExtensionComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseExtensionComplementaryActivitiesData: {
      courseId,
      year,
      semester,
      awardsAtEvents,
      culturalActivities,
      participationInCollegiateBodies,
      sportsCompetitions,
      studentRepresentation,
    },
    sessionUser,
  }: RegisterCourseExtensionComplementaryActivitiesDataUseCaseRequest): Promise<RegisterCourseExtensionComplementaryActivitiesDataUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher', 'complementaryActivitiesManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseExtensionComplementaryActivitiesDataAlreadyExists =
      await this.courseExtensionComplementaryActivitiesDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseExtensionComplementaryActivitiesDataAlreadyExists) {
      return left(
        new CourseExtensionComplementaryActivitiesDataAlreadyExistsError(),
      );
    }

    const courseExtensionComplementaryActivitiesData =
      CourseExtensionComplementaryActivitiesData.create({
        courseId,
        year,
        semester,
        awardsAtEvents,
        culturalActivities,
        participationInCollegiateBodies,
        sportsCompetitions,
        studentRepresentation,
      });

    await this.courseExtensionComplementaryActivitiesDataRepository.create(
      courseExtensionComplementaryActivitiesData,
    );

    return right({
      courseExtensionComplementaryActivitiesData,
    });
  }
}
