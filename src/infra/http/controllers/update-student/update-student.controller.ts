import { Body, Controller, NotFoundException, Patch } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { UpdateStudentUseCase } from '@/domain/application/use-cases/update-student/update-student';

const updateStudentBodySchema = z.object({
  name: z.string().optional(),
  matriculation: z.string().min(10).max(10).optional(),
});

export type UpdateStudentBodySchema = z.infer<typeof updateStudentBodySchema>;

@Controller('students')
export class UpdateStudentController {
  constructor(private updateStudentUseCase: UpdateStudentUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() { sub: userId }: UserPayload,
    @Body(new ZodValidationPipe(updateStudentBodySchema))
    updateStudentBody: UpdateStudentBodySchema,
  ) {
    const result = await this.updateStudentUseCase.execute({
      studentId: userId,
      data: updateStudentBody,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new NotFoundException(error.message);
    }
  }
}
