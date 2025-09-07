import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../../repositories/students-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Pagination } from '@/core/pagination/pagination';
import { Student } from '@/domain/entities/student';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { TEACHER_ROLE } from '@/domain/entities/teacher-course';

interface FindAllStudentsByCourseUseCaseRequest {
  courseId: string;
  sessionUser: SessionUser;
  pagination?: Pagination;
}

type FindAllStudentsByCourseUseCaseResponse = Either<
  NotAllowedError,
  {
    students: Student[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllStudentsByCourseUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseId,
    pagination,
    sessionUser,
  }: FindAllStudentsByCourseUseCaseRequest): Promise<FindAllStudentsByCourseUseCaseResponse> {
    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        Object.values(TEACHER_ROLE),
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const students = await this.studentsRepository.findAll(pagination, {
      courseId,
    });

    return right(students);
  }
}
