import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-extension-activities-data/find-all-course-extension-activities-data';
import { CourseExtensionActivitiesDataPresenter } from '../../presenters/course-extension-activities-data-presenter';

const findAllCourseExtensionActivitiesDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseExtensionActivitiesDataQuerySchema = z.infer<
  typeof findAllCourseExtensionActivitiesDataQuerySchema
>;

@Controller('/course-extension-activities-data/:courseId')
export class FindAllCourseExtensionActivitiesDataController {
  constructor(
    private findAllCourseExtensionActivitiesData: FindAllCourseExtensionActivitiesDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(findAllCourseExtensionActivitiesDataQuerySchema),
    )
    query?: FindAllCourseExtensionActivitiesDataQuerySchema,
  ) {
    const result = await this.findAllCourseExtensionActivitiesData.execute({
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
      courseExtensionActivitiesData:
        result.value.courseExtensionActivitiesData.map(
          CourseExtensionActivitiesDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
