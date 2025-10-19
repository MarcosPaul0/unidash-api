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
import { SEMESTER } from '@/domain/entities/course-data';
import { UpdateCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/update-course-extension-complementary-activities-data/update-course-extension-complementary-activities-data';

const updateCourseExtensionComplementaryActivitiesDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  culturalActivities: z.int().min(0).max(1000).optional(),
  sportsCompetitions: z.int().min(0).max(1000).optional(),
  awardsAtEvents: z.int().min(0).max(1000).optional(),
  studentRepresentation: z.int().min(0).max(1000).optional(),
  participationInCollegiateBodies: z.int().min(0).max(1000).optional(),
});

type UpdateCourseExtensionComplementaryActivitiesDataBodySchema = z.infer<
  typeof updateCourseExtensionComplementaryActivitiesDataBodySchema
>;

@Controller(
  '/course-extension-complementary-activities-data/:courseExtensionComplementaryActivitiesDataId',
)
export class UpdateCourseExtensionComplementaryActivitiesDataController {
  constructor(
    private updateCourseExtensionComplementaryActivitiesDataUseCase: UpdateCourseExtensionComplementaryActivitiesDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        updateCourseExtensionComplementaryActivitiesDataBodySchema,
      ),
    )
    body: UpdateCourseExtensionComplementaryActivitiesDataBodySchema,
    @Param('courseExtensionComplementaryActivitiesDataId')
    courseExtensionComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.updateCourseExtensionComplementaryActivitiesDataUseCase.execute(
        {
          courseExtensionComplementaryActivitiesDataId,
          data: body,
          sessionUser,
        },
      );

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
