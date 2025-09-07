import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { GetCourseCompletionWorkIndicatorsUseCase } from '@/domain/application/use-cases/get-course-completion-work-indicators/get-course-completion-work-indicators';
import { CourseCompletionWorkIndicatorsPresenter } from '../../presenters/course-completion-work-indicators-presenter';

const getCourseCompletionWorkIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseCompletionWorkIndicatorsQuerySchema = z.infer<
  typeof getCourseCompletionWorkIndicatorsQuerySchema
>;

@Controller('/course-completion-work-indicators/:courseId')
export class GetCourseCompletionWorkIndicatorsController {
  constructor(
    private getCourseCompletionWorkIndicators: GetCourseCompletionWorkIndicatorsUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(getCourseCompletionWorkIndicatorsQuerySchema))
    query?: GetCourseCompletionWorkIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseCompletionWorkIndicators.execute({
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

    return CourseCompletionWorkIndicatorsPresenter.toHTTP(result.value);
  }
}
