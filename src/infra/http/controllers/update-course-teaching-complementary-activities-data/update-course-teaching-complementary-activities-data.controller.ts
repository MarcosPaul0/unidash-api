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
import { UpdateCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/update-course-teaching-complementary-activities-data/update-course-teaching-complementary-activities-data';

const updateCourseTeachingComplementaryActivitiesDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  subjectMonitoring: z.int().min(0).max(1000).optional(),
  sponsorshipOfNewStudents: z.int().min(0).max(1000).optional(),
  providingTraining: z.int().min(0).max(1000).optional(),
  coursesInTheArea: z.int().min(0).max(1000).optional(),
  coursesOutsideTheArea: z.int().min(0).max(1000).optional(),
  electivesDisciplines: z.int().min(0).max(1000).optional(),
  complementaryCoursesInTheArea: z.int().min(0).max(1000).optional(),
  preparationForTest: z.int().min(0).max(1000).optional(),
});

type UpdateCourseTeachingComplementaryActivitiesDataBodySchema = z.infer<
  typeof updateCourseTeachingComplementaryActivitiesDataBodySchema
>;

@Controller(
  '/course-teaching-complementary-activities-data/:courseTeachingComplementaryActivitiesDataId',
)
export class UpdateCourseTeachingComplementaryActivitiesDataController {
  constructor(
    private updateCourseTeachingComplementaryActivitiesDataUseCase: UpdateCourseTeachingComplementaryActivitiesDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        updateCourseTeachingComplementaryActivitiesDataBodySchema,
      ),
    )
    body: UpdateCourseTeachingComplementaryActivitiesDataBodySchema,
    @Param('courseTeachingComplementaryActivitiesDataId')
    courseTeachingComplementaryActivitiesDataId: string,
  ) {
    const result =
      await this.updateCourseTeachingComplementaryActivitiesDataUseCase.execute(
        {
          courseTeachingComplementaryActivitiesDataId,
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
