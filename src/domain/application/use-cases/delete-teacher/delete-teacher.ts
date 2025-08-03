import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { TeachersRepository } from '../../repositories/teacher-repository';

interface DeleteTeacherUseCaseRequest {
  teacherId: string;
}

type DeleteTeacherUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteTeacherUseCase {
  constructor(private teachersRepository: TeachersRepository) {}

  async execute({
    teacherId,
  }: DeleteTeacherUseCaseRequest): Promise<DeleteTeacherUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    await this.teachersRepository.delete(teacher);

    return right({});
  }
}
