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
import { SessionUser } from '@/domain/entities/user';
import { FindAllTeachersUseCase } from '@/domain/application/use-cases/find-all-teachers/find-all-teachers';
import { TeacherPresenter } from '../../presenters/teacher-presenter';

const findAllTeachersQuerySchema = z
  .object({
    page: z.coerce.number().optional(),
    itemsPerPage: z.coerce.number().optional(),
    isActive: z.coerce.boolean().optional(),
    name: z.coerce.string().min(2).max(200).optional(),
  })
  .optional();

type FindAllTeachersQuerySchema = z.infer<typeof findAllTeachersQuerySchema>;

@Controller('/teachers')
export class FindAllTeachersController {
  constructor(private findAllTeachersUseCase: FindAllTeachersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Query(new ZodValidationPipe(findAllTeachersQuerySchema))
    query?: FindAllTeachersQuerySchema,
  ) {
    const result = await this.findAllTeachersUseCase.execute({
      pagination: {
        page: query?.page ?? 1,
        itemsPerPage: query?.itemsPerPage ?? 15,
      },
      filters: {
        isActive: query?.isActive,
        name: query?.name,
      },
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
