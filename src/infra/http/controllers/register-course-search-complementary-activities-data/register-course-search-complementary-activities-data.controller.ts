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
import { RegisterCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-search-complementary-activities-data/register-course-search-complementary-activities-data';

const registerCourseSearchComplementaryActivitiesDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  scientificInitiation: z.int().min(0).max(1000),
  developmentInitiation: z.int().min(0).max(1000),
  publishedArticles: z.int().min(0).max(1000),
  fullPublishedArticles: z.int().min(0).max(1000),
  publishedAbstracts: z.int().min(0).max(1000),
  presentationOfWork: z.int().min(0).max(1000),
  participationInEvents: z.int().min(0).max(1000),
});

type RegisterCourseSearchComplementaryActivitiesDataBodySchema = z.infer<
  typeof registerCourseSearchComplementaryActivitiesDataBodySchema
>;

@Controller('/course-search-complementary-activities-data')
export class RegisterCourseSearchComplementaryActivitiesDataController {
  constructor(
    private registerCourseSearchComplementaryActivitiesData: RegisterCourseSearchComplementaryActivitiesDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerCourseSearchComplementaryActivitiesDataBodySchema,
      ),
    )
    body: RegisterCourseSearchComplementaryActivitiesDataBodySchema,
  ) {
    const result =
      await this.registerCourseSearchComplementaryActivitiesData.execute({
        courseSearchComplementaryActivitiesData: body,
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
