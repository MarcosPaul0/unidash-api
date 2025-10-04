import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindForIndicatorsFilter } from '../../repositories/course-coordination-data-repository';
import { CourseRegistrationLockDataRepository } from '../../repositories/course-registration-lock-data-repository';
import { CourseStudentsDataRepository } from '../../repositories/course-students-data-repository';
import { CourseDepartureDataRepository } from '../../repositories/course-departure-data-repository';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseTeacherWorkloadDataRepository } from '../../repositories/course-teacher-workload-data-repository';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';
import { CourseActiveStudentsDataRepository } from '../../repositories/course-active-students-data-repository';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';

interface GetCourseIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseRegistrationLockData: CourseRegistrationLockData[];
    courseStudentsData: CourseStudentsData[];
    courseActiveStudentsData: CourseActiveStudentsData[];
    courseDepartureData: CourseDepartureData[];
    courseTeacherWorkloadData: CourseTeacherWorkloadData[];
  }
>;

@Injectable()
export class GetCourseIndicatorsUseCase {
  constructor(
    private courseRegistrationLockDataRepository: CourseRegistrationLockDataRepository,
    private courseStudentsDataRepository: CourseStudentsDataRepository,
    private courseActiveStudentsDataRepository: CourseActiveStudentsDataRepository,
    private courseDepartureDataRepository: CourseDepartureDataRepository,
    private courseTeacherWorkloadDataRepository: CourseTeacherWorkloadDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseIndicatorsUseCaseRequest): Promise<GetCourseIndicatorsUseCaseResponse> {
    const courseRegistrationLockData =
      await this.courseRegistrationLockDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseStudentsData =
      await this.courseStudentsDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseActiveStudentsData =
      await this.courseActiveStudentsDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseDepartureData =
      await this.courseDepartureDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const courseTeacherWorkloadData =
      await this.courseTeacherWorkloadDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right({
      courseDepartureData,
      courseRegistrationLockData,
      courseStudentsData,
      courseActiveStudentsData,
      courseTeacherWorkloadData,
    });
  }
}
