import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';

interface DeleteTeacherUseCaseRequest {
  teacherId: string;
  sessionUser: SessionUser;
}

type DeleteTeacherUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteTeacherUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherId,
    sessionUser,
  }: DeleteTeacherUseCaseRequest): Promise<DeleteTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    await this.teachersRepository.delete(teacher);

    return right({});
  }
}
