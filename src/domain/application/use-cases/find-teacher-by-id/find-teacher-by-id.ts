import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';
import { UserRole } from '@/domain/entities/user';

interface FindTeacherByIdUseCaseRequest {
  id: string;
  userRole: UserRole;
}

type FindTeacherByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    teacher: Teacher;
  }
>;

@Injectable()
export class FindTeacherByIdUseCase {
  constructor(private teachersRepository: TeachersRepository) {}

  async execute({
    id,
    userRole,
  }: FindTeacherByIdUseCaseRequest): Promise<FindTeacherByIdUseCaseResponse> {
    if (userRole !== 'teacher') {
      return left(new NotAllowedError());
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
