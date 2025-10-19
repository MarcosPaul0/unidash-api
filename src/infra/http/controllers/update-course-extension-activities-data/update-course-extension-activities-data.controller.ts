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
import { UpdateCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/update-course-extension-activities-data/update-course-extension-activities-data';
import { SEMESTER } from '@/domain/entities/course-data';

const updateCourseExtensionActivitiesDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  specialProjects: z.int().min(0).max(1000).optional(),
  participationInCompetitions: z.int().min(0).max(1000).optional(),
  entrepreneurshipAndInnovation: z.int().min(0).max(1000).optional(),
  eventOrganization: z.int().min(0).max(1000).optional(),
  externalInternship: z.int().min(0).max(1000).optional(),
  cultureAndExtensionProjects: z.int().min(0).max(1000).optional(),
  semiannualProjects: z.int().min(0).max(1000).optional(),
  workNonGovernmentalOrganization: z.int().min(0).max(1000).optional(),
  juniorCompanies: z.int().min(0).max(1000).optional(),
  provisionOfServicesWithSelfEmployedWorkers: z
    .int()
    .min(0)
    .max(1000)
    .optional(),
});

type UpdateCourseExtensionActivitiesDataBodySchema = z.infer<
  typeof updateCourseExtensionActivitiesDataBodySchema
>;

@Controller(
  '/course-extension-activities-data/:courseExtensionActivitiesDataId',
)
export class UpdateCourseExtensionActivitiesDataController {
  constructor(
    private updateCourseExtensionActivitiesDataUseCase: UpdateCourseExtensionActivitiesDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseExtensionActivitiesDataBodySchema))
    body: UpdateCourseExtensionActivitiesDataBodySchema,
    @Param('courseExtensionActivitiesDataId')
    courseExtensionActivitiesDataId: string,
  ) {
    const result =
      await this.updateCourseExtensionActivitiesDataUseCase.execute({
        courseExtensionActivitiesDataId,
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
