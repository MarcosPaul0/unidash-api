import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { GetCourseTeachersProductionsIndicatorsUseCase } from '@/domain/application/use-cases/get-course-teachers-productions-indicators/get-course-teachers-productions-indicators';
import { CourseTeachersProductionsIndicatorsPresenter } from '../../presenters/course-teachers-productions-indicators-presenter';

const getCourseTeachersProductionsIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseTeachersProductionsIndicatorsQuerySchema = z.infer<
  typeof getCourseTeachersProductionsIndicatorsQuerySchema
>;

@Controller('/course-teachers-productions-indicators/:courseId')
export class GetCourseTeachersProductionsIndicatorsController {
  constructor(
    private getCourseTeachersProductionsIndicators: GetCourseTeachersProductionsIndicatorsUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(getCourseTeachersProductionsIndicatorsQuerySchema),
    )
    query?: GetCourseTeachersProductionsIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseTeachersProductionsIndicators.execute({
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

    return CourseTeachersProductionsIndicatorsPresenter.toHTTP(result.value);
  }
}
