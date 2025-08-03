import { Controller, Get, HttpCode } from '@nestjs/common';
import { FindAllStatesUseCase } from '@/domain/application/use-cases/find-all-states/find-all-states';
import { StatePresenter } from '../../presenters/state-presenter';
import { Public } from '@/infra/auth/public';

@Controller('/states')
export class FindAllStatesController {
  constructor(private findAllStatesUseCase: FindAllStatesUseCase) {}

  @Get()
  @Public()
  @HttpCode(200)
  async handle() {
    const result = await this.findAllStatesUseCase.execute();

    if (result.isLeft()) {
      return [];
    }

    return {
      states: result.value.state.map(StatePresenter.toHTTP),
    };
  }
}
