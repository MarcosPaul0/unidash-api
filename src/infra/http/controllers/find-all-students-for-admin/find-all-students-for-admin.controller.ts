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
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { FindAllStudentsForAdminUseCase } from '@/domain/application/use-cases/find-all-students-for-admin/find-all-students-for-admin';
import { StudentPresenter } from '../../presenters/student-presenter';

const findAllStudentsForAdminQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
  })
  .optional();

type FindAllStudentsForAdminQuerySchema = z.infer<
  typeof findAllStudentsForAdminQuerySchema
>;

@Controller('/students/for-admin')
export class FindAllStudentsForAdminController {
  constructor(
    private findAllStudentsForAdminUseCase: FindAllStudentsForAdminUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() { userRole }: UserPayload,
    @Query(new ZodValidationPipe(findAllStudentsForAdminQuerySchema))
    query?: FindAllStudentsForAdminQuerySchema,
  ) {
    const result = await this.findAllStudentsForAdminUseCase.execute({
      pagination: {
        page: query?.page ?? 1,
        itemsPerPage: query?.itemsPerPage ?? 15,
      },
      userRole,
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
