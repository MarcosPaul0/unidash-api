import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Teacher } from '@/domain/entities/teacher';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';

export interface UpdateTeacherByAdminData {
  name?: string;
  isActive?: boolean;
}

interface UpdateTeacherByAdminUseCaseRequest {
  teacherId: string;
  data: UpdateTeacherByAdminData;
  sessionUser: SessionUser;
}

type UpdateTeacherUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    teacher: Teacher;
  }
>;

@Injectable()
export class UpdateTeacherByAdminUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherId,
    data,
    sessionUser,
  }: UpdateTeacherByAdminUseCaseRequest): Promise<UpdateTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    Object.assign(teacher, data);

    await this.teachersRepository.save(teacher);

    return right({
      teacher,
    });
  }
}
