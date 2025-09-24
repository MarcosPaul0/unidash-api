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
import { FindAllCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/find-all-course-registration-lock-data/find-all-course-registration-lock-data';
import { CourseRegistrationLockDataPresenter } from '../../presenters/course-registration-lock-data-presenter';
import { SessionUser } from '@/domain/entities/user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';

const findAllCourseRegistrationLockDataQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    semester: z.enum(SEMESTER).optional(),
    year: z.coerce.number().max(new Date().getFullYear()).min(0).optional(),
  })
  .optional();

type FindAllCourseRegistrationLockDataQuerySchema = z.infer<
  typeof findAllCourseRegistrationLockDataQuerySchema
>;

@Controller('/course-registration-lock-data/:courseId')
@UsePipes()
export class FindAllCourseRegistrationLockDataController {
  constructor(
    private findAllCourseRegistrationLockData: FindAllCourseRegistrationLockDataUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllCourseRegistrationLockDataQuerySchema))
    query?: FindAllCourseRegistrationLockDataQuerySchema,
  ) {
    const result = await this.findAllCourseRegistrationLockData.execute({
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
      courseRegistrationLockData: result.value.courseRegistrationLockData.map(
        CourseRegistrationLockDataPresenter.toHTTP,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
