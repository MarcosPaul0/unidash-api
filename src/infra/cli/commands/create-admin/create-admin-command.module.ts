import { Module } from '@nestjs/common';
import { Hasher } from '@/domain/application/cryptography/hasher';
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher';
import { DatabaseModule } from '@/infra/database/database.module';
import { RegisterAdminUseCase } from '@/domain/application/use-cases/register-admin/register-admin';
import { CreateAdminCommand } from './create-admin.command';
import { AskUserModule } from '../../utils/ask-user/ask-user.module';

@Module({
  imports: [AskUserModule, DatabaseModule],
  providers: [
    CreateAdminCommand,
    RegisterAdminUseCase,
    { provide: Hasher, useClass: BcryptHasher },
  ],
})
export class CreateAdminCommandModule {}
