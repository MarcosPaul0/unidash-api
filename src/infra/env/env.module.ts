import { Global, Module } from '@nestjs/common'
import { EnvService } from './env.service'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  providers: [EnvService, ConfigService],
  exports: [EnvService],
})
export class EnvModule {}
