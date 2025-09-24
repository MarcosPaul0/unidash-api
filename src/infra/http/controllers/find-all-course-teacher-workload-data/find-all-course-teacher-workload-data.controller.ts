import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/find-all-course-teacher-workload-data/find-all-course-teacher-workload-data';
import { CourseTeacherWorkloadDataPresenter } from '../../presenters/course-teacher-workload-data-presenter';

const findAllCourseTeacherWorkloadDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseTeacherWorkloadDataQuerySchema = z.infer<
  typeof findAllCourseTeacherWorkloadDataQuerySchema
>;

@Controller('/course-teacher-workload-data/:courseId')
export class FindAllCourseTeacherWorkloadDataController {
  constructor(
    private findAllCourseTeacherWorkloadData: FindAllCourseTeacherWorkloadDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseTeacherWorkloadDataQuerySchema))
    query?: FindAllCourseTeacherWorkloadDataQuerySchema,
  ) {
    const result = await this.findAllCourseTeacherWorkloadData.execute({
      courseId,
      pagination:
        query?.itemsPerPage && query?.page
          ? { itemsPerPage: query.itemsPerPage, page: query.page }
          : undefined,
      filters: {
        semester: query?.semester,
        year: query?.year,
      },
      sessionUser,
    });

    if (result.isLeft()) {
      return;
    }

    return {
      courseTeacherWorkloadData: result.value.courseTeacherWorkloadData.map(
        CourseTeacherWorkloadDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
