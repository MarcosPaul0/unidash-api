import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { FindForIndicatorsFilter } from '../../repositories/course-coordination-data-repository';
import { StudentIncomingDataRepository } from '../../repositories/student-incoming-data-repository';
import { StudentIncomingData } from '@/domain/entities/student-incoming-data';

interface GetCourseStudentIncomingIndicatorsUseCaseRequest {
  courseId: string;
  filters?: FindForIndicatorsFilter;
}

type GetCourseStudentIncomingIndicatorsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    studentIncomingData: StudentIncomingData[];
  }
>;

@Injectable()
export class GetCourseStudentIncomingIndicatorsUseCase {
  constructor(
    private studentIncomingDataRepository: StudentIncomingDataRepository,
  ) {}

  async execute({
    courseId,
    filters,
  }: GetCourseStudentIncomingIndicatorsUseCaseRequest): Promise<GetCourseStudentIncomingIndicatorsUseCaseResponse> {
    const studentIncomingData =
      await this.studentIncomingDataRepository.findForIndicators(
        courseId,
        filters,
      );

    return right({
      studentIncomingData,
    });
  }
}
