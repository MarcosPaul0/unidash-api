import { Injectable, Logger } from '@nestjs/common';
import { EnvService } from '../../../env/env.service';

import { readFileSync } from 'fs';
import { join } from 'path';

import Handlebars from 'handlebars';
import { EmailSender } from '../email-sender';
import { MailerService } from '@nestjs-modules/mailer';
import {
  SendAccountActivationNotificationParams,
  SendPasswordResetNotificationParams,
} from '@/domain/application/notification-sender/notification-sender';

interface SendMailParams {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

@Injectable()
export class MailerEmailSender implements EmailSender {
  constructor(
    private mailerService: MailerService,
    private envService: EnvService,
  ) {}

  async sendAccountActivationEmail({
    user,
    activationToken,
  }: SendAccountActivationNotificationParams): Promise<void> {
    const url = `${this.envService.get('ACCOUNT_ACTIVATION_URL')}/${activationToken}`;

    this.sendMail({
      to: user.email,
      subject: 'Ativação de conta',
      template: './confirmation',
      context: {
        name: user.name,
        role: user.role === 'student' ? 'Discente' : 'Docente',
        url,
      },
    });
  }

  async sendPasswordResetEmail({
    passwordResetToken,
    user,
  }: SendPasswordResetNotificationParams): Promise<void> {
    const url = `${this.envService.get('PASSWORD_RESET_URL')}/${passwordResetToken}`;

    this.sendMail({
      to: user.email,
      subject: 'Redefinição de senha',
      template: './forgot-password',
      context: {
        name: user.name,
        url,
      },
    });
  }

  private async sendMail({ to, subject, template, context }: SendMailParams) {
    const templatePath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'common',
      'mail',
      'templates',
      `${template}.hbs`,
    );

    const templateString = readFileSync(templatePath, 'utf8');

    const templateCompiled = Handlebars.compile(templateString);
    const outputString = templateCompiled(context);

    try {
      await this.mailerService.sendMail({
        from: {
          address: this.envService.get('SMTP_FROM'),
          name: 'Unidash',
        },
        to: [
          {
            address: to,
            name: 'Unidash',
          },
        ],
        subject,
        html: outputString,
      });
    } catch (error) {
      Logger.error(`Error sending email: ${JSON.stringify(error, null, 2)}`);
    }
  }
}
