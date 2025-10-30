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
import { UpdateCourseCoordinationDataUseCase } from '@/domain/application/use-cases/update-course-coordination-data/update-course-coordination-data';
import { SEMESTER } from '@/domain/entities/course-data';

const updateCourseCoordinationDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  servicesRequestsBySystem: z.int().min(0).max(1000).optional(),
  servicesRequestsByEmail: z.int().min(0).max(1000).optional(),
  resolutionActions: z.int().min(0).max(1000).optional(),
  administrativeDecisionActions: z.int().min(0).max(1000).optional(),
  meetingsByBoardOfDirectors: z.int().min(0).max(1000).optional(),
  meetingsByUndergraduateChamber: z.int().min(0).max(1000).optional(),
  meetingsByCourseCouncil: z.int().min(0).max(1000).optional(),
});

type UpdateCourseCoordinationDataBodySchema = z.infer<
  typeof updateCourseCoordinationDataBodySchema
>;

@Controller('/course-coordination-data/:courseCoordinationDataId')
export class UpdateCourseCoordinationDataController {
  constructor(
    private updateCourseCoordinationDataUseCase: UpdateCourseCoordinationDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseCoordinationDataBodySchema))
    body: UpdateCourseCoordinationDataBodySchema,
    @Param('courseCoordinationDataId') courseCoordinationDataId: string,
  ) {
    const result = await this.updateCourseCoordinationDataUseCase.execute({
      courseCoordinationDataId,
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
