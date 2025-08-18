import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { FindStudentByIdUseCase } from '@/domain/application/use-cases/find-student-by-id/find-student-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { StudentPresenter } from '../../presenters/student-presenter';
import { SessionUser } from '@/domain/entities/user';

@Controller('/students/:studentId')
export class FindStudentByIdController {
  constructor(private findStudentByIdUseCase: FindStudentByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('studentId') studentId: string,
  ) {
    const result = await this.findStudentByIdUseCase.execute({
      studentId,
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
