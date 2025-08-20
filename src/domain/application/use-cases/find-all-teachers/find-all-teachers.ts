import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Pagination } from '@/core/pagination/pagination';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import {
  FindAllTeachersFilter,
  TeachersRepository,
} from '../../repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';

interface FindAllTeachersUseCaseRequest {
  pagination?: Pagination;
  filters?: FindAllTeachersFilter;
  sessionUser: SessionUser;
}

type FindAllTeachersUseCaseResponse = Either<
  NotAllowedError,
  {
    teachers: Teacher[];
    totalItems: number;
    totalPages: number;
  }
>;

@Injectable()
export class FindAllTeachersUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    pagination,
    filters,
    sessionUser,
  }: FindAllTeachersUseCaseRequest): Promise<FindAllTeachersUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teachersWithPagination =
      await this.teachersRepository.findAllWithPagination(pagination, filters);

    return right(teachersWithPagination);
  }
}
