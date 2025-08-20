import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { FindAdminByIdUseCase } from '@/domain/application/use-cases/find-admin-by-id/find-admin-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { AdminPresenter } from '../../presenters/admin-presenter';
import { User } from '@/domain/entities/user';

@Controller('/admin/me')
export class FindAdminByIdController {
  constructor(private findAdminByIdUseCase: FindAdminByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() sessionUser: User) {
    const result = await this.findAdminByIdUseCase.execute({
      id: sessionUser.id.toString(),
      userRole: sessionUser.role,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return { admin: AdminPresenter.toHTTP(result.value.admin) };
  }
}
