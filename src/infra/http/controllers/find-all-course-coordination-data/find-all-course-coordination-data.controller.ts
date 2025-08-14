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
import { FindAllCourseCoordinationDataUseCase } from '@/domain/application/use-cases/find-all-course-coordination-data/find-all-course-coordination-data';
import { CourseCoordinationDataPresenter } from '../../presenters/course-coordination-data-presenter';

const findAllCourseCoordinationDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

const findAllCourseCoordinationDataFiltersSchema = z
  .object({
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseCoordinationDataQuerySchema = z.infer<
  typeof findAllCourseCoordinationDataQuerySchema
>;

type FindAllCourseCoordinationDataFiltersSchema = z.infer<
  typeof findAllCourseCoordinationDataFiltersSchema
>;

@Controller('/course-coordination-data')
@UsePipes(new ZodValidationPipe(findAllCourseCoordinationDataFiltersSchema))
export class FindAllCourseCoordinationDataController {
  constructor(
    private findAllCourseCoordinationData: FindAllCourseCoordinationDataUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(findAllCourseCoordinationDataQuerySchema))
    query?: FindAllCourseCoordinationDataQuerySchema,
    @Body() body?: FindAllCourseCoordinationDataFiltersSchema,
  ) {
    const result = await this.findAllCourseCoordinationData.execute({
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
      students: result.value.courseCoordinationData.map(
        CourseCoordinationDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
