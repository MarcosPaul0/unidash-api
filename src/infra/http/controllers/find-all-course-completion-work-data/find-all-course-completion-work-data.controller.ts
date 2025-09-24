import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/find-all-course-completion-work-data/find-all-course-completion-work-data';
import { CourseCompletionWorkDataPresenter } from '../../presenters/course-completion-work-data-presenter';

const findAllCourseCompletionWorkDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseCompletionWorkDataQuerySchema = z.infer<
  typeof findAllCourseCompletionWorkDataQuerySchema
>;

@Controller('/course-completion-work-data/:courseId')
export class FindAllCourseCompletionWorkDataController {
  constructor(
    private findAllCourseCompletionWorkData: FindAllCourseCompletionWorkDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseCompletionWorkDataQuerySchema))
    query?: FindAllCourseCompletionWorkDataQuerySchema,
  ) {
    const result = await this.findAllCourseCompletionWorkData.execute({
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
      courseCompletionWorkData: result.value.courseCompletionWorkData.map(
        CourseCompletionWorkDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
