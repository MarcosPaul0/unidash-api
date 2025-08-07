import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FindTeacherByIdUseCase } from '@/domain/application/use-cases/find-teacher-by-id/find-teacher-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherPresenter } from '../../presenters/teacher-presenter';
import { User } from '@/domain/entities/user';

@Controller('/teacher/:teacherId')
export class FindTeacherByIdController {
  constructor(private findTeacherByIdUseCase: FindTeacherByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: User,
    @Param('teacherId') teacherId: string,
  ) {
    const result = await this.findTeacherByIdUseCase.execute({
      teacherId,
      sessionUser,
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
