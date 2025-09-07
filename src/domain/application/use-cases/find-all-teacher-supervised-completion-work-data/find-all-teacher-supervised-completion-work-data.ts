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

interface FindAllTeacherSupervisedCompletionWorkDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllTeacherSupervisedCompletionWorkDataFilter;
  sessionUser: SessionUser;
}

type FindAllTeacherSupervisedCompletionWorkDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllTeacherSupervisedCompletionWorkDataUseCase {
  constructor(
    private TeacherSupervisedCompletionWorkDataRepository: TeacherSupervisedCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllTeacherSupervisedCompletionWorkDataUseCaseRequest): Promise<FindAllTeacherSupervisedCompletionWorkDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const isAdminOrWorkCompletionManagerTeacher =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['workCompletionManagerTeacher'],
      );

    if (isAdminOrWorkCompletionManagerTeacher.isRight()) {
      const teacherSupervisedCompletionWorkData =
        await this.TeacherSupervisedCompletionWorkDataRepository.findAll(
          courseId,
          pagination,
          filters,
        );

      return right(teacherSupervisedCompletionWorkData);
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
