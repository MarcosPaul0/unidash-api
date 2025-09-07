import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UpdateStudentUseCase } from '@/domain/application/use-cases/update-student/update-student';
import { SessionUser } from '@/domain/entities/user';
import { STUDENT_TYPE } from '@/domain/entities/student';

const updateStudentBodySchema = z.object({
  name: z.string().optional(),
  matriculation: z.string().min(10).max(10).optional(),
  type: z.enum(STUDENT_TYPE).optional(),
});

export type UpdateStudentBodySchema = z.infer<typeof updateStudentBodySchema>;

@Controller('/students/:studentId')
export class UpdateStudentController {
  constructor(private updateStudentUseCase: UpdateStudentUseCase) {}

  @Patch()
  async handle(
    @Param('studentId') studentId: string,
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateStudentBodySchema))
    data: UpdateStudentBodySchema,
  ) {
    const result = await this.updateStudentUseCase.execute({
      studentId,
      data,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new NotFoundException(error.message);
    }
  }
}
