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
import { RegisterCourseCoordinationDataUseCase } from '@/domain/application/use-cases/register-course-coordination-data/register-course-coordination-data';

const registerCourseCoordinationDataBodySchema = z.object({
  courseId: z.uuid(),
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  servicesRequestsBySystem: z.int().min(0).max(1000),
  servicesRequestsByEmail: z.int().min(0).max(1000),
  resolutionActions: z.int().min(0).max(1000),
  administrativeDecisionActions: z.int().min(0).max(1000),
  meetingsByBoardOfDirectors: z.int().min(0).max(1000),
  meetingsByUndergraduateChamber: z.int().min(0).max(1000),
  meetingsByCourseCouncil: z.int().min(0).max(1000),
});

type RegisterCourseCoordinationDataBodySchema = z.infer<
  typeof registerCourseCoordinationDataBodySchema
>;

@Controller('/course-coordination-data')
export class RegisterCourseCoordinationDataController {
  constructor(
    private registerCourseCoordinationData: RegisterCourseCoordinationDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerCourseCoordinationDataBodySchema))
    body: RegisterCourseCoordinationDataBodySchema,
  ) {
    const result = await this.registerCourseCoordinationData.execute({
      courseCoordinationData: body,
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
