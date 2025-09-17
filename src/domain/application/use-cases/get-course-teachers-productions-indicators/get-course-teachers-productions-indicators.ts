import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindForIndicatorsFilter } from '../../repositories/course-coordination-data-repository';
import { TeacherTechnicalScientificProductionsDataRepository } from '../../repositories/teacher-technical-scientific-productions-data-repository';
import { TeacherResearchAndExtensionProjectsDataRepository } from '../../repositories/teacher-research-and-extension-projects-data-repository';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

interface GetCourseTeachersProductionsIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseTeachersProductionsIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData[];
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData[];
  }
>;

@Injectable()
export class GetCourseTeachersProductionsIndicatorsUseCase {
  constructor(
    private teacherTechnicalScientificProductionsDataRepository: TeacherTechnicalScientificProductionsDataRepository,
    private teacherResearchAndExtensionProjectsDataRepository: TeacherResearchAndExtensionProjectsDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseTeachersProductionsIndicatorsUseCaseRequest): Promise<GetCourseTeachersProductionsIndicatorsUseCaseResponse> {
    const teacherTechnicalScientificProductionsData =
      await this.teacherTechnicalScientificProductionsDataRepository.findForIndicators(
        courseId,
        filters,
      );

    const teacherResearchAndExtensionProjectsData =
      await this.teacherResearchAndExtensionProjectsDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right({
      teacherTechnicalScientificProductionsData,
      teacherResearchAndExtensionProjectsData,
    });
  }
}
