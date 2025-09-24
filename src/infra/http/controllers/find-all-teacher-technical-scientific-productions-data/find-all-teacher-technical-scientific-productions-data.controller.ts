import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllTeacherTechnicalScientificProductionsDataUseCase } from '@/domain/application/use-cases/find-all-teacher-technical-scientific-productions-data/find-all-teacher-technical-scientific-productions-data';
import { TeacherTechnicalScientificProductionsDataPresenter } from '../../presenters/teacher-technical-scientific-productions-data-presenters';

const findAllTeacherTechnicalScientificProductionsDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllTeacherTechnicalScientificProductionsDataQuerySchema = z.infer<
  typeof findAllTeacherTechnicalScientificProductionsDataQuerySchema
>;

@Controller('/teacher-technical-scientific-productions-data/:courseId')
export class FindAllTeacherTechnicalScientificProductionsDataController {
  constructor(
    private findAllTeacherTechnicalScientificProductionsData: FindAllTeacherTechnicalScientificProductionsDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(
      new ZodValidationPipe(
        findAllTeacherTechnicalScientificProductionsDataQuerySchema,
      ),
    )
    query?: FindAllTeacherTechnicalScientificProductionsDataQuerySchema,
  ) {
    const result =
      await this.findAllTeacherTechnicalScientificProductionsData.execute({
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
      return {
        teacherTechnicalScientificProductionsData: [],
        totalItems: 0,
        totalPages: 0,
      };
    }

    return {
      teacherTechnicalScientificProductionsData:
        result.value.teacherTechnicalScientificProductionsData.map(
          TeacherTechnicalScientificProductionsDataPresenter.toHTTP,
        ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
