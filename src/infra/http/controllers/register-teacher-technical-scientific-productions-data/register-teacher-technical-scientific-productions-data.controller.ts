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
import { RegisterTeacherTechnicalScientificProductionsDataUseCase } from '@/domain/application/use-cases/register-teacher-technical-scientific-productions-data/register-teacher-technical-scientific-productions-data';

const registerTeacherTechnicalScientificProductionsDataBodySchema = z.object({
  teacherId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  periodicals: z.int().min(0).max(1000),
  congress: z.int().min(0).max(1000),
  booksChapter: z.int().min(0).max(1000),
  programs: z.int().min(0).max(1000),
  abstracts: z.int().min(0).max(1000),
});

type RegisterTeacherTechnicalScientificProductionsDataBodySchema = z.infer<
  typeof registerTeacherTechnicalScientificProductionsDataBodySchema
>;

@Controller('/teacher-technical-scientific-productions-data')
export class RegisterTeacherTechnicalScientificProductionsDataController {
  constructor(
    private registerTeacherTechnicalScientificProductionsData: RegisterTeacherTechnicalScientificProductionsDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerTeacherTechnicalScientificProductionsDataBodySchema,
      ),
    )
    body: RegisterTeacherTechnicalScientificProductionsDataBodySchema,
  ) {
    const result =
      await this.registerTeacherTechnicalScientificProductionsData.execute({
        teacherTechnicalScientificProductionsData: body,
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
