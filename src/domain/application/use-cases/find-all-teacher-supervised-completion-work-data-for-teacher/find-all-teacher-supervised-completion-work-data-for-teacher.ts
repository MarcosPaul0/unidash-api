import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import {
  FindAllTeacherSupervisedCompletionWorkDataFilter,
  TeacherSupervisedCompletionWorkDataRepository,
} from '../../repositories/teacher-supervised-completion-work-data-repository';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';

interface FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllTeacherSupervisedCompletionWorkDataFilter;
  sessionUser: SessionUser;
}

type FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCaseResponse =
  Either<
    ResourceNotFoundError,
    {
      teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData[];
      totalItems: number;
      totalPages: number;
    }
  >;

@Injectable()
export class FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase {
  constructor(
    private TeacherSupervisedCompletionWorkDataRepository: TeacherSupervisedCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCaseRequest): Promise<FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherSupervisedCompletionWorkData =
      await this.TeacherSupervisedCompletionWorkDataRepository.findAllForTeacher(
        sessionUser.id,
        courseId,
        pagination,
        filters,
      );

    return right(teacherSupervisedCompletionWorkData);
  }
}
