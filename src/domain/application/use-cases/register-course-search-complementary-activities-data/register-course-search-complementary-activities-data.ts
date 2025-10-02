import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseSearchComplementaryActivitiesDataAlreadyExistsError } from '../errors/course-search-complementary-activities-data-already-exists-error';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';
import { CourseSearchComplementaryActivitiesDataRepository } from '../../repositories/course-search-complementary-activities-data-repository';

interface RegisterCourseSearchComplementaryActivitiesDataUseCaseRequest {
  courseSearchComplementaryActivitiesData: {
    courseId: string;
    year: number;
    semester: Semester;
    scientificInitiation: number;
    developmentInitiation: number;
    publishedArticles: number;
    fullPublishedArticles: number;
    publishedAbstracts: number;
    presentationOfWork: number;
    participationInEvents: number;
  };
  sessionUser: SessionUser;
}

type RegisterCourseSearchComplementaryActivitiesDataUseCaseResponse = Either<
  | CourseSearchComplementaryActivitiesDataAlreadyExistsError
  | ResourceNotFoundError,
  {
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData;
  }
>;

@Injectable()
export class RegisterCourseSearchComplementaryActivitiesDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseSearchComplementaryActivitiesDataRepository: CourseSearchComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseSearchComplementaryActivitiesData: {
      courseId,
      year,
      semester,
      scientificInitiation,
      developmentInitiation,
      publishedArticles,
      fullPublishedArticles,
      publishedAbstracts,
      presentationOfWork,
      participationInEvents,
    },
    sessionUser,
  }: RegisterCourseSearchComplementaryActivitiesDataUseCaseRequest): Promise<RegisterCourseSearchComplementaryActivitiesDataUseCaseResponse> {
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

    const courseSearchComplementaryActivitiesDataAlreadyExists =
      await this.courseSearchComplementaryActivitiesDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseSearchComplementaryActivitiesDataAlreadyExists) {
      return left(
        new CourseSearchComplementaryActivitiesDataAlreadyExistsError(),
      );
    }

    const courseSearchComplementaryActivitiesData =
      CourseSearchComplementaryActivitiesData.create({
        courseId,
        year,
        semester,
        scientificInitiation,
        developmentInitiation,
        publishedArticles,
        fullPublishedArticles,
        publishedAbstracts,
        presentationOfWork,
        participationInEvents,
      });

    await this.courseSearchComplementaryActivitiesDataRepository.create(
      courseSearchComplementaryActivitiesData,
    );

    return right({
      courseSearchComplementaryActivitiesData,
    });
  }
}
