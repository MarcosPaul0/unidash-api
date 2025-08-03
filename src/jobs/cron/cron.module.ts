import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@/infra/database/database.module';
import { NotificationSenderModule } from '@/infra/notification/notification.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, NotificationSenderModule],
  providers: [],
})
export class CronModule {}
