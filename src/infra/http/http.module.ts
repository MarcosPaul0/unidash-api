import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CreateStudentAccountController } from './controllers/create-student-account/create-student-account.controller';
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
import { CreateTeacherAccountController } from './controllers/create-teacher-account/create-teacher-account.controller';
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
import { FindAllStudentsForAdminController } from './controllers/find-all-students-for-admin/find-all-students-for-admin.controller';
import { FindAllStudentsForAdminUseCase } from '@/domain/application/use-cases/find-all-students-for-admin/find-all-students-for-admin';
import { NotificationSenderModule } from '../notification/notification.module';
import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { DeleteStudentController } from './controllers/delete-student/delete-student.controller';
import { DeleteStudentUseCase } from '@/domain/application/use-cases/delete-student/delete-student';
import { UpdateStudentUseCase } from '@/domain/application/use-cases/update-student/update-student';
import { RegisterTeacherUseCase } from '@/domain/application/use-cases/register-teacher/register-teacher';
import { AuthorizationModule } from '../authorization/authorization.module';

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    NotificationSenderModule,
    AxiosHttpModule,
    AuthorizationModule,
  ],
  controllers: [
    CreateStudentAccountController,
    AuthenticateController,
    RefreshTokenController,
    AccountActivationController,
    ResendAccountConfirmationEmailController,
    FindStudentByIdController,
    DeleteStudentController,
    ForgotPasswordController,
    ResetPasswordController,
    UpdatePasswordController,
    UpdateStudentController,
    CreateTeacherAccountController,
    DeleteTeacherController,
    UpdateTeacherController,
    FindTeacherByIdController,
    FindAllStatesController,
    FindCitiesByStateController,
    FindAdminByIdController,
    ValidateTokenController,
    FindAllStudentsForAdminController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateUserUseCase,
    RefreshTokenUseCase,
    AccountActivationUseCase,
    ResendAccountConfirmationEmailUseCase,
    FindStudentByIdUseCase,
    DeleteStudentUseCase,
    SendPasswordResetEmailUseCase,
    ResetPasswordUseCase,
    UpdatePasswordUseCase,
    UpdateStudentUseCase,
    RegisterTeacherUseCase,
    DeleteTeacherUseCase,
    UpdateTeacherUseCase,
    FindTeacherByIdUseCase,
    FindAllStatesUseCase,
    FindCitiesByStateUseCase,
    FindAdminByIdUseCase,
    ValidateTokenUseCase,
    FindAllStudentsForAdminUseCase,
  ],
})
export class HttpModule {}
