import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { CityPresenter } from '../../presenters/city-presenter';
import { Public } from '@/infra/auth/public';
import { FindAllCitiesUseCase } from '@/domain/application/use-cases/find-all-cities/find-all-cities';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const findAllCitiesQuerySchema = z
  .object({
    name: z.string().optional(),
  })
  .optional();

type FindAllCitiesQuerySchema = z.infer<typeof findAllCitiesQuerySchema>;

@Controller('/cities')
export class FindAllCitiesController {
  constructor(private findAllCitiesUseCase: FindAllCitiesUseCase) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Query(new ZodValidationPipe(findAllCitiesQuerySchema))
    query?: FindAllCitiesQuerySchema,
  ) {
    const result = await this.findAllCitiesUseCase.execute({
      filters: {
        name: query?.name,
      },
    });

    if (result.isLeft()) {
      return [];
    }

    return {
      cities: result.value.cities.map(CityPresenter.toHTTP),
    };
  }
}
