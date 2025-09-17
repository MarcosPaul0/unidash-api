import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { CheckIncomingStudentRespondedUseCase } from '@/domain/application/use-cases/check-incoming-student-responded/check-incoming-student-responded';

@Controller('/student-incoming-check-responded')
export class CheckIncomingStudentRespondedController {
  constructor(
    private checkIncomingStudentRespondedUseCase: CheckIncomingStudentRespondedUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() sessionUser: SessionUser) {
    const result = await this.checkIncomingStudentRespondedUseCase.execute({
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

    return result.value;
  }
}
