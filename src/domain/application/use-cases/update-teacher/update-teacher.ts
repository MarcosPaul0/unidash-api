import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Teacher } from '@/domain/entities/teacher';
import { TeachersRepository } from '../../repositories/teacher-repository';

export interface UpdateTeacherData {
  name?: string;
}

interface UpdateTeacherUseCaseRequest {
  teacherId: string;
  data: UpdateTeacherData;
}

type UpdateTeacherUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    teacher: Teacher;
  }
>;

@Injectable()
export class UpdateTeacherUseCase {
  constructor(private teachersRepository: TeachersRepository) {}

  async execute({
    teacherId,
    data,
  }: UpdateTeacherUseCaseRequest): Promise<UpdateTeacherUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    Object.assign(teacher, data);

    await this.teachersRepository.save(teacher);

    return right({
      teacher,
    });
  }
}
