import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';
import { FindAllTeachersByCourseUseCase } from '@/domain/application/use-cases/find-all-teachers-by-course/find-all-teachers-by-course';
import { TeacherCoursePresenter } from '../../presenters/teacher-course-presenter';

const findAllTeachersByCourseQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

type FindAllTeachersByCourseQuerySchema = z.infer<
  typeof findAllTeachersByCourseQuerySchema
>;

@Controller('/teacher-courses/by-course/:courseId')
export class FindAllTeachersByCourseController {
  constructor(
    private findAllTeachersByCourseUseCase: FindAllTeachersByCourseUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllTeachersByCourseQuerySchema))
    query?: FindAllTeachersByCourseQuerySchema,
  ) {
    const result = await this.findAllTeachersByCourseUseCase.execute({
      pagination:
        query?.itemsPerPage && query?.page
          ? { itemsPerPage: query.itemsPerPage, page: query.page }
          : undefined,
      courseId,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new ForbiddenException(error.message);
    }

    return {
      teacherCourses: result.value.teacherCourses.map(
        TeacherCoursePresenter.toHTTPWithTeacher,
      ),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
