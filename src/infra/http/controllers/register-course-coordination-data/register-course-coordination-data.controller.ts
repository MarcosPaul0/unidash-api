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
import { RegisterCourseCoordinationDataUseCase } from '@/domain/application/use-cases/register-course-coordination-data/register-course-coordination-data';
import { CourseCoordinationDataAlreadyExistsError } from '@/domain/application/use-cases/errors/course-coordination-data-already-exists-error';

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
  academicActionPlans: z.int().min(0).max(1000),
  administrativeActionPlans: z.int().min(0).max(1000),
  actionPlansDescription: z.string().min(10).max(360).optional(),
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
      courseCoordinationData: {
        ...body,
        actionPlansDescription: body.actionPlansDescription ?? null,
      },
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CourseCoordinationDataAlreadyExistsError:
          throw new ConflictException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
