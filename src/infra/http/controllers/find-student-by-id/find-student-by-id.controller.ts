import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { FindStudentByIdUseCase } from '@/domain/application/use-cases/find-student-by-id/find-student-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { UserPayload } from '../../../auth/jwt.strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { StudentPresenter } from '../../presenters/student-presenter';

@Controller('/students/me')
export class FindStudentByIdController {
  constructor(private findStudentByIdUseCase: FindStudentByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() { sub, userRole }: UserPayload) {
    const result = await this.findStudentByIdUseCase.execute({
      id: sub,
      userRole,
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

    return { student: StudentPresenter.toHTTP(result.value.student) };
  }
}
