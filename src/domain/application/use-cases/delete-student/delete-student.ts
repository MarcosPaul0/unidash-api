import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';

interface DeleteStudentUseCaseRequest {
  studentId: string;
  sessionUser: SessionUser;
}

type DeleteStudentUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>;

@Injectable()
export class DeleteStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    studentId,
    sessionUser,
  }: DeleteStudentUseCaseRequest): Promise<DeleteStudentUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const student = await this.studentsRepository.findById(studentId);

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    await this.studentsRepository.delete(student);

    return right({});
  }
}
