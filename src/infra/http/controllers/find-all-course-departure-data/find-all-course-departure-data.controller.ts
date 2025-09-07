import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { FindAllCourseDepartureDataUseCase } from '@/domain/application/use-cases/find-all-course-departure-data/find-all-course-departure-data';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { CourseDepartureDataPresenter } from '../../presenters/course-departure-data-presenter';
import { SEMESTER } from '@/domain/entities/course-data';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const findAllCourseDepartureDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseDepartureDataQuerySchema = z.infer<
  typeof findAllCourseDepartureDataQuerySchema
>;

@Controller('/course-departure-data/:courseId')
export class FindAllCourseDepartureDataController {
  constructor(
    private findAllCourseDepartureData: FindAllCourseDepartureDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseDepartureDataQuerySchema))
    query?: FindAllCourseDepartureDataQuerySchema,
  ) {
    const result = await this.findAllCourseDepartureData.execute({
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
      courseDepartureData: result.value.courseDepartureData.map(
        CourseDepartureDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
