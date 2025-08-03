import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Pagination } from '@/core/pagination/pagination';
import { Student } from '@/domain/entities/student';
import { UserRole } from '@/domain/entities/user';

interface FindAllStudentsForAdminUseCaseRequest {
  userRole: UserRole;
  pagination?: Pagination;
}

type FindAllStudentsForAdminUseCaseResponse = Either<
  NotAllowedError,
  {
    students: Student[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllStudentsForAdminUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    userRole,
    pagination,
  }: FindAllStudentsForAdminUseCaseRequest): Promise<FindAllStudentsForAdminUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError());
    }

    const students = await this.studentsRepository.findAll(pagination);

    return right(students);
  }
}
