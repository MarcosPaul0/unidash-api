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
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/find-all-course-active-students-data/find-all-course-active-students-data';
import { CourseActiveStudentsDataPresenter } from '../../presenters/course-active-students-data-presenter';

const findAllCourseActiveStudentsDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseActiveStudentsDataQuerySchema = z.infer<
  typeof findAllCourseActiveStudentsDataQuerySchema
>;

@Controller('/course-active-students-data/:courseId')
export class FindAllCourseActiveStudentsDataController {
  constructor(
    private findAllCourseActiveStudentsData: FindAllCourseActiveStudentsDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseActiveStudentsDataQuerySchema))
    query?: FindAllCourseActiveStudentsDataQuerySchema,
  ) {
    const result = await this.findAllCourseActiveStudentsData.execute({
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
      courseActiveStudentsData: result.value.courseActiveStudentsData.map(
        CourseActiveStudentsDataPresenter.toListHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
