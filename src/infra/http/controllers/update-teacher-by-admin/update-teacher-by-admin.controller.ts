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
import { UpdateTeacherUseCase } from '@/domain/application/use-cases/update-teacher/update-teacher';
import { SessionUser } from '@/domain/entities/user';
import { UpdateTeacherByAdminUseCase } from '@/domain/application/use-cases/update-teacher-by-admin/update-teacher-by-admin';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

const updateTeacherByAdminBodySchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateTeacherByAdminBodySchema = z.infer<
  typeof updateTeacherByAdminBodySchema
>;

@Controller('/teachers/by-admin/:teacherId')
export class UpdateTeacherByAdminController {
  constructor(
    private updateTeacherByAdminUseCase: UpdateTeacherByAdminUseCase,
  ) {}

  @Patch()
  async handle(
    @Param('teacherId') teacherId: string,
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateTeacherByAdminBodySchema))
    data: UpdateTeacherByAdminBodySchema,
  ) {
    const result = await this.updateTeacherByAdminUseCase.execute({
      teacherId,
      data,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
