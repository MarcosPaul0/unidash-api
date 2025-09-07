import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindForIndicatorsFilter } from '../../repositories/course-coordination-data-repository';
import { CourseCompletionWorkDataRepository } from '../../repositories/course-completion-work-data-repository';
import { TeacherSupervisedCompletionWorkDataRepository } from '../../repositories/teacher-supervised-completion-work-data-repository';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';

interface GetCourseCompletionWorkIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseCompletionWorkIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    courseCompletionWorkData: CourseCompletionWorkData[];
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData[];
  }
>;

@Injectable()
export class GetCourseCompletionWorkIndicatorsUseCase {
  constructor(
    private courseCompletionWorkDataRepository: CourseCompletionWorkDataRepository,
    private teacherSupervisedCompletionWorkDataRepository: TeacherSupervisedCompletionWorkDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseCompletionWorkIndicatorsUseCaseRequest): Promise<GetCourseCompletionWorkIndicatorsUseCaseResponse> {
    const courseCompletionWorkData =
      await this.courseCompletionWorkDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const teacherSupervisedCompletionWorkData =
      await this.teacherSupervisedCompletionWorkDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right({
      courseCompletionWorkData,
      teacherSupervisedCompletionWorkData,
    });
  }
}
