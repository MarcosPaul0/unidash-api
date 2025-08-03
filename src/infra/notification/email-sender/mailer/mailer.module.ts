import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailerEmailSender } from './mailer-email-sender';
import { join } from 'path';
import { EmailSender } from '../email-sender';
import { EnvService } from '../../../env/env.service';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [EnvService],
      useFactory(env: EnvService) {
        return {
          transport: {
            host: env.get('SMTP_HOST'),
            port: env.get('SMTP_PORT'),
            secure: false,
            auth: {
              user: env.get('SMTP_USER'),
              pass: env.get('SMTP_PASS'),
            },
          },
          defaults: {
            from: `"Unidash" <${env.get('SMTP_FROM')}`,
          },
          template: {
            dir: join(process.cwd(), 'common', 'mail', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: EmailSender,
      useClass: MailerEmailSender,
    },
  ],
  exports: [EmailSender],
})
export class MailerModule {}
