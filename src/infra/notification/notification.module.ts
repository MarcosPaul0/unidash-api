import { Module } from '@nestjs/common';
import { NotificationSenderImpl } from './notification-sender';
import { MailerModule } from './email-sender/mailer/mailer.module';
import { FakeNotificationSender } from 'test/notification-sender/fake-notification-sender';
import { NotificationSender } from '@/domain/application/notification-sender/notification-sender';

@Module({
  imports: [MailerModule],
  providers: [
    {
      provide: NotificationSender,
      useClass:
        process.env.NODE_ENV === 'test'
          ? FakeNotificationSender
          : NotificationSenderImpl,
    },
  ],
  exports: [NotificationSender],
})
export class NotificationSenderModule {}
