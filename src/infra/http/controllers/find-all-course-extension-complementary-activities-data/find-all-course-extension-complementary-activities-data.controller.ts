import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-extension-complementary-activities-data/find-all-course-extension-complementary-activities-data';
import { CourseExtensionComplementaryActivitiesDataPresenter } from '../../presenters/course-extension-complementary-activities-data-presenter';

const findAllCourseExtensionComplementaryActivitiesDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseExtensionComplementaryActivitiesDataQuerySchema = z.infer<
  typeof findAllCourseExtensionComplementaryActivitiesDataQuerySchema
>;

@Controller('/course-extension-complementary-activities-data/:courseId')
export class FindAllCourseExtensionComplementaryActivitiesDataController {
  constructor(
    private findAllCourseExtensionComplementaryActivitiesData: FindAllCourseExtensionComplementaryActivitiesDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(
        findAllCourseExtensionComplementaryActivitiesDataQuerySchema,
      ),
    )
    query?: FindAllCourseExtensionComplementaryActivitiesDataQuerySchema,
  ) {
    const result =
      await this.findAllCourseExtensionComplementaryActivitiesData.execute({
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
      courseExtensionComplementaryActivitiesData:
        result.value.courseExtensionComplementaryActivitiesData.map(
          CourseExtensionComplementaryActivitiesDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
