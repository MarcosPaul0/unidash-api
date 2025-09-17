import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherResearchAndExtensionProjectsDataRepository } from '../../repositories/teacher-research-and-extension-projects-data-repository';

interface DeleteTeacherResearchAndExtensionProjectsDataUseCaseRequest {
  teacherResearchAndExtensionProjectsDataId: string;
  sessionUser: SessionUser;
}

type DeleteTeacherResearchAndExtensionProjectsDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteTeacherResearchAndExtensionProjectsDataUseCase {
  constructor(
    private teacherResearchAndExtensionProjectsDataRepository: TeacherResearchAndExtensionProjectsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherResearchAndExtensionProjectsDataId,
    sessionUser,
  }: DeleteTeacherResearchAndExtensionProjectsDataUseCaseRequest): Promise<DeleteTeacherResearchAndExtensionProjectsDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherResearchAndExtensionProjectsData =
      await this.teacherResearchAndExtensionProjectsDataRepository.findById(
        teacherResearchAndExtensionProjectsDataId,
      );

    if (!teacherResearchAndExtensionProjectsData) {
      return left(new ResourceNotFoundError());
    }

    if (
      teacherResearchAndExtensionProjectsData.teacher?.id.toString() !==
      sessionUser.id
    ) {
      left(new NotAllowedError());
    }

    await this.teacherResearchAndExtensionProjectsDataRepository.delete(
      teacherResearchAndExtensionProjectsData,
    );

    return right({});
  }
}
