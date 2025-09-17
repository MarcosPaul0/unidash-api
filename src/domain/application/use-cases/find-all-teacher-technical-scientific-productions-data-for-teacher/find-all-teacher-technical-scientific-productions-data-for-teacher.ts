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
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

interface FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllTeacherTechnicalScientificProductionsDataFilter;
  sessionUser: SessionUser;
}

type FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCaseResponse =
  Either<
    ResourceNotFoundError | NotAllowedError,
    {
      teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData[];
      totalItems: number;
      totalPages: number;
    }
  >;

@Injectable()
export class FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCase {
  constructor(
    private TeacherTechnicalScientificProductionsDataRepository: TeacherTechnicalScientificProductionsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    pagination,
    filters,
    sessionUser,
  }: FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCaseRequest): Promise<FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherTechnicalScientificProductionsData =
      await this.TeacherTechnicalScientificProductionsDataRepository.findAllForTeacher(
        sessionUser.id,
        pagination,
        filters,
      );

    return right(teacherTechnicalScientificProductionsData);
  }
}
