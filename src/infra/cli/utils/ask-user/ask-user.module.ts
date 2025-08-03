import { Module } from '@nestjs/common'
import { AskUserService } from './ask-user'

@Module({
  providers: [AskUserService],
  exports: [AskUserService],
})
export class AskUserModule {}
