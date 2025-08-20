import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { RegisterStudentController } from './controllers/register-student/register-student.controller';
import { AuthenticateController } from './controllers/authenticate/authenticate.controller';
import { RegisterStudentUseCase } from '@/domain/application/use-cases/register-student/register-student';
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user/authenticate-user';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RefreshTokenController } from './controllers/refresh-token/refresh-token.controller';
import { RefreshTokenUseCase } from '@/domain/application/use-cases/refresh-token/refresh-token';
import { AccountActivationController } from './controllers/account-activation/account-activation.controller';
import { AccountActivationUseCase } from '@/domain/application/use-cases/account-activation/account-activation';
import { ResendAccountConfirmationEmailController } from './controllers/resend-account-confirmation-email/resend-account-confirmation-email.controller';
import { ResendAccountConfirmationEmailUseCase } from '@/domain/application/use-cases/resend-account-confirmation-email/resend-account-confirmation-email';
import { FindStudentByIdUseCase } from '@/domain/application/use-cases/find-student-by-id/find-student-by-id';
import { FindStudentByIdController } from './controllers/find-student-by-id/find-student-by-id.controller';
import { ForgotPasswordController } from './controllers/forgot-password/forgot-password.controller';
import { SendPasswordResetEmailUseCase } from '@/domain/application/use-cases/send-password-reset-email/send-password-reset-email';
import { ResetPasswordController } from './controllers/reset-password/reset-password.controller';
import { ResetPasswordUseCase } from '@/domain/application/use-cases/reset-password/reset-password';
import { UpdatePasswordUseCase } from '@/domain/application/use-cases/update-password/update-password';
import { UpdatePasswordController } from './controllers/update-password/update-password.controller';
import { UpdateStudentController } from './controllers/update-student/update-student.controller';
import { RegisterTeacherController } from './controllers/register-teacher/register-teacher.controller';
import { DeleteTeacherUseCase } from '@/domain/application/use-cases/delete-teacher/delete-teacher';
import { DeleteTeacherController } from './controllers/delete-teacher/delete-teacher.controller';
import { UpdateTeacherController } from './controllers/update-teacher/update-teacher.controller';
import { UpdateTeacherUseCase } from '@/domain/application/use-cases/update-teacher/update-teacher';
import { FindTeacherByIdUseCase } from '@/domain/application/use-cases/find-teacher-by-id/find-teacher-by-id';
import { FindTeacherByIdController } from './controllers/find-teacher-by-id/find-teacher-by-id.controller';
import { FindAllStatesController } from './controllers/find-all-states/find-all-states.controller';
import { FindAllStatesUseCase } from '@/domain/application/use-cases/find-all-states/find-all-states';
import { FindCitiesByStateController } from './controllers/find-cities-by-state/find-cities-by-state.controller';
import { FindCitiesByStateUseCase } from '@/domain/application/use-cases/find-cities-by-state/find-cities-by-state';
import { FindAdminByIdController } from './controllers/find-admin-by-id/find-admin-by-id.controller';
import { FindAdminByIdUseCase } from '@/domain/application/use-cases/find-admin-by-id/find-admin-by-id';
import { ValidateTokenController } from './controllers/validate-token/validate-token.controller';
import { ValidateTokenUseCase } from '@/domain/application/use-cases/validate-token/validate-token';
import { FindAllStudentsController } from './controllers/find-all-students/find-all-students.controller';
import { FindAllStudentsUseCase } from '@/domain/application/use-cases/find-all-students/find-all-students';
import { NotificationSenderModule } from '../notification/notification.module';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { DeleteStudentController } from './controllers/delete-student/delete-student.controller';
import { DeleteStudentUseCase } from '@/domain/application/use-cases/delete-student/delete-student';
import { UpdateStudentUseCase } from '@/domain/application/use-cases/update-student/update-student';
import { RegisterTeacherUseCase } from '@/domain/application/use-cases/register-teacher/register-teacher';
import { AuthorizationModule } from '../authorization/authorization.module';
import { FindTeacherController } from './controllers/find-teacher/find-teacher.controller';
import { FindStudentController } from './controllers/find-student/find-student.controller';
import { RegisterCourseController } from './controllers/register-course/register-course.controller';
import { UpdateCourseController } from './controllers/update-course/update-course.controller';
import { DeleteCourseController } from './controllers/delete-course/delete-course.controller';
import { FindAllCoursesUseCase } from '@/domain/application/use-cases/find-all-courses/find-all-courses';
import { FindStudentUseCase } from '@/domain/application/use-cases/find-student/find-student';
import { FindTeacherUseCase } from '@/domain/application/use-cases/find-teacher/find-teacher';
import { RegisterCourseUseCase } from '@/domain/application/use-cases/register-course/register-course';
import { UpdateCourseUseCase } from '@/domain/application/use-cases/update-course/update-course';
import { DeleteCourseUseCase } from '@/domain/application/use-cases/delete-course/delete-course';
import { RegisterCourseDepartureDataUseCase } from '@/domain/application/use-cases/register-course-departure-data/register-course-departure-data';
import { UpdateCourseDepartureDataUseCase } from '@/domain/application/use-cases/update-course-departure-data/update-course-departure-data';
import { FindAllCourseDepartureDataUseCase } from '@/domain/application/use-cases/find-all-course-departure-data/find-all-course-departure-data';
import { DeleteCourseDepartureDataUseCase } from '@/domain/application/use-cases/delete-course-departure-data/delete-course-departure-data';
import { RegisterCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/register-course-registration-lock-data/register-course-registration-lock-data';
import { UpdateCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/update-course-registration-lock-data/update-course-registration-lock-data';
import { FindAllCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/find-all-course-registration-lock-data/find-all-course-registration-lock-data';
import { DeleteCourseRegistrationLockDataUseCase } from '@/domain/application/use-cases/delete-course-registration-lock-data/delete-course-registration-lock-data';
import { RegisterCourseCoordinationDataUseCase } from '@/domain/application/use-cases/register-course-coordination-data/register-course-coordination-data';
import { UpdateCourseCoordinationDataUseCase } from '@/domain/application/use-cases/update-course-coordination-data/update-course-coordination-data';
import { FindAllCourseCoordinationDataUseCase } from '@/domain/application/use-cases/find-all-course-coordination-data/find-all-course-coordination-data';
import { DeleteCourseCoordinationDataUseCase } from '@/domain/application/use-cases/delete-course-coordination-data/delete-course-coordination-data';
import { RegisterCourseStudentsDataUseCase } from '@/domain/application/use-cases/register-course-students-data/register-course-students-data';
import { UpdateCourseStudentsDataUseCase } from '@/domain/application/use-cases/update-course-students-data/update-course-students-data';
import { FindAllCourseStudentsDataUseCase } from '@/domain/application/use-cases/find-all-course-students-data/find-all-course-students-data';
import { DeleteCourseStudentsDataUseCase } from '@/domain/application/use-cases/delete-course-students-data/delete-course-students-data';
import { RegisterCourseDepartureDataController } from './controllers/register-course-departure-data/register-course-departure-data.controller';
import { UpdateCourseDepartureDataController } from './controllers/update-course-departure-data/update-course-departure-data.controller';
import { FindAllCourseDepartureDataController } from './controllers/find-all-course-departure-data/find-all-course-departure-data.controller';
import { DeleteCourseDepartureDataController } from './controllers/delete-course-departure-data/delete-course-departure-data.controller';
import { RegisterCourseRegistrationLockDataController } from './controllers/register-course-registration-lock-data/register-course-registration-lock-data.controller';
import { UpdateCourseRegistrationLockDataController } from './controllers/update-course-registration-lock-data/update-course-registration-lock-data.controller';
import { FindAllCourseRegistrationLockDataController } from './controllers/find-all-course-registration-lock-data/find-all-course-registration-lock-data.controller';
import { DeleteCourseRegistrationLockDataController } from './controllers/delete-course-registration-lock-data/delete-course-registration-lock-data.controller';
import { RegisterCourseCoordinationDataController } from './controllers/register-course-coordination-data/register-course-coordination-data.controller';
import { UpdateCourseCoordinationDataController } from './controllers/update-course-coordination-data/update-course-coordination-data.controller';
import { FindAllCourseCoordinationDataController } from './controllers/find-all-course-coordination-data/find-all-course-coordination-data.controller';
import { DeleteCourseCoordinationDataController } from './controllers/delete-course-coordination-data/delete-course-coordination-data.controller';
import { RegisterCourseStudentsDataController } from './controllers/register-course-students-data/register-course-students-data.controller';
import { UpdateCourseStudentsDataController } from './controllers/update-course-students-data/update-course-students-data.controller';
import { FindAllCourseStudentsDataController } from './controllers/find-all-course-students-data/find-all-course-students-data.controller';
import { DeleteCourseStudentsDataController } from './controllers/delete-course-students-data/delete-course-students-data.controller';
import { FindAllTeachersUseCase } from '@/domain/application/use-cases/find-all-teachers/find-all-teachers';
import { FindAllTeachersController } from './controllers/find-all-teachers/find-all-teachers.controller';
import { FindAllCoursesController } from './controllers/find-all-courses/find-all-courses.controller';
import { FindCourseByIdController } from './controllers/find-course-by-id/find-course-by-id.controller';
import { FindCourseByIdUseCase } from '@/domain/application/use-cases/find-course-by-id/find-course-by-id';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    NotificationSenderModule,
    AxiosHttpModule,
    AuthorizationModule,
  ],
  controllers: [
    RegisterStudentController,
    AuthenticateController,
    RefreshTokenController,
    AccountActivationController,
    ResendAccountConfirmationEmailController,
    FindStudentByIdController,
    FindStudentController,
    DeleteStudentController,
    ForgotPasswordController,
    ResetPasswordController,
    UpdatePasswordController,
    UpdateStudentController,
    RegisterTeacherController,
    DeleteTeacherController,
    UpdateTeacherController,
    FindTeacherByIdController,
    FindAllTeachersController,
    FindCourseByIdController,
    FindTeacherController,
    FindAllStatesController,
    FindCitiesByStateController,
    FindAdminByIdController,
    ValidateTokenController,
    FindAllStudentsController,
    RegisterCourseController,
    UpdateCourseController,
    FindAllCoursesController,
    DeleteCourseController,
    RegisterCourseDepartureDataController,
    UpdateCourseDepartureDataController,
    FindAllCourseDepartureDataController,
    DeleteCourseDepartureDataController,
    RegisterCourseRegistrationLockDataController,
    UpdateCourseRegistrationLockDataController,
    FindAllCourseRegistrationLockDataController,
    DeleteCourseRegistrationLockDataController,
    RegisterCourseCoordinationDataController,
    UpdateCourseCoordinationDataController,
    FindAllCourseCoordinationDataController,
    DeleteCourseCoordinationDataController,
    RegisterCourseStudentsDataController,
    UpdateCourseStudentsDataController,
    FindAllCourseStudentsDataController,
    DeleteCourseStudentsDataController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    AccountActivationUseCase,
    ResendAccountConfirmationEmailUseCase,
    FindStudentByIdUseCase,
    FindStudentUseCase,
    DeleteStudentUseCase,
    SendPasswordResetEmailUseCase,
    ResetPasswordUseCase,
    UpdatePasswordUseCase,
    UpdateStudentUseCase,
    RegisterTeacherUseCase,
    FindAllTeachersUseCase,
    DeleteTeacherUseCase,
    UpdateTeacherUseCase,
    FindTeacherByIdUseCase,
    FindTeacherUseCase,
    FindAllStatesUseCase,
    FindCitiesByStateUseCase,
    FindAdminByIdUseCase,
    ValidateTokenUseCase,
    FindAllStudentsUseCase,
    RegisterCourseUseCase,
    FindCourseByIdUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,
    FindAllCoursesUseCase,
    RegisterCourseDepartureDataUseCase,
    UpdateCourseDepartureDataUseCase,
    FindAllCourseDepartureDataUseCase,
    DeleteCourseDepartureDataUseCase,
    RegisterCourseRegistrationLockDataUseCase,
    UpdateCourseRegistrationLockDataUseCase,
    FindAllCourseRegistrationLockDataUseCase,
    DeleteCourseRegistrationLockDataUseCase,
    RegisterCourseCoordinationDataUseCase,
    UpdateCourseCoordinationDataUseCase,
    FindAllCourseCoordinationDataUseCase,
    DeleteCourseCoordinationDataUseCase,
    RegisterCourseStudentsDataUseCase,
    UpdateCourseStudentsDataUseCase,
    FindAllCourseStudentsDataUseCase,
    DeleteCourseStudentsDataUseCase,
  ],
})
export class HttpModule {}
