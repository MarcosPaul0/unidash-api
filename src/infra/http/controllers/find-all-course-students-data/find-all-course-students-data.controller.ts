import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { FindAllCourseStudentsDataUseCase } from '@/domain/application/use-cases/find-all-course-students-data/find-all-course-students-data';
import { CourseStudentsDataPresenter } from '../../presenters/course-students-data-presenter';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';

const findAllCourseStudentsDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseStudentsDataQuerySchema = z.infer<
  typeof findAllCourseStudentsDataQuerySchema
>;

@Controller('/course-students-data/:courseId')
@UsePipes()
export class FindAllCourseStudentsDataController {
  constructor(
    private findAllCourseStudentsData: FindAllCourseStudentsDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseStudentsDataQuerySchema))
    query?: FindAllCourseStudentsDataQuerySchema,
  ) {
    const result = await this.findAllCourseStudentsData.execute({
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
      courseStudentsData: result.value.courseStudentsData.map(
        CourseStudentsDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
