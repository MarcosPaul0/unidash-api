import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { GetCourseIndicatorsUseCase } from '@/domain/application/use-cases/get-course-indicators/get-course-indicators';
import { CourseIndicatorsPresenter } from '../../presenters/course-indicators-presenter';

const getCourseIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseIndicatorsQuerySchema = z.infer<
  typeof getCourseIndicatorsQuerySchema
>;

@Controller('/course-indicators/:courseId')
export class GetCourseIndicatorsController {
  constructor(private getCourseIndicators: GetCourseIndicatorsUseCase) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(getCourseIndicatorsQuerySchema))
    query?: GetCourseIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseIndicators.execute({
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

    return CourseIndicatorsPresenter.toHTTP(result.value);
  }
}
