import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/find-all-teacher-supervised-completion-work-data/find-all-teacher-supervised-completion-work-data';
import { TeacherSupervisedCompletionWorkDataPresenter } from '../../presenters/teacher-supervised-completion-work-data-presenters';
import { FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase } from '@/domain/application/use-cases/find-all-teacher-supervised-completion-work-data-for-teacher/find-all-teacher-supervised-completion-work-data-for-teacher';

const findAllTeacherSupervisedCompletionWorkDataForTeacherQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllTeacherSupervisedCompletionWorkDataForTeacherQuerySchema = z.infer<
  typeof findAllTeacherSupervisedCompletionWorkDataForTeacherQuerySchema
>;

@Controller('/teacher-supervised-completion-work-data/for-teacher/:courseId')
export class FindAllTeacherSupervisedCompletionWorkDataForTeacherController {
  constructor(
    private findAllTeacherSupervisedCompletionWorkDataForTeacherUseCase: FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(
        findAllTeacherSupervisedCompletionWorkDataForTeacherQuerySchema,
      ),
    )
    query?: FindAllTeacherSupervisedCompletionWorkDataForTeacherQuerySchema,
  ) {
    const result =
      await this.findAllTeacherSupervisedCompletionWorkDataForTeacherUseCase.execute(
        {
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
        },
      );

    if (result.isLeft()) {
      return;
    }

    console.log(result);

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
