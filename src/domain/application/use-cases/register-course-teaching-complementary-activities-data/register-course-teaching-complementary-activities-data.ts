import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseTeachingComplementaryActivitiesDataAlreadyExistsError } from '../errors/course-teaching-complementary-activities-data-already-exists-error';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';
import { CourseTeachingComplementaryActivitiesDataRepository } from '../../repositories/course-teaching-complementary-activities-data-repository';

interface RegisterCourseTeachingComplementaryActivitiesDataUseCaseRequest {
  courseTeachingComplementaryActivitiesData: {
    courseId: string;
    year: number;
    semester: Semester;
    subjectMonitoring: number;
    sponsorshipOfNewStudents: number;
    providingTraining: number;
    coursesInTheArea: number;
    coursesOutsideTheArea: number;
    electivesDisciplines: number;
    complementaryCoursesInTheArea: number;
    preparationForTest: number;
  };
  sessionUser: SessionUser;
}

type RegisterCourseTeachingComplementaryActivitiesDataUseCaseResponse = Either<
  | CourseTeachingComplementaryActivitiesDataAlreadyExistsError
  | ResourceNotFoundError,
  {
    courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData;
  }
>;

@Injectable()
export class RegisterCourseTeachingComplementaryActivitiesDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseTeachingComplementaryActivitiesDataRepository: CourseTeachingComplementaryActivitiesDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseTeachingComplementaryActivitiesData: {
      courseId,
      year,
      semester,
      subjectMonitoring,
      sponsorshipOfNewStudents,
      providingTraining,
      coursesInTheArea,
      coursesOutsideTheArea,
      electivesDisciplines,
      complementaryCoursesInTheArea,
      preparationForTest,
    },
    sessionUser,
  }: RegisterCourseTeachingComplementaryActivitiesDataUseCaseRequest): Promise<RegisterCourseTeachingComplementaryActivitiesDataUseCaseResponse> {
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

    const courseTeachingComplementaryActivitiesDataAlreadyExists =
      await this.courseTeachingComplementaryActivitiesDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseTeachingComplementaryActivitiesDataAlreadyExists) {
      return left(
        new CourseTeachingComplementaryActivitiesDataAlreadyExistsError(),
      );
    }

    const courseTeachingComplementaryActivitiesData =
      CourseTeachingComplementaryActivitiesData.create({
        courseId,
        year,
        semester,
        subjectMonitoring,
        sponsorshipOfNewStudents,
        providingTraining,
        coursesInTheArea,
        coursesOutsideTheArea,
        electivesDisciplines,
        complementaryCoursesInTheArea,
        preparationForTest,
      });

    await this.courseTeachingComplementaryActivitiesDataRepository.create(
      courseTeachingComplementaryActivitiesData,
    );

    return right({
      courseTeachingComplementaryActivitiesData,
    });
  }
}
