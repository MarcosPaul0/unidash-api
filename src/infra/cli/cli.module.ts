import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { CreateAdminCommandModule } from './commands/create-admin/create-admin-command.module';

@Module({
  imports: [CommandModule, CreateAdminCommandModule],
})
export class CliModule {}
