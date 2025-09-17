import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import {
  FindAllTeacherResearchAndExtensionProjectsDataFilter,
  TeacherResearchAndExtensionProjectsDataRepository,
} from '../../repositories/teacher-research-and-extension-projects-data-repository';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';

interface FindAllTeacherResearchAndExtensionProjectsDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllTeacherResearchAndExtensionProjectsDataFilter;
  sessionUser: SessionUser;
}

type FindAllTeacherResearchAndExtensionProjectsDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllTeacherResearchAndExtensionProjectsDataUseCase {
  constructor(
    private teacherResearchAndExtensionProjectsDataRepository: TeacherResearchAndExtensionProjectsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllTeacherResearchAndExtensionProjectsDataUseCaseRequest): Promise<FindAllTeacherResearchAndExtensionProjectsDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherResearchAndExtensionProjectsData =
      await this.teacherResearchAndExtensionProjectsDataRepository.findAllForCourse(
        courseId,
        pagination,
        filters,
      );

    return right(teacherResearchAndExtensionProjectsData);
  }
}
