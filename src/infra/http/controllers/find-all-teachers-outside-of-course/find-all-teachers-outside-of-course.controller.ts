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
import { FindAllTeachersOutsideOfCourseUseCase } from '@/domain/application/use-cases/find-all-teachers-outside-of-course/find-all-teachers-outside-of-course';
import { TeacherPresenter } from '../../presenters/teacher-presenter';

const findAllTeachersOutsideOfCourseQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  itemsPerPage: z.string().optional().transform(Number),
  name: z.string().max(200).optional(),
  email: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
});

type FindAllTeachersOutsideOfCourseQuerySchema = z.infer<
  typeof findAllTeachersOutsideOfCourseQuerySchema
>;

@Controller('/teachers/outside-of-course/:courseId')
export class FindAllTeachersOutsideOfCourseController {
  constructor(
    private findAllTeachersOutsideOfCourseUseCase: FindAllTeachersOutsideOfCourseUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseId') courseId: string,
    @Query(new ZodValidationPipe(findAllTeachersOutsideOfCourseQuerySchema))
    query?: FindAllTeachersOutsideOfCourseQuerySchema,
  ) {
    const pagination =
      Boolean(query?.page) && Boolean(query?.itemsPerPage)
        ? {
            page: query?.page ?? 1,
            itemsPerPage: query?.itemsPerPage ?? 15,
          }
        : undefined;

    const result = await this.findAllTeachersOutsideOfCourseUseCase.execute({
      pagination,
      filters: {
        name: query?.name,
        email: query?.email,
        isActive: query?.isActive,
      },
      courseId,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new ForbiddenException(error.message);
    }

    return {
      teachers: result.value.teachers.map(TeacherPresenter.toHTTP),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
