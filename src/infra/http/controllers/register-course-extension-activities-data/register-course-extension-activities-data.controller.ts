import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-extension-activities-data/register-course-extension-activities-data';

const registerCourseExtensionActivitiesDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  specialProjects: z.int().min(0).max(1000),
  participationInCompetitions: z.int().min(0).max(1000),
  entrepreneurshipAndInnovation: z.int().min(0).max(1000),
  eventOrganization: z.int().min(0).max(1000),
  externalInternship: z.int().min(0).max(1000),
  cultureAndExtensionProjects: z.int().min(0).max(1000),
  semiannualProjects: z.int().min(0).max(1000),
  workNonGovernmentalOrganization: z.int().min(0).max(1000),
  juniorCompanies: z.int().min(0).max(1000),
  provisionOfServicesWithSelfEmployedWorkers: z.int().min(0).max(1000),
});

type RegisterCourseExtensionActivitiesDataBodySchema = z.infer<
  typeof registerCourseExtensionActivitiesDataBodySchema
>;

@Controller('/course-extension-activities-data')
export class RegisterCourseExtensionActivitiesDataController {
  constructor(
    private registerCourseExtensionActivitiesData: RegisterCourseExtensionActivitiesDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(registerCourseExtensionActivitiesDataBodySchema),
    )
    body: RegisterCourseExtensionActivitiesDataBodySchema,
  ) {
    const result = await this.registerCourseExtensionActivitiesData.execute({
      courseExtensionActivitiesData: body,
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
