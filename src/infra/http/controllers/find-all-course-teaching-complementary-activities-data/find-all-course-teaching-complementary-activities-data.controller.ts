import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-teaching-complementary-activities-data/find-all-course-teaching-complementary-activities-data';
import { CourseTeachingComplementaryActivitiesDataPresenter } from '../../presenters/course-teaching-complementary-activities-data-presenter';

const findAllCourseTeachingComplementaryActivitiesDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseTeachingComplementaryActivitiesDataQuerySchema = z.infer<
  typeof findAllCourseTeachingComplementaryActivitiesDataQuerySchema
>;

@Controller('/course-teaching-complementary-activities-data/:courseId')
export class FindAllCourseTeachingComplementaryActivitiesDataController {
  constructor(
    private findAllCourseTeachingComplementaryActivitiesData: FindAllCourseTeachingComplementaryActivitiesDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(
        findAllCourseTeachingComplementaryActivitiesDataQuerySchema,
      ),
    )
    query?: FindAllCourseTeachingComplementaryActivitiesDataQuerySchema,
  ) {
    const result =
      await this.findAllCourseTeachingComplementaryActivitiesData.execute({
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
      courseTeachingComplementaryActivitiesData:
        result.value.courseTeachingComplementaryActivitiesData.map(
          CourseTeachingComplementaryActivitiesDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
