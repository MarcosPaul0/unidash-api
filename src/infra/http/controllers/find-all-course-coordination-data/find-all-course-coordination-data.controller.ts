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
import { FindAllCourseCoordinationDataUseCase } from '@/domain/application/use-cases/find-all-course-coordination-data/find-all-course-coordination-data';
import { CourseCoordinationDataPresenter } from '../../presenters/course-coordination-data-presenter';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const findAllCourseCoordinationDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.int().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseCoordinationDataQuerySchema = z.infer<
  typeof findAllCourseCoordinationDataQuerySchema
>;

@Controller('/course-coordination-data/:courseId')
export class FindAllCourseCoordinationDataController {
  constructor(
    private findAllCourseCoordinationData: FindAllCourseCoordinationDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseCoordinationDataQuerySchema))
    query?: FindAllCourseCoordinationDataQuerySchema,
  ) {
    const result = await this.findAllCourseCoordinationData.execute({
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
      courseCoordinationData: result.value.courseCoordinationData.map(
        CourseCoordinationDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
