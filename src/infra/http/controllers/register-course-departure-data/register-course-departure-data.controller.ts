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
import { RegisterCourseDepartureDataUseCase } from '@/domain/application/use-cases/register-course-departure-data/register-course-departure-data';
import { SEMESTER } from '@/domain/entities/course-data';

const registerCourseDepartureDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  completed: z.int().min(0).max(1000),
  maximumDuration: z.int().min(0).max(1000),
  dropouts: z.int().min(0).max(1000),
  transfers: z.int().min(0).max(1000),
  withdrawals: z.int().min(0).max(1000),
  removals: z.int().min(0).max(1000),
  newExams: z.int().min(0).max(1000),
  deaths: z.int().min(0).max(1000),
});

type RegisterCourseDepartureDataBodySchema = z.infer<
  typeof registerCourseDepartureDataBodySchema
>;

@Controller('/course-departure-data')
export class RegisterCourseDepartureDataController {
  constructor(
    private registerCourseDepartureData: RegisterCourseDepartureDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseDepartureDataBodySchema))
    body: RegisterCourseDepartureDataBodySchema,
  ) {
    const result = await this.registerCourseDepartureData.execute({
      courseDepartureData: body,
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
