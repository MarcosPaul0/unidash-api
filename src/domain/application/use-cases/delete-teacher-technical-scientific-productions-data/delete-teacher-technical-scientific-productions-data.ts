import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherTechnicalScientificProductionsDataRepository } from '../../repositories/teacher-technical-scientific-productions-data-repository';
import { TeachersRepository } from '../../repositories/teacher-repository';

interface DeleteTeacherTechnicalScientificProductionsDataUseCaseRequest {
  teacherTechnicalScientificProductionsDataId: string;
  sessionUser: SessionUser;
}

type DeleteTeacherTechnicalScientificProductionsDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteTeacherTechnicalScientificProductionsDataUseCase {
  constructor(
    private teacherTechnicalScientificProductionsDataRepository: TeacherTechnicalScientificProductionsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherTechnicalScientificProductionsDataId,
    sessionUser,
  }: DeleteTeacherTechnicalScientificProductionsDataUseCaseRequest): Promise<DeleteTeacherTechnicalScientificProductionsDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherTechnicalScientificProductionsData =
      await this.teacherTechnicalScientificProductionsDataRepository.findById(
        teacherTechnicalScientificProductionsDataId,
      );

    if (!teacherTechnicalScientificProductionsData) {
      return left(new ResourceNotFoundError());
    }

    if (
      teacherTechnicalScientificProductionsData.teacher?.id.toString() !==
      sessionUser.id
    ) {
      left(new NotAllowedError());
    }

    await this.teacherTechnicalScientificProductionsDataRepository.delete(
      teacherTechnicalScientificProductionsData,
    );

    return right({});
  }
}
