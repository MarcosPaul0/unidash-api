import { Body, Controller, NotFoundException, Patch } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UpdateTeacherUseCase } from '@/domain/application/use-cases/update-teacher/update-teacher';
import { SessionUser } from '@/domain/entities/user';

const updateTeacherBodySchema = z.object({
  name: z.string().optional(),
});

export type UpdateTeacherBodySchema = z.infer<typeof updateTeacherBodySchema>;

@Controller('/teachers')
export class UpdateTeacherController {
  constructor(private updateTeacherUseCase: UpdateTeacherUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateTeacherBodySchema))
    updateTeacherBody: UpdateTeacherBodySchema,
  ) {
    const result = await this.updateTeacherUseCase.execute({
      teacherId: sessionUser.id,
      data: updateTeacherBody,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new NotFoundException(error.message);
    }
  }
}
