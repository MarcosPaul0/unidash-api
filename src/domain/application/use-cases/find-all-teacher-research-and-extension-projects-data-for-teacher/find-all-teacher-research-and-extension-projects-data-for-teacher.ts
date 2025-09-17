import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';
import {
  FindAllTeacherResearchAndExtensionProjectsDataFilter,
  TeacherResearchAndExtensionProjectsDataRepository,
} from '../../repositories/teacher-research-and-extension-projects-data-repository';

interface FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllTeacherResearchAndExtensionProjectsDataFilter;
  sessionUser: SessionUser;
}

type FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCaseResponse =
  Either<
    ResourceNotFoundError,
    {
      teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData[];
      totalItems: number;
      totalPages: number;
    }
  >;

@Injectable()
export class FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase {
  constructor(
    private teacherResearchAndExtensionProjectsDataRepository: TeacherResearchAndExtensionProjectsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    pagination,
    filters,
    sessionUser,
  }: FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCaseRequest): Promise<FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherResearchAndExtensionProjectsDataForTeacher =
      await this.teacherResearchAndExtensionProjectsDataRepository.findAllForTeacher(
        sessionUser.id,
        pagination,
        filters,
      );

    return right(teacherResearchAndExtensionProjectsDataForTeacher);
  }
}
