import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Student, StudentType } from '@/domain/entities/student';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

export interface UpdateStudentData {
  name?: string;
  matriculation?: string;
  type?: StudentType;
}

interface UpdateStudentUseCaseRequest {
  studentId: string;
  data: UpdateStudentData;
  sessionUser: SessionUser;
}

type UpdateStudentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    student: Student;
  }
>;

@Injectable()
export class UpdateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    studentId,
    data,
    sessionUser,
  }: UpdateStudentUseCaseRequest): Promise<UpdateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId);

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

    Object.assign(student, data);

    await this.studentsRepository.save(student);

    return right({
      student,
    });
  }
}
