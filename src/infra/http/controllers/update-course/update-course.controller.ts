import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UpdateCourseUseCase } from '@/domain/application/use-cases/update-course/update-course';
import { SessionUser, User } from '@/domain/entities/user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

const updateCourseBodySchema = z.object({
  name: z.string().optional(),
});

export type UpdateCourseBodySchema = z.infer<typeof updateCourseBodySchema>;

@Controller('/courses')
export class UpdateCourseController {
  constructor(private updateCourseUseCase: UpdateCourseUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Body(new ZodValidationPipe(updateCourseBodySchema))
    body: UpdateCourseBodySchema,
  ) {
    const { name } = body;

    const result = await this.updateCourseUseCase.execute({
      courseId,
      data: { name },
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException();
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
