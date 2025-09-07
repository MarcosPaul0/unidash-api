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
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/register-teacher-supervised-completion-work-data/register-teacher-supervised-completion-work-data';

const registerTeacherSupervisedCompletionWorkDataBodySchema = z.object({
  courseId: z.uuid(),
  teacherId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  approved: z.int().min(0).max(1000),
  failed: z.int().min(0).max(1000),
});

type RegisterTeacherSupervisedCompletionWorkDataBodySchema = z.infer<
  typeof registerTeacherSupervisedCompletionWorkDataBodySchema
>;

@Controller('/teacher-supervised-completion-work-data')
export class RegisterTeacherSupervisedCompletionWorkDataController {
  constructor(
    private registerTeacherSupervisedCompletionWorkData: RegisterTeacherSupervisedCompletionWorkDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerTeacherSupervisedCompletionWorkDataBodySchema,
      ),
    )
    body: RegisterTeacherSupervisedCompletionWorkDataBodySchema,
  ) {
    const result =
      await this.registerTeacherSupervisedCompletionWorkData.execute({
        teacherSupervisedCompletionWorkData: body,
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
