import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherPresenter } from '../../presenters/teacher-presenter';
import { FindTeacherUseCase } from '@/domain/application/use-cases/find-teacher/find-teacher';
import { SessionUser } from '@/domain/entities/user';

@Controller('/teachers/me')
export class FindTeacherController {
  constructor(private findTeacherUseCase: FindTeacherUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() sessionUser: SessionUser) {
    const result = await this.findTeacherUseCase.execute({
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
