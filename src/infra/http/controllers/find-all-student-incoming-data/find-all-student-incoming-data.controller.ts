import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllStudentIncomingDataUseCase } from '@/domain/application/use-cases/find-all-student-incoming-data/find-all-student-incoming-data';
import { StudentIncomingDataPresenter } from '../../presenters/student-incoming-data-presenter';

const findAllStudentIncomingDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllStudentIncomingDataQuerySchema = z.infer<
  typeof findAllStudentIncomingDataQuerySchema
>;

@Controller('/student-incoming-data/:courseId')
export class FindAllStudentIncomingDataController {
  constructor(
    private findAllStudentIncomingData: FindAllStudentIncomingDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllStudentIncomingDataQuerySchema))
    query?: FindAllStudentIncomingDataQuerySchema,
  ) {
    const result = await this.findAllStudentIncomingData.execute({
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
      studentIncomingData: result.value.studentIncomingData.map(
        StudentIncomingDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
