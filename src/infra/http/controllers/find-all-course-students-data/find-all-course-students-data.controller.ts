import {
  Body,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { SEMESTER } from '@/domain/entities/course-data';
import { FindAllCourseStudentsDataUseCase } from '@/domain/application/use-cases/find-all-course-students-data/find-all-course-students-data';
import { CourseStudentsDataPresenter } from '../../presenters/course-students-data-presenter';

const findAllCourseStudentsDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

const findAllCourseStudentsDataFiltersSchema = z
  .object({
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseStudentsDataQuerySchema = z.infer<
  typeof findAllCourseStudentsDataQuerySchema
>;

type FindAllCourseStudentsDataFiltersSchema = z.infer<
  typeof findAllCourseStudentsDataFiltersSchema
>;

@Controller('/course-students-data')
@UsePipes(new ZodValidationPipe(findAllCourseStudentsDataFiltersSchema))
export class FindAllCourseStudentsDataController {
  constructor(
    private findAllCourseStudentsData: FindAllCourseStudentsDataUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(findAllCourseStudentsDataQuerySchema))
    query?: FindAllCourseStudentsDataQuerySchema,
    @Body() body?: FindAllCourseStudentsDataFiltersSchema,
  ) {
    const result = await this.findAllCourseStudentsData.execute({
      pagination:
        query?.itemsPerPage && query?.page
          ? { itemsPerPage: query.itemsPerPage, page: query.page }
          : undefined,
      filters: body,
    });

    if (result.isLeft()) {
      return;
    }

    return {
      students: result.value.courseStudentsData.map(
        CourseStudentsDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
