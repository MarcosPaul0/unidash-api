import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { GetCourseStudentIncomingIndicatorsUseCase } from '@/domain/application/use-cases/get-course-student-incoming-indicators/get-course-student-incoming-indicators';
import { CourseStudentIncomingIndicatorsPresenter } from '../../presenters/course-student-incoming-indicators-presenter';

const getCourseStudentIncomingIndicatorsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearFrom: z.int().max(new Date().getFullYear()).min(0).optional(),
    yearTo: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type GetCourseStudentIncomingIndicatorsQuerySchema = z.infer<
  typeof getCourseStudentIncomingIndicatorsQuerySchema
>;

@Controller('/course-student-incoming-indicators/:courseId')
export class GetCourseStudentIncomingIndicatorsController {
  constructor(
    private getCourseStudentIncomingIndicators: GetCourseStudentIncomingIndicatorsUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(getCourseStudentIncomingIndicatorsQuerySchema))
    query?: GetCourseStudentIncomingIndicatorsQuerySchema,
  ) {
    const result = await this.getCourseStudentIncomingIndicators.execute({
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

    return CourseStudentIncomingIndicatorsPresenter.toHTTP(result.value);
  }
}
