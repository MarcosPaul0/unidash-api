import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Student } from '@/domain/entities/student';

export interface UpdateStudentData {
  name?: string;
  matriculation?: string;
}

interface UpdateStudentUseCaseRequest {
  studentId: string;
  data: UpdateStudentData;
}

type UpdateStudentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    student: Student;
  }
>;

@Injectable()
export class UpdateStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    studentId,
    data,
  }: UpdateStudentUseCaseRequest): Promise<UpdateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    Object.assign(student, data);

    await this.studentsRepository.save(student);

    return right({
      student,
    });
  }
}
