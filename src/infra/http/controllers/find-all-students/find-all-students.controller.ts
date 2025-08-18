import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { z } from 'zod';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FindAllStudentsUseCase } from '@/domain/application/use-cases/find-all-students/find-all-students';
import { StudentPresenter } from '../../presenters/student-presenter';
import { SessionUser } from '@/domain/entities/user';

const findAllStudentsQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

type FindAllStudentsQuerySchema = z.infer<typeof findAllStudentsQuerySchema>;

@Controller('/students')
export class FindAllStudentsController {
  constructor(private findAllStudentsUseCase: FindAllStudentsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Query(new ZodValidationPipe(findAllStudentsQuerySchema))
    query?: FindAllStudentsQuerySchema,
  ) {
    const result = await this.findAllStudentsUseCase.execute({
      pagination: {
        page: query?.page ?? 1,
        itemsPerPage: query?.itemsPerPage ?? 15,
      },
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      throw new ForbiddenException(error.message);
    }

    return {
      students: result.value.students.map(StudentPresenter.toHTTP),
      totalItems: result.value.totalItems,
      totalPages: result.value.totalPages,
    };
  }
}
