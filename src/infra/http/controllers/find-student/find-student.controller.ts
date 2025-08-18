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
import { StudentPresenter } from '../../presenters/student-presenter';
import { SessionUser } from '@/domain/entities/user';
import { FindStudentUseCase } from '@/domain/application/use-cases/find-student/find-student';

@Controller('/students/me')
export class FindStudentController {
  constructor(private findStudentUseCase: FindStudentUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() sessionUser: SessionUser) {
    const result = await this.findStudentUseCase.execute({
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

    return { student: StudentPresenter.toHTTP(result.value.student) };
  }
}
