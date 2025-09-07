import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { CourseCoordinationDataPresenter } from '../../presenters/course-coordination-data-presenter';
import { GetCourseCoordinationIndicatorsUseCase } from '@/domain/application/use-cases/get-course-coordination-indicators/get-course-coordination-indicators';
import { CourseCoordinationIndicatorsPresenter } from '../../presenters/course-coordination-indicators-presenter';

const getCourseCoordinationIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseCoordinationIndicatorsQuerySchema = z.infer<
  typeof getCourseCoordinationIndicatorsQuerySchema
>;

@Controller('/course-coordination-indicators/:courseId')
export class GetCourseCoordinationIndicatorsController {
  constructor(
    private getCourseCoordinationIndicators: GetCourseCoordinationIndicatorsUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(getCourseCoordinationIndicatorsQuerySchema))
    query?: GetCourseCoordinationIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseCoordinationIndicators.execute({
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

    return CourseCoordinationIndicatorsPresenter.toHTTP(result.value);
  }
}
