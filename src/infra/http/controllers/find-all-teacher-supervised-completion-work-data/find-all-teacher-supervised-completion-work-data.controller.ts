import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/find-all-teacher-supervised-completion-work-data/find-all-teacher-supervised-completion-work-data';
import { TeacherSupervisedCompletionWorkDataPresenter } from '../../presenters/teacher-supervised-completion-work-data-presenters';

const findAllTeacherSupervisedCompletionWorkDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllTeacherSupervisedCompletionWorkDataQuerySchema = z.infer<
  typeof findAllTeacherSupervisedCompletionWorkDataQuerySchema
>;

@Controller('/teacher-supervised-completion-work-data/:courseId')
export class FindAllTeacherSupervisedCompletionWorkDataController {
  constructor(
    private findAllTeacherSupervisedCompletionWorkData: FindAllTeacherSupervisedCompletionWorkDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(
        findAllTeacherSupervisedCompletionWorkDataQuerySchema,
      ),
    )
    query?: FindAllTeacherSupervisedCompletionWorkDataQuerySchema,
  ) {
    const result =
      await this.findAllTeacherSupervisedCompletionWorkData.execute({
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
      teacherSupervisedCompletionWorkData:
        result.value.teacherSupervisedCompletionWorkData.map(
          TeacherSupervisedCompletionWorkDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
