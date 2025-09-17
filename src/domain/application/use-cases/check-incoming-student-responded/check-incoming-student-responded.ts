import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { StudentIncomingDataRepository } from '../../repositories/student-incoming-data-repository';
import { StudentsRepository } from '../../repositories/students-repository';

interface CheckIncomingStudentRespondedUseCaseRequest {
  sessionUser: SessionUser;
}

type CheckIncomingStudentRespondedUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    wasAnswered: boolean;
  }
>;

@Injectable()
export class CheckIncomingStudentRespondedUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private studentIncomingDataRepository: StudentIncomingDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    sessionUser,
  }: CheckIncomingStudentRespondedUseCaseRequest): Promise<CheckIncomingStudentRespondedUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['student'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const student = await this.studentsRepository.findById(sessionUser.id);

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    if (student.type === 'outgoingStudent') {
      return right({
        wasAnswered: true,
      });
    }

    const studentIncomingData =
      await this.studentIncomingDataRepository.findByStudentId(sessionUser.id);

    return right({
      wasAnswered: Boolean(studentIncomingData),
    });
  }
}
