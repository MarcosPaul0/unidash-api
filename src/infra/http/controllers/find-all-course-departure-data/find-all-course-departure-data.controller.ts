import {
  Body,
  Controller,
  Get,
  HttpCode,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { FindAllCourseDepartureDataUseCase } from '@/domain/application/use-cases/find-all-course-departure-data/find-all-course-departure-data';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CourseDepartureDataPresenter } from '../../presenters/course-departure-data-presenter';
import { SEMESTER } from '@/domain/entities/course-data';

const findAllCourseDepartureDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

const findAllCourseDepartureDataFiltersSchema = z
  .object({
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseDepartureDataQuerySchema = z.infer<
  typeof findAllCourseDepartureDataQuerySchema
>;

type FindAllCourseDepartureDataFiltersSchema = z.infer<
  typeof findAllCourseDepartureDataFiltersSchema
>;

@Controller('/course-departure-data')
@UsePipes(new ZodValidationPipe(findAllCourseDepartureDataFiltersSchema))
export class FindAllCourseDepartureDataController {
  constructor(
    private findAllCourseDepartureData: FindAllCourseDepartureDataUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(findAllCourseDepartureDataQuerySchema))
    query?: FindAllCourseDepartureDataQuerySchema,
    @Body() body?: FindAllCourseDepartureDataFiltersSchema,
  ) {
    const result = await this.findAllCourseDepartureData.execute({
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
      students: result.value.courseDepartureData.map(
        CourseDepartureDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
