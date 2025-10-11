import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Injectable } from '@nestjs/common';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { StudentIncomingDataRepository } from '../../repositories/student-incoming-data-repository';
import { StudentsRepository } from '../../repositories/students-repository';

interface DeleteStudentIncomingDataUseCaseRequest {
  studentIncomingDataId: string;
  sessionUser: SessionUser;
}

type DeleteStudentIncomingDataUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  Record<string, never>
>;

@Injectable()
export class DeleteStudentIncomingDataUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private studentIncomingDataRepository: StudentIncomingDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    studentIncomingDataId,
    sessionUser,
  }: DeleteStudentIncomingDataUseCaseRequest): Promise<DeleteStudentIncomingDataUseCaseResponse> {
    const studentIncomingData =
      await this.studentIncomingDataRepository.findById(studentIncomingDataId);

    if (!studentIncomingData) {
      return left(new ResourceNotFoundError());
    }

    const student = await this.studentsRepository.findByStudentId(
      studentIncomingData.studentId,
    );

    if (!student) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        student.courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    await this.studentIncomingDataRepository.delete(studentIncomingData);

    return right({});
  }
}
