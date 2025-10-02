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
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase } from '@/domain/application/use-cases/register-teacher-supervised-completion-work-data-by-teacher/register-teacher-supervised-completion-work-data-by-teacher';
import { TeacherSupervisedCompletionWorkDataAlreadyExistsError } from '@/domain/application/use-cases/errors/teacher-supervised-completion-work-data-already-exists-error';

const registerTeacherSupervisedCompletionWorkDataByTeacherBodySchema = z.object(
  {
    courseId: z.uuid(),
    year: z.int().max(new Date().getFullYear()).min(0),
    semester: z.enum(SEMESTER),
    approved: z.int().min(0).max(1000),
    failed: z.int().min(0).max(1000),
  },
);

type RegisterTeacherSupervisedCompletionWorkDataBodySchema = z.infer<
  typeof registerTeacherSupervisedCompletionWorkDataByTeacherBodySchema
>;

@Controller('/teacher-supervised-completion-work-data/by-teacher')
export class RegisterTeacherSupervisedCompletionWorkDataByTeacherController {
  constructor(
    private registerTeacherSupervisedCompletionWorkDataByTeacherUseCase: RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerTeacherSupervisedCompletionWorkDataByTeacherBodySchema,
      ),
    )
    body: RegisterTeacherSupervisedCompletionWorkDataBodySchema,
  ) {
    const result =
      await this.registerTeacherSupervisedCompletionWorkDataByTeacherUseCase.execute(
        {
          teacherSupervisedCompletionWorkData: body,
          sessionUser,
        },
      );

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case TeacherSupervisedCompletionWorkDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
