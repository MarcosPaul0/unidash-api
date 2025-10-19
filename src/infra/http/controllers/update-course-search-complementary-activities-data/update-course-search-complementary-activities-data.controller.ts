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
import { UpdateCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/update-course-search-complementary-activities-data/update-course-search-complementary-activities-data';

const updateCourseSearchComplementaryActivitiesDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  scientificInitiation: z.int().min(0).max(1000).optional(),
  developmentInitiation: z.int().min(0).max(1000).optional(),
  publishedArticles: z.int().min(0).max(1000).optional(),
  fullPublishedArticles: z.int().min(0).max(1000).optional(),
  publishedAbstracts: z.int().min(0).max(1000).optional(),
  presentationOfWork: z.int().min(0).max(1000).optional(),
  participationInEvents: z.int().min(0).max(1000).optional(),
});

type UpdateCourseSearchComplementaryActivitiesDataBodySchema = z.infer<
  typeof updateCourseSearchComplementaryActivitiesDataBodySchema
>;

@Controller(
  '/course-search-complementary-activities-data/:courseSearchComplementaryActivitiesDataId',
)
export class UpdateCourseSearchComplementaryActivitiesDataController {
  constructor(
    private updateCourseSearchComplementaryActivitiesDataUseCase: UpdateCourseSearchComplementaryActivitiesDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        updateCourseSearchComplementaryActivitiesDataBodySchema,
      ),
    )
    body: UpdateCourseSearchComplementaryActivitiesDataBodySchema,
    @Param('courseSearchComplementaryActivitiesDataId')
    courseSearchComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.updateCourseSearchComplementaryActivitiesDataUseCase.execute({
        courseSearchComplementaryActivitiesDataId,
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
