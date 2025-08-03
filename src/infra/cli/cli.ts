import { NestFactory } from '@nestjs/core'
import { CommandModule, CommandService } from 'nestjs-command'
import { CliModule } from './cli.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: ['error'],
  })

  await app.select(CommandModule).get(CommandService).exec()
  await app.close()
}

bootstrap()
