import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { AdminsRepository } from '../../repositories/admins-repository';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UserRole } from '@/domain/entities/user';
import { Admin } from '@/domain/entities/admin';

interface FindAdminByIdUseCaseRequest {
  id: string;
  userRole: UserRole;
}

type FindAdminByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    admin: Admin;
  }
>;

@Injectable()
export class FindAdminByIdUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    id,
    userRole,
  }: FindAdminByIdUseCaseRequest): Promise<FindAdminByIdUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError());
    }

    const admin = await this.adminsRepository.findById(id);

    if (!admin) {
      return left(new ResourceNotFoundError());
    }

    return right({
      admin,
    });
  }
}
