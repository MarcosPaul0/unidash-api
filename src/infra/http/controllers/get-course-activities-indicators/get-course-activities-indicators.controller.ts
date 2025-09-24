import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { GetCourseActivitiesIndicatorsUseCase } from '@/domain/application/use-cases/get-course-activities-indicators/get-course-activities-indicators';
import { CourseActivitiesIndicatorsPresenter } from '../../presenters/course-activities-indicators-presenter';

const getCourseActivitiesIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseActivitiesIndicatorsQuerySchema = z.infer<
  typeof getCourseActivitiesIndicatorsQuerySchema
>;

@Controller('/course-activities-indicators/:courseId')
export class GetCourseActivitiesIndicatorsController {
  constructor(
    private getCourseActivitiesIndicators: GetCourseActivitiesIndicatorsUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(getCourseActivitiesIndicatorsQuerySchema))
    query?: GetCourseActivitiesIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseActivitiesIndicators.execute({
      courseId,
      filters: {
        semester: query?.semester,
        year: query?.year,
        yearFrom: query?.yearFrom,
        yearTo: query?.yearTo,
      },
    });

    if (result.isLeft()) {
      return;
    }

    return CourseActivitiesIndicatorsPresenter.toHTTP(result.value);
  }
}
