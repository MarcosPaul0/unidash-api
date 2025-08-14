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
import { FindAllCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/find-all-course-registration-lock-data/find-all-course-registration-lock-data';
import { CourseRegistrationLockDataPresenter } from '../../presenters/course-registration-lock-data-presenter';

const findAllCourseRegistrationLockDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

const findAllCourseRegistrationLockDataFiltersSchema = z
  .object({
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseRegistrationLockDataQuerySchema = z.infer<
  typeof findAllCourseRegistrationLockDataQuerySchema
>;

type FindAllCourseRegistrationLockDataFiltersSchema = z.infer<
  typeof findAllCourseRegistrationLockDataFiltersSchema
>;

@Controller('/course-registration-lock-data')
@UsePipes(new ZodValidationPipe(findAllCourseRegistrationLockDataFiltersSchema))
export class FindAllCourseRegistrationLockDataController {
  constructor(
    private findAllCourseRegistrationLockData: FindAllCourseRegistrationLockDataUseCase,
  ) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(findAllCourseRegistrationLockDataQuerySchema))
    query?: FindAllCourseRegistrationLockDataQuerySchema,
    @Body() body?: FindAllCourseRegistrationLockDataFiltersSchema,
  ) {
    const result = await this.findAllCourseRegistrationLockData.execute({
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
      students: result.value.courseRegistrationLockData.map(
        CourseRegistrationLockDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
