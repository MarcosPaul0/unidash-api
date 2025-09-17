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
import { RegisterTeacherResearchAndExtensionProjectsDataUseCase } from '@/domain/application/use-cases/register-teacher-research-and-extension-projects-data/register-teacher-research-and-extension-projects-data';

const registerTeacherResearchAndExtensionProjectsDataBodySchema = z.object({
  teacherId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  extensionProjects: z.int().min(0).max(1000),
  researchProjects: z.int().min(0).max(1000),
});

type RegisterTeacherResearchAndExtensionProjectsDataBodySchema = z.infer<
  typeof registerTeacherResearchAndExtensionProjectsDataBodySchema
>;

@Controller('/teacher-research-and-extension-projects-data')
export class RegisterTeacherResearchAndExtensionProjectsDataController {
  constructor(
    private registerTeacherResearchAndExtensionProjectsData: RegisterTeacherResearchAndExtensionProjectsDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(
      new ZodValidationPipe(
        registerTeacherResearchAndExtensionProjectsDataBodySchema,
      ),
    )
    body: RegisterTeacherResearchAndExtensionProjectsDataBodySchema,
  ) {
    const result =
      await this.registerTeacherResearchAndExtensionProjectsData.execute({
        teacherResearchAndExtensionProjectsData: body,
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
