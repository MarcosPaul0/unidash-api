import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-search-complementary-activities-data/find-all-course-search-complementary-activities-data';
import { CourseSearchComplementaryActivitiesDataPresenter } from '../../presenters/course-search-complementary-activities-data-presenter';

const findAllCourseSearchComplementaryActivitiesDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseSearchComplementaryActivitiesDataQuerySchema = z.infer<
  typeof findAllCourseSearchComplementaryActivitiesDataQuerySchema
>;

@Controller('/course-search-complementary-activities-data/:courseId')
export class FindAllCourseSearchComplementaryActivitiesDataController {
  constructor(
    private findAllCourseSearchComplementaryActivitiesData: FindAllCourseSearchComplementaryActivitiesDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(
        findAllCourseSearchComplementaryActivitiesDataQuerySchema,
      ),
    )
    query?: FindAllCourseSearchComplementaryActivitiesDataQuerySchema,
  ) {
    const result =
      await this.findAllCourseSearchComplementaryActivitiesData.execute({
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
      courseSearchComplementaryActivitiesData:
        result.value.courseSearchComplementaryActivitiesData.map(
          CourseSearchComplementaryActivitiesDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
