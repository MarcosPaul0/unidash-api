import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersRepository } from '@/domain/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';
import { AccountActivationTokensRepository } from '@/domain/application/repositories/account-activation-tokens-repository';
import { PrismaAccountActivationTokensRepository } from './prisma/repositories/prisma-account-activation-tokens-repository';
import { PasswordResetTokensRepository } from '@/domain/application/repositories/password-reset-tokens-repository';
import { PrismaPasswordResetTokensRepository } from './prisma/repositories/prisma-password-reset-tokens-repository';
import { StudentsRepository } from '@/domain/application/repositories/students-repository';
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository';
import { TeachersRepository } from '@/domain/application/repositories/teacher-repository';
import { PrismaTeachersRepository } from './prisma/repositories/prisma-teachers-repository';
import { StatesRepository } from '@/domain/application/repositories/states-repository';
import { PrismaStatesRepository } from './prisma/repositories/prisma-states-repository';
import { CitiesRepository } from '@/domain/application/repositories/cities-repository';
import { PrismaCitiesRepository } from './prisma/repositories/prisma-cities-repository';
import { AdminsRepository } from '@/domain/application/repositories/admins-repository';
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository';
import { CoursesRepository } from '@/domain/application/repositories/courses-repository';
import { PrismaCoursesRepository } from './prisma/repositories/prisma-courses-repository';
import { CourseDepartureDataRepository } from '@/domain/application/repositories/course-departure-data-repository';
import { PrismaCourseDepartureDataRepository } from './prisma/repositories/prisma-course-departure-data-repository';
import { CourseStudentsDataRepository } from '@/domain/application/repositories/course-students-data-repository';
import { PrismaCourseStudentsDataRepository } from './prisma/repositories/prisma-course-students-data-repository';
import { PrismaCourseRegistrationLockDataRepository } from './prisma/repositories/prisma-course-registration-lock-data-repository';
import { CourseRegistrationLockDataRepository } from '@/domain/application/repositories/course-registration-lock-data-repository';
import { PrismaCourseCoordinationDataRepository } from './prisma/repositories/prisma-course-coordination-data-repository';
import { CourseCoordinationDataRepository } from '@/domain/application/repositories/course-coordination-data-repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: AccountActivationTokensRepository,
      useClass: PrismaAccountActivationTokensRepository,
    },
    {
      provide: PasswordResetTokensRepository,
      useClass: PrismaPasswordResetTokensRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: TeachersRepository,
      useClass: PrismaTeachersRepository,
    },
    {
      provide: StatesRepository,
      useClass: PrismaStatesRepository,
    },
    {
      provide: CitiesRepository,
      useClass: PrismaCitiesRepository,
    },
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: CoursesRepository,
      useClass: PrismaCoursesRepository,
    },
    {
      provide: CourseDepartureDataRepository,
      useClass: PrismaCourseDepartureDataRepository,
    },
    {
      provide: CourseCoordinationDataRepository,
      useClass: PrismaCourseCoordinationDataRepository,
    },
    {
      provide: CourseRegistrationLockDataRepository,
      useClass: PrismaCourseRegistrationLockDataRepository,
    },
    {
      provide: CourseStudentsDataRepository,
      useClass: PrismaCourseStudentsDataRepository,
    },
  ],
  exports: [
    PrismaService,
    UsersRepository,
    AccountActivationTokensRepository,
    PasswordResetTokensRepository,
    StudentsRepository,
    TeachersRepository,
    StatesRepository,
    CitiesRepository,
    AdminsRepository,
    CoursesRepository,
    CourseDepartureDataRepository,
    CourseCoordinationDataRepository,
    CourseRegistrationLockDataRepository,
    CourseStudentsDataRepository,
  ],
})
export class DatabaseModule {}
