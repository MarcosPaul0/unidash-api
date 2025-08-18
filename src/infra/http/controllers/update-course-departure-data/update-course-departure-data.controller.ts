import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UpdateCourseDepartureDataUseCase } from '@/domain/application/use-cases/update-course-departure-data/update-course-departure-data';

const updateCourseDepartureDataBodySchema = z.object({
  completed: z.int().min(0).max(200).optional(),
  maximumDuration: z.int().min(0).max(200).optional(),
  dropouts: z.int().min(0).max(200).optional(),
  transfers: z.int().min(0).max(200).optional(),
  withdrawals: z.int().min(0).max(200).optional(),
  removals: z.int().min(0).max(200).optional(),
  newExams: z.int().min(0).max(200).optional(),
  deaths: z.int().min(0).max(200).optional(),
});

type UpdateCourseDepartureDataBodySchema = z.infer<
  typeof updateCourseDepartureDataBodySchema
>;

@Controller('/course-departure-data/:courseDepartureDataId')
export class UpdateCourseDepartureDataController {
  constructor(
    private updateCourseDepartureDataUseCase: UpdateCourseDepartureDataUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(updateCourseDepartureDataBodySchema))
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body() body: UpdateCourseDepartureDataBodySchema,
    @Param('courseDepartureDataId') courseDepartureDataId: string,
  ) {
    const result = await this.updateCourseDepartureDataUseCase.execute({
      courseDepartureDataId,
      data: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
