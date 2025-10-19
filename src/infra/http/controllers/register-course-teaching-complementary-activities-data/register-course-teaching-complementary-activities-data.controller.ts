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
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-teaching-complementary-activities-data/register-course-teaching-complementary-activities-data';
import { CourseTeachingComplementaryActivitiesDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-teaching-complementary-activities-data-already-exists-error';

const registerCourseTeachingComplementaryActivitiesDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  subjectMonitoring: z.int().min(0).max(1000),
  sponsorshipOfNewStudents: z.int().min(0).max(1000),
  providingTraining: z.int().min(0).max(1000),
  coursesInTheArea: z.int().min(0).max(1000),
  coursesOutsideTheArea: z.int().min(0).max(1000),
  electivesDisciplines: z.int().min(0).max(1000),
  complementaryCoursesInTheArea: z.int().min(0).max(1000),
  preparationForTest: z.int().min(0).max(1000),
});

type RegisterCourseTeachingComplementaryActivitiesDataBodySchema = z.infer<
  typeof registerCourseTeachingComplementaryActivitiesDataBodySchema
>;

@Controller('/course-teaching-complementary-activities-data')
export class RegisterCourseTeachingComplementaryActivitiesDataController {
  constructor(
    private registerCourseTeachingComplementaryActivitiesData: RegisterCourseTeachingComplementaryActivitiesDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerCourseTeachingComplementaryActivitiesDataBodySchema,
      ),
    )
    body: RegisterCourseTeachingComplementaryActivitiesDataBodySchema,
  ) {
    const result =
      await this.registerCourseTeachingComplementaryActivitiesData.execute({
        courseTeachingComplementaryActivitiesData: body,
        sessionUser,
      });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseTeachingComplementaryActivitiesDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
