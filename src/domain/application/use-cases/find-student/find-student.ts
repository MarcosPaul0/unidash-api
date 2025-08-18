import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { StudentsRepository } from '../../repositories/students-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { Student } from '@/domain/entities/student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindStudentUseCaseRequest {
  sessionUser: SessionUser;
}

type FindStudentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    student: Student;
  }
>;

@Injectable()
export class FindStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    sessionUser,
  }: FindStudentUseCaseRequest): Promise<FindStudentUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['student'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const student = await this.studentsRepository.findById(
      sessionUser.id.toString(),
    );

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    return right({
      student,
    });
  }
}
