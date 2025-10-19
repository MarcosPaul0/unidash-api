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
import { UpdateCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/update-course-completion-work-data/update-course-completion-work-data';

const updateCourseCompletionWorkDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  enrollments: z.int().min(0).max(1000).optional(),
  defenses: z.int().min(0).max(1000).optional(),
  abandonments: z.int().min(0).max(1000).optional(),
});

type UpdateCourseCompletionWorkDataBodySchema = z.infer<
  typeof updateCourseCompletionWorkDataBodySchema
>;

@Controller('/course-completion-work-data/:courseCompletionWorkDataId')
export class UpdateCourseCompletionWorkDataController {
  constructor(
    private updateCourseCompletionWorkDataUseCase: UpdateCourseCompletionWorkDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseCompletionWorkDataBodySchema))
    body: UpdateCourseCompletionWorkDataBodySchema,
    @Param('courseCompletionWorkDataId') courseCompletionWorkDataId: string,
  ) {
    const result = await this.updateCourseCompletionWorkDataUseCase.execute({
      courseCompletionWorkDataId,
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
