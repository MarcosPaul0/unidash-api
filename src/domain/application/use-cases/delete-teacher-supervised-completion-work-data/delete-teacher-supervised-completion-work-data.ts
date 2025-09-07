import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherSupervisedCompletionWorkDataRepository } from '../../repositories/teacher-supervised-completion-work-data-repository';

interface DeleteTeacherSupervisedCompletionWorkDataUseCaseRequest {
  teacherSupervisedCompletionWorkDataId: string;
  sessionUser: SessionUser;
}

type DeleteTeacherSupervisedCompletionWorkDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteTeacherSupervisedCompletionWorkDataUseCase {
  constructor(
    private teacherSupervisedCompletionWorkDataRepository: TeacherSupervisedCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherSupervisedCompletionWorkDataId,
    sessionUser,
  }: DeleteTeacherSupervisedCompletionWorkDataUseCaseRequest): Promise<DeleteTeacherSupervisedCompletionWorkDataUseCaseResponse> {
    const teacherSupervisedCompletionWorkData =
      await this.teacherSupervisedCompletionWorkDataRepository.findById(
        teacherSupervisedCompletionWorkDataId,
      );

    if (!teacherSupervisedCompletionWorkData) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherOwner(
        sessionUser,
        teacherSupervisedCompletionWorkData.courseId,
        teacherSupervisedCompletionWorkData.teacherId,
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.teacherSupervisedCompletionWorkDataRepository.delete(
      teacherSupervisedCompletionWorkData,
    );

    return right({});
  }
}
