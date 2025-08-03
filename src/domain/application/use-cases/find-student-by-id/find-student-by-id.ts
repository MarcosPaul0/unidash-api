import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { StudentsRepository } from '../../repositories/students-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/domain/entities/user';
import { Student } from '@/domain/entities/student';

interface FindStudentByIdUseCaseRequest {
  id: string;
  userRole: UserRole;
}

type FindStudentByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    student: Student;
  }
>;

@Injectable()
export class FindStudentByIdUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    id,
    userRole,
  }: FindStudentByIdUseCaseRequest): Promise<FindStudentByIdUseCaseResponse> {
    if (userRole !== 'student') {
      return left(new NotAllowedError());
    }

    const student = await this.studentsRepository.findById(id);

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    return right({
      student,
    });
  }
}
