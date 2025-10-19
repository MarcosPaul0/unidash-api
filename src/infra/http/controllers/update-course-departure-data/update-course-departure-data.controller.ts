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
  Patch,
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UpdateCourseDepartureDataUseCase } from '@/domain/application/use-cases/update-course-departure-data/update-course-departure-data';

const updateCourseDepartureDataBodySchema = z.object({
  completed: z.int().min(0).max(1000).optional(),
  maximumDuration: z.int().min(0).max(1000).optional(),
  dropouts: z.int().min(0).max(1000).optional(),
  transfers: z.int().min(0).max(1000).optional(),
  withdrawals: z.int().min(0).max(1000).optional(),
  removals: z.int().min(0).max(1000).optional(),
  newExams: z.int().min(0).max(1000).optional(),
  deaths: z.int().min(0).max(1000).optional(),
});

type UpdateCourseDepartureDataBodySchema = z.infer<
  typeof updateCourseDepartureDataBodySchema
>;

@Controller('/course-departure-data/:courseDepartureDataId')
export class UpdateCourseDepartureDataController {
  constructor(
    private updateCourseDepartureDataUseCase: UpdateCourseDepartureDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseDepartureDataBodySchema))
    body: UpdateCourseDepartureDataBodySchema,
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
