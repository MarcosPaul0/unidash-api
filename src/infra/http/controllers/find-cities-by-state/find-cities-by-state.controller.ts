import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { FindCitiesByStateUseCase } from '@/domain/application/use-cases/find-cities-by-state/find-cities-by-state';
import { CityPresenter } from '../../presenters/city-presenter';
import { Public } from '@/infra/auth/public';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';

const findCitiesByStateParamSchema = z.string().uuid();

type FindCitiesByStateParamSchema = z.infer<
  typeof findCitiesByStateParamSchema
>;

@Controller('/cities/:stateId')
export class FindCitiesByStateController {
  constructor(private findCitiesByStateUseCase: FindCitiesByStateUseCase) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle(
    @Param('stateId', new ZodValidationPipe(findCitiesByStateParamSchema))
    stateId: FindCitiesByStateParamSchema,
  ) {
    const result = await this.findCitiesByStateUseCase.execute({ stateId });

    if (result.isLeft()) {
      return [];
    }

    return {
      cities: result.value.cities.map(CityPresenter.toHTTP),
    };
  }
}
