import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { FindTeacherByIdUseCase } from '@/domain/application/use-cases/find-teacher-by-id/find-teacher-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { UserPayload } from '../../../auth/jwt.strategy';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherPresenter } from '../../presenters/teacher-presenter';

@Controller('/teacher/me')
export class FindTeacherByIdController {
  constructor(private findTeacherByIdUseCase: FindTeacherByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() { sub, userRole }: UserPayload) {
    const result = await this.findTeacherByIdUseCase.execute({
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

    return {
      teacher: TeacherPresenter.toHTTP(result.value.teacher),
    };
  }
}
