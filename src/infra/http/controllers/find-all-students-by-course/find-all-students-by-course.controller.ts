import {
  BadRequestException,
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
import { FindAllStudentsByCourseUseCase } from '@/domain/application/use-cases/find-all-students/find-all-students-by-course';
import { StudentPresenter } from '../../presenters/student-presenter';
import { SessionUser } from '@/domain/entities/user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';

const findAllStudentsByCourseQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

type FindAllStudentsQuerySchema = z.infer<
  typeof findAllStudentsByCourseQuerySchema
>;

@Controller('/students/by-course/:courseId')
export class FindAllStudentsByCourseController {
  constructor(
    private findAllStudentsByCourseUseCase: FindAllStudentsByCourseUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('courseId') courseId: string,
    @CurrentUser() sessionUser: SessionUser,
    @Query(new ZodValidationPipe(findAllStudentsByCourseQuerySchema))
    query?: FindAllStudentsQuerySchema,
  ) {
    const result = await this.findAllStudentsByCourseUseCase.execute({
      courseId,
      pagination: {
        page: query?.page ?? 1,
        itemsPerPage: query?.itemsPerPage ?? 12,
      },
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      students: result.value.students.map(StudentPresenter.toHTTP),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
