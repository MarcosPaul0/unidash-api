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
import { InvalidStudentForCourseDataError } from '@/domain/application/use-cases/errors/invalid-student-for-course-data-error';
import { RegisterStudentIncomingDataUseCase } from '@/domain/application/use-cases/register-student-incoming-data/register-student-incoming-data';
import {
  CURRENT_EDUCATION,
  ENGLISH_PROFICIENCY_LEVEL,
  WORK_EXPECTATION,
} from '@/domain/entities/student-incoming-data';
import {
  AFFINITY_LEVEL,
  HIGH_SCHOOL_DISCIPLINE,
} from '@/domain/entities/student-affinity-by-discipline-data';
import { ASSET } from '@/domain/entities/student-asset';
import { COURSE_CHOICE_REASON } from '@/domain/entities/student-course-choice-reason';
import { HOBBY_OR_HABIT } from '@/domain/entities/student-hobby-or-habit';
import { TECHNOLOGY } from '@/domain/entities/student-technology';
import { UNIVERSITY_CHOICE_REASON } from '@/domain/entities/student-university-choice-reason';

const registerStudentIncomingDataBodySchema = z.object({
  year: z.int().max(new Date().getFullYear()).min(0),
  semester: z.enum(SEMESTER),
  workExpectation: z.enum(WORK_EXPECTATION),
  currentEducation: z.enum(CURRENT_EDUCATION),
  englishProficiencyLevel: z.enum(ENGLISH_PROFICIENCY_LEVEL),
  nocturnalPreference: z.boolean(),
  knowRelatedCourseDifference: z.boolean(),
  readPedagogicalProject: z.boolean(),
  affinityByDisciplines: z.array(
    z.object({
      affinityLevel: z.enum(AFFINITY_LEVEL),
      discipline: z.enum(HIGH_SCHOOL_DISCIPLINE),
    }),
  ),
  assets: z.array(z.enum(ASSET)),
  courseChoiceReasons: z.array(z.enum(COURSE_CHOICE_REASON)),
  hobbyOrHabits: z.array(z.enum(HOBBY_OR_HABIT)),
  technologies: z.array(z.enum(TECHNOLOGY)),
  universityChoiceReasons: z.array(z.enum(UNIVERSITY_CHOICE_REASON)),
});

type RegisterStudentIncomingDataBodySchema = z.infer<
  typeof registerStudentIncomingDataBodySchema
>;

@Controller('/student-incoming-data')
export class RegisterStudentIncomingDataController {
  constructor(
    private registerStudentIncomingData: RegisterStudentIncomingDataUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Body(new ZodValidationPipe(registerStudentIncomingDataBodySchema))
    body: RegisterStudentIncomingDataBodySchema,
  ) {
    const result = await this.registerStudentIncomingData.execute({
      studentIncomingData: body,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
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
