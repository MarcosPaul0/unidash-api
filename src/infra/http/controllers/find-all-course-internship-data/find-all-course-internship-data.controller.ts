import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseInternshipDataUseCase } from '@/domain/application/use-cases/find-all-course-internship-data/find-all-course-internship-data';
import { CourseInternshipDataPresenter } from '../../presenters/course-internship-data-presenter';

const findAllCourseInternshipDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseInternshipDataQuerySchema = z.infer<
  typeof findAllCourseInternshipDataQuerySchema
>;

@Controller('/course-internship-data/:courseId')
export class FindAllCourseInternshipDataController {
  constructor(
    private findAllCourseInternshipData: FindAllCourseInternshipDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseInternshipDataQuerySchema))
    query?: FindAllCourseInternshipDataQuerySchema,
  ) {
    const result = await this.findAllCourseInternshipData.execute({
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
      courseInternshipData: result.value.courseInternshipData.map(
        CourseInternshipDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
