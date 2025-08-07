import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { StudentsRepository } from '../../repositories/students-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { User } from '@/domain/entities/user';
import { Student } from '@/domain/entities/student';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

interface FindStudentByIdUseCaseRequest {
  studentId: string;
  sessionUser: User;
}

type FindStudentByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    student: Student;
  }
>;

@Injectable()
export class FindStudentByIdUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    studentId,
    sessionUser,
  }: FindStudentByIdUseCaseRequest): Promise<FindStudentByIdUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin', 'teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    return right({
      student,
    });
  }
}
