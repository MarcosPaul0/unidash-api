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
import { RegisterCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/register-course-completion-work-data/register-course-completion-work-data';
import { CourseCompletionWorkDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-completion-work-data-already-exists-error';

const registerCourseCompletionWorkDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  enrollments: z.int().min(0).max(1000),
  defenses: z.int().min(0).max(1000),
  abandonments: z.int().min(0).max(1000),
});

type RegisterCourseCompletionWorkDataBodySchema = z.infer<
  typeof registerCourseCompletionWorkDataBodySchema
>;

@Controller('/course-completion-work-data')
export class RegisterCourseCompletionWorkDataController {
  constructor(
    private registerCourseCompletionWorkData: RegisterCourseCompletionWorkDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseCompletionWorkDataBodySchema))
    body: RegisterCourseCompletionWorkDataBodySchema,
  ) {
    const result = await this.registerCourseCompletionWorkData.execute({
      courseCompletionWorkData: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseCompletionWorkDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
