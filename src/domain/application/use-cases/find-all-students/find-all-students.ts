import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Pagination } from '@/core/pagination/pagination';
import { Student } from '@/domain/entities/student';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindAllStudentsUseCaseRequest {
  sessionUser: SessionUser;
  pagination?: Pagination;
}

type FindAllStudentsUseCaseResponse = Either<
  NotAllowedError,
  {
    students: Student[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllStudentsUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    pagination,
    sessionUser,
  }: FindAllStudentsUseCaseRequest): Promise<FindAllStudentsUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const students = await this.studentsRepository.findAll(pagination);

    return right(students);
  }
}
