import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { TeacherResearchAndExtensionProjectsDataPresenter } from '../../presenters/teacher-research-and-extension-projects-data-presenters';
import { FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase } from '@/domain/application/use-cases/find-all-teacher-research-and-extension-projects-data-for-teacher/find-all-teacher-research-and-extension-projects-data-for-teacher';

const findAllTeacherResearchAndExtensionProjectsDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllTeacherResearchAndExtensionProjectsDataQuerySchema = z.infer<
  typeof findAllTeacherResearchAndExtensionProjectsDataQuerySchema
>;

@Controller('/teacher-research-and-extension-projects-data-for-teacher')
export class FindAllTeacherResearchAndExtensionProjectsDataForTeacherController {
  constructor(
    private findAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase: FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Query(
      new ZodValidationPipe(
        findAllTeacherResearchAndExtensionProjectsDataQuerySchema,
      ),
    )
    query?: FindAllTeacherResearchAndExtensionProjectsDataQuerySchema,
  ) {
    const result =
      await this.findAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase.execute(
        {
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
      return {
        teacherResearchAndExtensionProjectsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherResearchAndExtensionProjectsData:
        result.value.teacherResearchAndExtensionProjectsData.map(
          TeacherResearchAndExtensionProjectsDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
