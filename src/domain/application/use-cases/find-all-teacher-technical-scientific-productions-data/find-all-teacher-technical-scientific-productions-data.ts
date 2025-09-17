import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import {
  FindAllTeacherTechnicalScientificProductionsDataFilter,
  TeacherTechnicalScientificProductionsDataRepository,
} from '../../repositories/teacher-technical-scientific-productions-data-repository';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

interface FindAllTeacherTechnicalScientificProductionsDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllTeacherTechnicalScientificProductionsDataFilter;
  sessionUser: SessionUser;
}

type FindAllTeacherTechnicalScientificProductionsDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllTeacherTechnicalScientificProductionsDataUseCase {
  constructor(
    private TeacherTechnicalScientificProductionsDataRepository: TeacherTechnicalScientificProductionsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllTeacherTechnicalScientificProductionsDataUseCaseRequest): Promise<FindAllTeacherTechnicalScientificProductionsDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherTechnicalScientificProductionsData =
      await this.TeacherTechnicalScientificProductionsDataRepository.findAllForCourse(
        courseId,
        pagination,
        filters,
      );

    return right(teacherTechnicalScientificProductionsData);
  }
}
