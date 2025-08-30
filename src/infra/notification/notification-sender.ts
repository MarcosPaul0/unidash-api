import { Injectable } from '@nestjs/common';
import { EmailSender } from './email-sender/email-sender';
import {
  NotificationSender,
  SendAccountActivationNotificationParams,
  SendPasswordResetNotificationParams,
} from '@/domain/application/notification-sender/notification-sender';

@Injectable()
export class NotificationSenderImpl implements NotificationSender {
  constructor(private emailSender: EmailSender) {}

  async sendAccountActivationNotification({
    activationToken,
    user,
  }: SendAccountActivationNotificationParams): Promise<void> {
    this.emailSender.sendAccountActivationEmail({
      user,
      activationToken,
    });
  }

  async sendPasswordResetNotification({
    passwordResetToken,
    user,
  }: SendPasswordResetNotificationParams): Promise<void> {
    this.emailSender.sendPasswordResetEmail({
      user,
      passwordResetToken,
    });
  }
}
