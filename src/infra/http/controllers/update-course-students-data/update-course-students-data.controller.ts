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
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { User } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UpdateCourseStudentsDataUseCase } from '@/domain/application/use-cases/update-course-students-data/update-course-students-data';

const updateCourseStudentsDataBodySchema = z.object({
  entrants: z.int().min(0).max(200).optional(),
  actives: z.int().min(0).max(200).optional(),
  locks: z.int().min(0).max(200).optional(),
  canceled: z.int().min(0).max(200).optional(),
});

type UpdateCourseStudentsDataBodySchema = z.infer<
  typeof updateCourseStudentsDataBodySchema
>;

@Controller('/course-students-data/:courseStudentsDataId')
export class UpdateCourseStudentsDataController {
  constructor(
    private updateCourseStudentsDataUseCase: UpdateCourseStudentsDataUseCase,
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(updateCourseStudentsDataBodySchema))
  async handle(
    @CurrentUser() sessionUser: User,
    @Body() body: UpdateCourseStudentsDataBodySchema,
    @Param('courseStudentsDataId') courseStudentsDataId: string,
  ) {
    const result = await this.updateCourseStudentsDataUseCase.execute({
      courseStudentsDataId,
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
