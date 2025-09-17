import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import {
  FindAllStudentIncomingDataFilter,
  StudentIncomingDataRepository,
} from '../../repositories/student-incoming-data-repository';
import { StudentIncomingData } from '@/domain/entities/student-incoming-data';

interface FindAllStudentIncomingDataUseCaseRequest {
  courseId: string;
  pagination?: Pagination;
  filters?: FindAllStudentIncomingDataFilter;
  sessionUser: SessionUser;
}

type FindAllStudentIncomingDataUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    studentIncomingData: StudentIncomingData[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllStudentIncomingDataUseCase {
  constructor(
    private studentIncomingDataRepository: StudentIncomingDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    filters,
    sessionUser,
  }: FindAllStudentIncomingDataUseCaseRequest): Promise<FindAllStudentIncomingDataUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const studentIncomingData =
      await this.studentIncomingDataRepository.findAll(
        courseId,
        pagination,
        filters,
      );

    return right(studentIncomingData);
  }
}
