import { Module } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { TeacherCoursesRepository } from '@/domain/application/repositories/teacher-courses-repository';
import { PrismaTeacherCoursesRepository } from '../database/prisma/repositories/prisma-teacher-courses-repository';
import { AuthorizationService } from './authorization.service';

@Module({
  providers: [
    AuthorizationService,
    PrismaService,
    {
      provide: TeacherCoursesRepository,
      useClass: PrismaTeacherCoursesRepository,
    },
  ],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
