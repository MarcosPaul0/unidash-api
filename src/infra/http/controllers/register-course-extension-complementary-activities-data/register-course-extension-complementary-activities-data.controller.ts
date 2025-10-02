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
import { RegisterCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-extension-complementary-activities-data/register-course-extension-complementary-activities-data';
import { CourseExtensionComplementaryActivitiesDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-extension-complementary-activities-data-already-exists-error';

const registerCourseExtensionComplementaryActivitiesDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  culturalActivities: z.int().min(0).max(1000),
  sportsCompetitions: z.int().min(0).max(1000),
  awardsAtEvents: z.int().min(0).max(1000),
  studentRepresentation: z.int().min(0).max(1000),
  participationInCollegiateBodies: z.int().min(0).max(1000),
});

type RegisterCourseExtensionComplementaryActivitiesDataBodySchema = z.infer<
  typeof registerCourseExtensionComplementaryActivitiesDataBodySchema
>;

@Controller('/course-extension-complementary-activities-data')
export class RegisterCourseExtensionComplementaryActivitiesDataController {
  constructor(
    private registerCourseExtensionComplementaryActivitiesData: RegisterCourseExtensionComplementaryActivitiesDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerCourseExtensionComplementaryActivitiesDataBodySchema,
      ),
    )
    body: RegisterCourseExtensionComplementaryActivitiesDataBodySchema,
  ) {
    const result =
      await this.registerCourseExtensionComplementaryActivitiesData.execute({
        courseExtensionComplementaryActivitiesData: body,
        sessionUser,
      });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseExtensionComplementaryActivitiesDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
