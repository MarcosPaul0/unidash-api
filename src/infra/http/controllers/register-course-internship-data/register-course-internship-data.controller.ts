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
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SEMESTER } from '@/domain/entities/course-data';
import { RegisterCourseInternshipDataUseCase } from '@/domain/application/use-cases/register-course-internship-data/register-course-internship-data';
import { CONCLUSION_TIME } from '@/domain/entities/course-internship-data';
import { InvalidStudentForCourseDataError } from '@/domain/application/use-cases/errors/invalid-student-for-course-data-error';
import { CourseInternshipDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-internship-data-already-exists-error';

const registerCourseInternshipDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  studentMatriculation: z.string().min(10).max(10),
  enterpriseCnpj: z.string().min(14).max(14),
  role: z.string().min(1).max(60),
  conclusionTime: z.enum(CONCLUSION_TIME),
  cityId: z.uuid(),
  advisorId: z.uuid(),
});

type RegisterCourseInternshipDataBodySchema = z.infer<
  typeof registerCourseInternshipDataBodySchema
>;

@Controller('/course-internship-data')
export class RegisterCourseInternshipDataController {
  constructor(
    private registerCourseInternshipData: RegisterCourseInternshipDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseInternshipDataBodySchema))
    body: RegisterCourseInternshipDataBodySchema,
  ) {
    const result = await this.registerCourseInternshipData.execute({
      courseInternshipData: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseInternshipDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case InvalidStudentForCourseDataError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
