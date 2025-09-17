import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { GetCourseInternshipIndicatorsUseCase } from '@/domain/application/use-cases/get-course-internship-indicators/get-course-internship-indicators';
import { CourseInternshipIndicatorsPresenter } from '../../presenters/course-internship-indicators-presenter';

const getCourseInternshipIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseInternshipIndicatorsQuerySchema = z.infer<
  typeof getCourseInternshipIndicatorsQuerySchema
>;

@Controller('/course-internship-indicators/:courseId')
export class GetCourseInternshipIndicatorsController {
  constructor(
    private getCourseInternshipIndicators: GetCourseInternshipIndicatorsUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(getCourseInternshipIndicatorsQuerySchema))
    query?: GetCourseInternshipIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseInternshipIndicators.execute({
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

    return CourseInternshipIndicatorsPresenter.toHTTP(result.value);
  }
}
