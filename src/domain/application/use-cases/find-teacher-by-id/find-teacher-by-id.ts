import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';
import { User } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindTeacherByIdUseCaseRequest {
  id: string;
  sessionUser: User;
}

type FindTeacherByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    teacher: Teacher;
  }
>;

@Injectable()
export class FindTeacherByIdUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    id,
    sessionUser,
  }: FindTeacherByIdUseCaseRequest): Promise<FindTeacherByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacher = await this.teachersRepository.findById(id);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    return right({
      teacher,
    });
  }
}
