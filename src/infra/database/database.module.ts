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
import { TeacherCoursesRepository } from '@/domain/application/repositories/teacher-courses-repository';
import { PrismaTeacherCoursesRepository } from './prisma/repositories/prisma-teacher-courses-repository';
import { PrismaTeacherSupervisedCompletionWorkDataRepository } from './prisma/repositories/prisma-teacher-supervised-completion-work-data-repository';
import { TeacherSupervisedCompletionWorkDataRepository } from '@/domain/application/repositories/teacher-supervised-completion-work-data-repository';
import { PrismaCourseCompletionWorkDataRepository } from './prisma/repositories/prisma-course-completion-work-data-repository';
import { CourseCompletionWorkDataRepository } from '@/domain/application/repositories/course-completion-work-data-repository';
import { CourseExtensionComplementaryActivitiesDataRepository } from '@/domain/application/repositories/course-extension-complementary-activities-data-repository';
import { PrismaCourseExtensionComplementaryActivitiesDataRepository } from './prisma/repositories/prisma-course-extension-complementary-activities-data-repository';
import { CourseSearchComplementaryActivitiesDataRepository } from '@/domain/application/repositories/course-search-complementary-activities-data-repository';
import { PrismaCourseSearchComplementaryActivitiesDataRepository } from './prisma/repositories/prisma-course-search-complementary-activities-data-repository';
import { CourseTeachingComplementaryActivitiesDataRepository } from '@/domain/application/repositories/course-teaching-complementary-activities-data-repository';
import { PrismaCourseTeachingComplementaryActivitiesDataRepository } from './prisma/repositories/prisma-course-teaching-complementary-activities-data-repository';
import { CourseExtensionActivitiesDataRepository } from '@/domain/application/repositories/course-extension-activities-data-repository';
import { PrismaCourseExtensionActivitiesDataRepository } from './prisma/repositories/prisma-course-extension-activities-data-repository';
import { TeacherResearchAndExtensionProjectsDataRepository } from '@/domain/application/repositories/teacher-research-and-extension-projects-data-repository';
import { PrismaTeacherResearchAndExtensionProjectsDataRepository } from './prisma/repositories/prisma-teacher-research-and-extension-projects-data-repository';
import { TeacherTechnicalScientificProductionsDataRepository } from '@/domain/application/repositories/teacher-technical-scientific-productions-data-repository';
import { PrismaTeacherTechnicalScientificProductionsDataRepository } from './prisma/repositories/prisma-teacher-technical-scientific-productions-data-repository';
import { CourseInternshipDataRepository } from '@/domain/application/repositories/course-internship-data-repository';
import { PrismaCourseInternshipDataRepository } from './prisma/repositories/prisma-course-internship-data-repository';
import { StudentAffinityByDisciplineDataRepository } from '@/domain/application/repositories/student-affinity-by-discipline-data-repository';
import { StudentAssetDataRepository } from '@/domain/application/repositories/student-asset-data-repository';
import { PrismaStudentAffinityByDisciplineDataRepository } from './prisma/repositories/prisma-student-affinity-by-discipline-data-repository';
import { PrismaStudentAssetDataRepository } from './prisma/repositories/prisma-student-asset-data-repository';
import { StudentCourseChoiceReasonDataRepository } from '@/domain/application/repositories/student-course-choice-reason-data-repository';
import { PrismaStudentCourseChoiceReasonDataRepository } from './prisma/repositories/prisma-student-course-choice-reason-data-repository';
import { StudentHobbyOrHabitDataRepository } from '@/domain/application/repositories/student-hobby-or-habit-data-repository';
import { PrismaStudentHobbyOrHabitDataRepository } from './prisma/repositories/prisma-student-hobby-or-habit-data-repository';
import { StudentIncomingDataRepository } from '@/domain/application/repositories/student-incoming-data-repository';
import { PrismaStudentIncomingDataRepository } from './prisma/repositories/prisma-student-incoming-data-repository';
import { StudentTechnologyDataRepository } from '@/domain/application/repositories/student-technology-data-repository';
import { PrismaStudentTechnologyDataRepository } from './prisma/repositories/prisma-student-technology-data-repository';
import { StudentUniversityChoiceReasonDataRepository } from '@/domain/application/repositories/student-university-choice-reason-data-repository';
import { PrismaStudentUniversityChoiceReasonDataRepository } from './prisma/repositories/prisma-student-university-choice-reason-data-repository';
import { PrismaCourseTeacherWorkloadDataRepository } from './prisma/repositories/prisma-course-teacher-workload-data-repository';
import { CourseTeacherWorkloadDataRepository } from '@/domain/application/repositories/course-teacher-workload-data-repository';

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
      provide: TeacherCoursesRepository,
      useClass: PrismaTeacherCoursesRepository,
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
    {
      provide: TeacherSupervisedCompletionWorkDataRepository,
      useClass: PrismaTeacherSupervisedCompletionWorkDataRepository,
    },
    {
      provide: CourseCompletionWorkDataRepository,
      useClass: PrismaCourseCompletionWorkDataRepository,
    },
    {
      provide: CourseExtensionComplementaryActivitiesDataRepository,
      useClass: PrismaCourseExtensionComplementaryActivitiesDataRepository,
    },
    {
      provide: CourseSearchComplementaryActivitiesDataRepository,
      useClass: PrismaCourseSearchComplementaryActivitiesDataRepository,
    },
    {
      provide: CourseTeachingComplementaryActivitiesDataRepository,
      useClass: PrismaCourseTeachingComplementaryActivitiesDataRepository,
    },
    {
      provide: CourseExtensionActivitiesDataRepository,
      useClass: PrismaCourseExtensionActivitiesDataRepository,
    },
    {
      provide: TeacherResearchAndExtensionProjectsDataRepository,
      useClass: PrismaTeacherResearchAndExtensionProjectsDataRepository,
    },
    {
      provide: TeacherTechnicalScientificProductionsDataRepository,
      useClass: PrismaTeacherTechnicalScientificProductionsDataRepository,
    },
    {
      provide: CourseInternshipDataRepository,
      useClass: PrismaCourseInternshipDataRepository,
    },
    {
      provide: StudentAffinityByDisciplineDataRepository,
      useClass: PrismaStudentAffinityByDisciplineDataRepository,
    },
    {
      provide: StudentAssetDataRepository,
      useClass: PrismaStudentAssetDataRepository,
    },
    {
      provide: StudentCourseChoiceReasonDataRepository,
      useClass: PrismaStudentCourseChoiceReasonDataRepository,
    },
    {
      provide: StudentHobbyOrHabitDataRepository,
      useClass: PrismaStudentHobbyOrHabitDataRepository,
    },
    {
      provide: StudentIncomingDataRepository,
      useClass: PrismaStudentIncomingDataRepository,
    },
    {
      provide: StudentTechnologyDataRepository,
      useClass: PrismaStudentTechnologyDataRepository,
    },
    {
      provide: StudentUniversityChoiceReasonDataRepository,
      useClass: PrismaStudentUniversityChoiceReasonDataRepository,
    },
    {
      provide: CourseTeacherWorkloadDataRepository,
      useClass: PrismaCourseTeacherWorkloadDataRepository,
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
    TeacherCoursesRepository,
    CourseDepartureDataRepository,
    CourseCoordinationDataRepository,
    CourseRegistrationLockDataRepository,
    CourseStudentsDataRepository,
    TeacherSupervisedCompletionWorkDataRepository,
    CourseCompletionWorkDataRepository,
    CourseExtensionComplementaryActivitiesDataRepository,
    CourseSearchComplementaryActivitiesDataRepository,
    CourseTeachingComplementaryActivitiesDataRepository,
    CourseExtensionActivitiesDataRepository,
    TeacherResearchAndExtensionProjectsDataRepository,
    TeacherTechnicalScientificProductionsDataRepository,
    CourseInternshipDataRepository,
    StudentAffinityByDisciplineDataRepository,
    StudentAssetDataRepository,
    StudentCourseChoiceReasonDataRepository,
    StudentHobbyOrHabitDataRepository,
    StudentIncomingDataRepository,
    StudentTechnologyDataRepository,
    StudentUniversityChoiceReasonDataRepository,
    CourseTeacherWorkloadDataRepository,
  ],
})
export class DatabaseModule {}
