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
import { RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase } from '@/domain/application/use-cases/register-teacher-technical-scientific-productions-data-by-teacher/register-teacher-technical-scientific-productions-data-by-teacher';

const registerTeacherTechnicalScientificProductionsDataByTeacherBodySchema =
  z.object({
    year: z.int().max(new Date().getFullYear()).min(0),
    semester: z.enum(SEMESTER),
    periodicals: z.int().min(0).max(1000),
    congress: z.int().min(0).max(1000),
    booksChapter: z.int().min(0).max(1000),
    programs: z.int().min(0).max(1000),
    abstracts: z.int().min(0).max(1000),
  });

type RegisterTeacherTechnicalScientificProductionsDataBodySchema = z.infer<
  typeof registerTeacherTechnicalScientificProductionsDataByTeacherBodySchema
>;

@Controller('/teacher-technical-scientific-productions-data/by-teacher')
export class RegisterTeacherTechnicalScientificProductionsDataByTeacherController {
  constructor(
    private registerTeacherTechnicalScientificProductionsDataByTeacherUseCase: RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerTeacherTechnicalScientificProductionsDataByTeacherBodySchema,
      ),
    )
    body: RegisterTeacherTechnicalScientificProductionsDataBodySchema,
  ) {
    const result =
      await this.registerTeacherTechnicalScientificProductionsDataByTeacherUseCase.execute(
        {
          teacherTechnicalScientificProductionsData: body,
          sessionUser,
        },
      );

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
