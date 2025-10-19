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
  Patch,
  UsePipes,
} from '@nestjs/common';
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { UpdateCourseInternshipDataUseCase } from '@/domain/application/use-cases/update-course-internship-data/update-course-internship-data';
import { EMPLOYMENT_TYPE } from '@/domain/entities/course-internship-data';

const updateCourseInternshipDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0).optional(),
  semester: z.enum(SEMESTER).optional(),
  studentMatriculation: z.string().min(10).max(10).optional(),
  enterpriseCnpj: z.string().min(14).max(14).optional(),
  employmentType: z.enum(EMPLOYMENT_TYPE).optional(),
  role: z.string().min(1).max(60).optional(),
  conclusionTimeInDays: z.int().min(0).max(1000).optional(),
  cityId: z.uuid().optional(),
  advisorId: z.uuid().optional(),
});

type UpdateCourseInternshipDataBodySchema = z.infer<
  typeof updateCourseInternshipDataBodySchema
>;

@Controller('/course-internship-data/:courseInternshipDataId')
export class UpdateCourseInternshipDataController {
  constructor(
    private updateCourseInternshipDataUseCase: UpdateCourseInternshipDataUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(updateCourseInternshipDataBodySchema))
    body: UpdateCourseInternshipDataBodySchema,
    @Param('courseInternshipDataId')
    courseInternshipDataId: string,
  ) {
    const result = await this.updateCourseInternshipDataUseCase.execute({
      courseInternshipDataId,
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
