import { BadRequestException, Controller, Param, Patch } from '@nestjs/common';
import { AccountActivationUseCase } from '@/domain/application/use-cases/account-activation/account-activation';
import { Public } from '@/infra/auth/public';

@Controller('/account-activation/:activationToken')
@Public()
export class AccountActivationController {
  constructor(private accountActivationUseCase: AccountActivationUseCase) {}

  @Patch()
  async handle(@Param('activationToken') activationToken: string) {
    const result = await this.accountActivationUseCase.execute({
      activationToken,
    });

    if (result.isLeft()) {
      const error = result.value;
      throw new BadRequestException(error.message);
    }
  }
}
