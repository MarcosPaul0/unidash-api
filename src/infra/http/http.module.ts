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
import { FindAllStudentsByCourseController } from './controllers/find-all-students-by-course/find-all-students-by-course.controller';
import { FindAllStudentsByCourseUseCase } from '@/domain/application/use-cases/find-all-students/find-all-students-by-course';
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
import { FindAllTeachersByCourseController } from './controllers/find-all-teachers-by-course/find-all-teachers-by-course.controller';
import { FindAllTeachersByCourseUseCase } from '@/domain/application/use-cases/find-all-teachers-by-course/find-all-teachers-by-course';
import { FindAllTeachersOutsideOfCourseUseCase } from '@/domain/application/use-cases/find-all-teachers-outside-of-course/find-all-teachers-outside-of-course';
import { FindAllTeachersOutsideOfCourseController } from './controllers/find-all-teachers-outside-of-course/find-all-teachers-outside-of-course.controller';
import { SetTeacherCourseController } from './controllers/set-teacher-course/set-teacher-course.controller';
import { SetTeacherCourseUseCase } from '@/domain/application/use-cases/set-teacher-course/set-teacher-course';
import { DeleteTeacherCourseController } from './controllers/delete-teacher-course/delete-teacher-course.controller';
import { DeleteTeacherCourseUseCase } from '@/domain/application/use-cases/delete-teacher-course/delete-teacher-course';
import { UpdateTeacherByAdminController } from './controllers/update-teacher-by-admin/update-teacher-by-admin.controller';
import { UpdateTeacherByAdminUseCase } from '@/domain/application/use-cases/update-teacher-by-admin/update-teacher-by-admin';
import { GetCourseCoordinationIndicatorsController } from './controllers/get-course-coordination-indicators/get-course-coordination-indicators.controller';
import { GetCourseCoordinationIndicatorsUseCase } from '@/domain/application/use-cases/get-course-coordination-indicators/get-course-coordination-indicators';
import { GetCourseIndicatorsController } from './controllers/get-course-indicators/get-course-indicators.controller';
import { GetCourseIndicatorsUseCase } from '@/domain/application/use-cases/get-course-indicators/get-course-indicators';
import { DeleteCourseCompletionWorkDataController } from './controllers/delete-course-completion-work-data/delete-course-completion-work-data.controller';
import { DeleteTeacherSupervisedCompletionWorkDataController } from './controllers/delete-teacher-supervised-completion-work-data/delete-teacher-supervised-completion-work-data.controller';
import { FindAllCourseCompletionWorkDataController } from './controllers/find-all-course-completion-work-data/find-all-course-completion-work-data.controller';
import { FindAllTeacherSupervisedCompletionWorkDataController } from './controllers/find-all-teacher-supervised-completion-work-data/find-all-teacher-supervised-completion-work-data.controller';
import { RegisterCourseCompletionWorkDataController } from './controllers/register-course-completion-work-data/register-course-completion-work-data.controller';
import { RegisterTeacherSupervisedCompletionWorkDataController } from './controllers/register-teacher-supervised-completion-work-data/register-teacher-supervised-completion-work-data.controller';
import { DeleteCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/delete-course-completion-work-data/delete-course-completion-work-data';
import { DeleteTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/delete-teacher-supervised-completion-work-data/delete-teacher-supervised-completion-work-data';
import { FindAllCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/find-all-course-completion-work-data/find-all-course-completion-work-data';
import { FindAllTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/find-all-teacher-supervised-completion-work-data/find-all-teacher-supervised-completion-work-data';
import { RegisterCourseCompletionWorkDataUseCase } from '@/domain/application/use-cases/register-course-completion-work-data/register-course-completion-work-data';
import { RegisterTeacherSupervisedCompletionWorkDataUseCase } from '@/domain/application/use-cases/register-teacher-supervised-completion-work-data/register-teacher-supervised-completion-work-data';
import { RegisterTeacherSupervisedCompletionWorkDataByTeacherController } from './controllers/register-teacher-supervised-completion-work-data-by-teacher/register-teacher-supervised-completion-work-data-by-teacher.controller';
import { RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase } from '@/domain/application/use-cases/register-teacher-supervised-completion-work-data-by-teacher/register-teacher-supervised-completion-work-data-by-teacher';
import { FindAllTeacherSupervisedCompletionWorkDataForTeacherController } from './controllers/find-all-teacher-supervised-completion-work-data-for-teacher/find-all-teacher-supervised-completion-work-data-for-teacher.controller';
import { FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase } from '@/domain/application/use-cases/find-all-teacher-supervised-completion-work-data-for-teacher/find-all-teacher-supervised-completion-work-data-for-teacher';
import { GetCourseCompletionWorkIndicatorsController } from './controllers/get-course-completion-work-indicators/get-course-completion-work-indicators.controller';
import { GetCourseCompletionWorkIndicatorsUseCase } from '@/domain/application/use-cases/get-course-completion-work-indicators/get-course-completion-work-indicators';
import { DeleteCourseExtensionComplementaryActivitiesDataController } from './controllers/delete-course-extension-complementary-activities-data/delete-course-extension-complementary-activities-data.controller';
import { RegisterCourseExtensionComplementaryActivitiesDataController } from './controllers/register-course-extension-complementary-activities-data/register-course-extension-complementary-activities-data.controller';
import { FindAllCourseExtensionComplementaryActivitiesDataController } from './controllers/find-all-course-extension-complementary-activities-data/find-all-course-extension-complementary-activities-data.controller';
import { DeleteCourseTeachingComplementaryActivitiesDataController } from './controllers/delete-course-teaching-complementary-activities-data/delete-course-teaching-complementary-activities-data.controller';
import { RegisterCourseTeachingComplementaryActivitiesDataController } from './controllers/register-course-teaching-complementary-activities-data/register-course-teaching-complementary-activities-data.controller';
import { FindAllCourseTeachingComplementaryActivitiesDataController } from './controllers/find-all-course-teaching-complementary-activities-data/find-all-course-teaching-complementary-activities-data.controller';
import { DeleteCourseSearchComplementaryActivitiesDataController } from './controllers/delete-course-search-complementary-activities-data/delete-course-search-complementary-activities-data.controller';
import { RegisterCourseSearchComplementaryActivitiesDataController } from './controllers/register-course-search-complementary-activities-data/register-course-search-complementary-activities-data.controller';
import { FindAllCourseSearchComplementaryActivitiesDataController } from './controllers/find-all-course-search-complementary-activities-data/find-all-course-search-complementary-activities-data.controller';
import { DeleteCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-extension-complementary-activities-data/delete-course-extension-complementary-activities-data';
import { RegisterCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-extension-complementary-activities-data/register-course-extension-complementary-activities-data';
import { FindAllCourseExtensionComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-extension-complementary-activities-data/find-all-course-extension-complementary-activities-data';
import { DeleteCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-teaching-complementary-activities-data/delete-course-teaching-complementary-activities-data';
import { RegisterCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-teaching-complementary-activities-data/register-course-teaching-complementary-activities-data';
import { DeleteCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-search-complementary-activities-data/delete-course-search-complementary-activities-data';
import { FindAllCourseTeachingComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-teaching-complementary-activities-data/find-all-course-teaching-complementary-activities-data';
import { RegisterCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-search-complementary-activities-data/register-course-search-complementary-activities-data';
import { FindAllCourseSearchComplementaryActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-search-complementary-activities-data/find-all-course-search-complementary-activities-data';
import { FindAllCourseExtensionActivitiesDataController } from './controllers/find-all-course-extension-activities-data/find-all-course-extension-activities-data.controller';
import { RegisterCourseExtensionActivitiesDataController } from './controllers/register-course-extension-activities-data/register-course-extension-activities-data.controller';
import { DeleteCourseExtensionActivitiesDataController } from './controllers/delete-course-extension-activities-data/delete-course-extension-activities-data.controller';
import { DeleteCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/delete-course-extension-activities-data/delete-course-extension-activities-data';
import { RegisterCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/register-course-extension-activities-data/register-course-extension-activities-data';
import { FindAllCourseExtensionActivitiesDataUseCase } from '@/domain/application/use-cases/find-all-course-extension-activities-data/find-all-course-extension-activities-data';
import { RegisterTeacherTechnicalScientificProductionsDataByTeacherController } from './controllers/register-teacher-technical-scientific-productions-data-by-teacher/register-teacher-technical-scientific-productions-data-by-teacher.controller';
import { RegisterTeacherTechnicalScientificProductionsDataController } from './controllers/register-teacher-technical-scientific-productions-data/register-teacher-technical-scientific-productions-data.controller';
import { RegisterTeacherResearchAndExtensionProjectsDataByTeacherController } from './controllers/register-teacher-research-and-extension-projects-data-by-teacher/register-teacher-research-and-extension-projects-data-by-teacher.controller';
import { RegisterTeacherResearchAndExtensionProjectsDataController } from './controllers/register-teacher-research-and-extension-projects-data/register-teacher-research-and-extension-projects-data.controller';
import { FindAllTeacherTechnicalScientificProductionsDataController } from './controllers/find-all-teacher-technical-scientific-productions-data/find-all-teacher-technical-scientific-productions-data.controller';
import { FindAllTeacherResearchAndExtensionProjectsDataController } from './controllers/find-all-teacher-research-and-extension-projects-data/find-all-teacher-research-and-extension-projects-data.controller';
import { DeleteTeacherTechnicalScientificProductionsDataController } from './controllers/delete-teacher-technical-scientific-productions-data/delete-teacher-technical-scientific-productions-data.controller';
import { DeleteTeacherResearchAndExtensionProjectsDataController } from './controllers/delete-teacher-research-and-extension-projects-data/delete-teacher-research-and-extension-projects-data.controller';
import { DeleteTeacherResearchAndExtensionProjectsDataUseCase } from '@/domain/application/use-cases/delete-teacher-research-and-extension-projects-data/delete-teacher-research-and-extension-projects-data';
import { DeleteTeacherTechnicalScientificProductionsDataUseCase } from '@/domain/application/use-cases/delete-teacher-technical-scientific-productions-data/delete-teacher-technical-scientific-productions-data';
import { FindAllTeacherResearchAndExtensionProjectsDataUseCase } from '@/domain/application/use-cases/find-all-teacher-research-and-extension-projects-data/find-all-teacher-research-and-extension-projects-data';
import { FindAllTeacherTechnicalScientificProductionsDataUseCase } from '@/domain/application/use-cases/find-all-teacher-technical-scientific-productions-data/find-all-teacher-technical-scientific-productions-data';
import { RegisterTeacherResearchAndExtensionProjectsDataUseCase } from '@/domain/application/use-cases/register-teacher-research-and-extension-projects-data/register-teacher-research-and-extension-projects-data';
import { RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCase } from '@/domain/application/use-cases/register-teacher-research-and-extension-projects-data-by-teacher/register-teacher-research-and-extension-projects-data-by-teacher';
import { RegisterTeacherTechnicalScientificProductionsDataUseCase } from '@/domain/application/use-cases/register-teacher-technical-scientific-productions-data/register-teacher-technical-scientific-productions-data';
import { RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase } from '@/domain/application/use-cases/register-teacher-technical-scientific-productions-data-by-teacher/register-teacher-technical-scientific-productions-data-by-teacher';
import { FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase } from '@/domain/application/use-cases/find-all-teacher-research-and-extension-projects-data-for-teacher/find-all-teacher-research-and-extension-projects-data-for-teacher';
import { FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCase } from '@/domain/application/use-cases/find-all-teacher-technical-scientific-productions-data-for-teacher/find-all-teacher-technical-scientific-productions-data-for-teacher';
import { FindAllTeacherResearchAndExtensionProjectsDataForTeacherController } from './controllers/find-all-teacher-research-and-extension-projects-data-for-teacher/find-all-teacher-research-and-extension-projects-data-for-teacher.controller';
import { FindAllTeacherTechnicalScientificProductionsDataForTeacherController } from './controllers/find-all-teacher-technical-scientific-productions-data-for-teacher/find-all-teacher-technical-scientific-productions-data-for-teacher.controller';
import { DeleteCourseInternshipDataController } from './controllers/delete-course-internship-data/delete-course-internship-data.controller';
import { FindAllCourseInternshipDataController } from './controllers/find-all-course-internship-data/find-all-course-internship-data.controller';
import { RegisterCourseInternshipDataController } from './controllers/register-course-internship-data/register-course-internship-data.controller';
import { FindAllCourseInternshipDataUseCase } from '@/domain/application/use-cases/find-all-course-internship-data/find-all-course-internship-data';
import { DeleteCourseInternshipDataUseCase } from '@/domain/application/use-cases/delete-course-internship-data/delete-course-internship-data';
import { RegisterCourseInternshipDataUseCase } from '@/domain/application/use-cases/register-course-internship-data/register-course-internship-data';
import { FindAllCitiesController } from './controllers/find-all-cities/find-all-cities.controller';
import { FindAllCitiesUseCase } from '@/domain/application/use-cases/find-all-cities/find-all-cities';
import { DeleteStudentIncomingDataController } from './controllers/delete-student-incoming-data/delete-student-incoming-data.controller';
import { DeleteStudentIncomingDataUseCase } from '@/domain/application/use-cases/delete-student-incoming-data/delete-student-incoming-data';
import { FindAllStudentIncomingDataUseCase } from '@/domain/application/use-cases/find-all-student-incoming-data/find-all-student-incoming-data';
import { FindAllStudentIncomingDataController } from './controllers/find-all-student-incoming-data/find-all-student-incoming-data.controller';
import { RegisterStudentIncomingDataController } from './controllers/register-student-incoming-data/register-student-incoming-data.controller';
import { RegisterStudentIncomingDataUseCase } from '@/domain/application/use-cases/register-student-incoming-data/register-student-incoming-data';
import { CheckIncomingStudentRespondedController } from './controllers/check-incoming-student-responded/check-incoming-student-responded.controller';
import { CheckIncomingStudentRespondedUseCase } from '@/domain/application/use-cases/check-incoming-student-responded/check-incoming-student-responded';
import { GetCourseActivitiesIndicatorsUseCase } from '@/domain/application/use-cases/get-course-activities-indicators/get-course-activities-indicators';
import { GetCourseActivitiesIndicatorsController } from './controllers/get-course-activities-indicators/get-course-activities-indicators.controller';
import { GetCourseInternshipIndicatorsController } from './controllers/get-course-internship-indicators/get-course-internship-indicators.controller';
import { GetCourseInternshipIndicatorsUseCase } from '@/domain/application/use-cases/get-course-internship-indicators/get-course-internship-indicators';
import { GetCourseTeachersProductionsIndicatorsController } from './controllers/get-course-teachers-productions-indicators/get-course-teachers-productions-indicators.controller';
import { GetCourseTeachersProductionsIndicatorsUseCase } from '@/domain/application/use-cases/get-course-teachers-productions-indicators/get-course-teachers-productions-indicators';
import { GetCourseStudentIncomingIndicatorsController } from './controllers/get-course-student-incoming-indicators/get-course-student-incoming-indicators.controller';
import { GetCourseStudentIncomingIndicatorsUseCase } from '@/domain/application/use-cases/get-course-student-incoming-indicators/get-course-student-incoming-indicators';
import { RegisterCourseTeacherWorkloadDataController } from './controllers/register-course-teacher-workload-data/register-course-teacher-workload-data.controller';
import { DeleteCourseTeacherWorkloadDataController } from './controllers/delete-course-teacher-workload-data/delete-course-teacher-workload-data.controller';
import { FindAllCourseTeacherWorkloadDataController } from './controllers/find-all-course-teacher-workload-data/find-all-course-teacher-workload-data.controller';
import { RegisterCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/register-course-teacher-workload-data/register-course-teacher-workload-data';
import { DeleteCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/delete-course-teacher-workload-data/delete-course-teacher-workload-data';
import { FindAllCourseTeacherWorkloadDataUseCase } from '@/domain/application/use-cases/find-all-course-teacher-workload-data/find-all-course-teacher-workload-data';
import { FindAllCourseActiveStudentsDataController } from './controllers/find-all-course-active-students-data/find-all-course-active-students-data.controller';
import { RegisterCourseActiveStudentsDataController } from './controllers/register-course-active-students-data/register-course-active-students-data.controller';
import { DeleteCourseActiveStudentsDataController } from './controllers/delete-course-active-students-data/delete-course-active-students-data.controller';
import { RegisterCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/register-course-active-students-data/register-course-active-students-data';
import { FindAllCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/find-all-course-active-students-data/find-all-course-active-students-data';
import { DeleteCourseActiveStudentsDataUseCase } from '@/domain/application/use-cases/delete-course-active-students-data/delete-course-active-students-data';
import { FindAllCoursesForGuestController } from './controllers/find-all-courses-for-guest/find-all-courses-for-guest.controller';

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
    FindAllStudentsByCourseController,
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
    FindAllTeachersByCourseController,
    FindAllTeachersOutsideOfCourseController,
    SetTeacherCourseController,
    DeleteTeacherCourseController,
    UpdateTeacherByAdminController,
    GetCourseCoordinationIndicatorsController,
    GetCourseIndicatorsController,
    DeleteCourseCompletionWorkDataController,
    DeleteTeacherSupervisedCompletionWorkDataController,
    FindAllCourseCompletionWorkDataController,
    FindAllTeacherSupervisedCompletionWorkDataController,
    RegisterCourseCompletionWorkDataController,
    RegisterTeacherSupervisedCompletionWorkDataController,
    RegisterTeacherSupervisedCompletionWorkDataByTeacherController,
    FindAllTeacherSupervisedCompletionWorkDataForTeacherController,
    GetCourseCompletionWorkIndicatorsController,
    DeleteCourseExtensionComplementaryActivitiesDataController,
    RegisterCourseExtensionComplementaryActivitiesDataController,
    FindAllCourseExtensionComplementaryActivitiesDataController,
    DeleteCourseTeachingComplementaryActivitiesDataController,
    RegisterCourseTeachingComplementaryActivitiesDataController,
    FindAllCourseTeachingComplementaryActivitiesDataController,
    DeleteCourseSearchComplementaryActivitiesDataController,
    RegisterCourseSearchComplementaryActivitiesDataController,
    FindAllCourseSearchComplementaryActivitiesDataController,
    DeleteCourseExtensionActivitiesDataController,
    RegisterCourseExtensionActivitiesDataController,
    FindAllCourseExtensionActivitiesDataController,
    DeleteTeacherResearchAndExtensionProjectsDataController,
    DeleteTeacherTechnicalScientificProductionsDataController,
    FindAllTeacherResearchAndExtensionProjectsDataController,
    FindAllTeacherTechnicalScientificProductionsDataController,
    FindAllTeacherResearchAndExtensionProjectsDataForTeacherController,
    FindAllTeacherTechnicalScientificProductionsDataForTeacherController,
    RegisterTeacherResearchAndExtensionProjectsDataController,
    RegisterTeacherResearchAndExtensionProjectsDataByTeacherController,
    RegisterTeacherTechnicalScientificProductionsDataController,
    RegisterTeacherTechnicalScientificProductionsDataByTeacherController,
    FindAllCourseInternshipDataController,
    DeleteCourseInternshipDataController,
    RegisterCourseInternshipDataController,
    FindAllCitiesController,
    DeleteStudentIncomingDataController,
    FindAllStudentIncomingDataController,
    RegisterStudentIncomingDataController,
    CheckIncomingStudentRespondedController,
    GetCourseActivitiesIndicatorsController,
    GetCourseInternshipIndicatorsController,
    GetCourseTeachersProductionsIndicatorsController,
    GetCourseStudentIncomingIndicatorsController,
    RegisterCourseTeacherWorkloadDataController,
    DeleteCourseTeacherWorkloadDataController,
    FindAllCourseTeacherWorkloadDataController,
    RegisterCourseActiveStudentsDataController,
    FindAllCourseActiveStudentsDataController,
    DeleteCourseActiveStudentsDataController,
    FindAllCoursesForGuestController,
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
    FindAllStudentsByCourseUseCase,
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
    FindAllTeachersByCourseUseCase,
    FindAllTeachersOutsideOfCourseUseCase,
    SetTeacherCourseUseCase,
    DeleteTeacherCourseUseCase,
    UpdateTeacherByAdminUseCase,
    GetCourseCoordinationIndicatorsUseCase,
    GetCourseIndicatorsUseCase,
    DeleteCourseCompletionWorkDataUseCase,
    DeleteTeacherSupervisedCompletionWorkDataUseCase,
    FindAllCourseCompletionWorkDataUseCase,
    FindAllTeacherSupervisedCompletionWorkDataUseCase,
    RegisterCourseCompletionWorkDataUseCase,
    RegisterTeacherSupervisedCompletionWorkDataUseCase,
    RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase,
    FindAllTeacherSupervisedCompletionWorkDataForTeacherUseCase,
    GetCourseCompletionWorkIndicatorsUseCase,
    DeleteCourseExtensionComplementaryActivitiesDataUseCase,
    RegisterCourseExtensionComplementaryActivitiesDataUseCase,
    FindAllCourseExtensionComplementaryActivitiesDataUseCase,
    DeleteCourseTeachingComplementaryActivitiesDataUseCase,
    RegisterCourseTeachingComplementaryActivitiesDataUseCase,
    FindAllCourseTeachingComplementaryActivitiesDataUseCase,
    DeleteCourseSearchComplementaryActivitiesDataUseCase,
    RegisterCourseSearchComplementaryActivitiesDataUseCase,
    FindAllCourseSearchComplementaryActivitiesDataUseCase,
    DeleteCourseExtensionActivitiesDataUseCase,
    RegisterCourseExtensionActivitiesDataUseCase,
    FindAllCourseExtensionActivitiesDataUseCase,
    DeleteTeacherResearchAndExtensionProjectsDataUseCase,
    DeleteTeacherTechnicalScientificProductionsDataUseCase,
    FindAllTeacherResearchAndExtensionProjectsDataUseCase,
    FindAllTeacherTechnicalScientificProductionsDataUseCase,
    FindAllTeacherResearchAndExtensionProjectsDataForTeacherUseCase,
    FindAllTeacherTechnicalScientificProductionsDataForTeacherUseCase,
    RegisterTeacherResearchAndExtensionProjectsDataUseCase,
    RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCase,
    RegisterTeacherTechnicalScientificProductionsDataUseCase,
    RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase,
    FindAllCourseInternshipDataUseCase,
    DeleteCourseInternshipDataUseCase,
    RegisterCourseInternshipDataUseCase,
    FindAllCitiesUseCase,
    DeleteStudentIncomingDataUseCase,
    FindAllStudentIncomingDataUseCase,
    RegisterStudentIncomingDataUseCase,
    CheckIncomingStudentRespondedUseCase,
    GetCourseActivitiesIndicatorsUseCase,
    GetCourseInternshipIndicatorsUseCase,
    GetCourseTeachersProductionsIndicatorsUseCase,
    GetCourseStudentIncomingIndicatorsUseCase,
    RegisterCourseTeacherWorkloadDataUseCase,
    DeleteCourseTeacherWorkloadDataUseCase,
    FindAllCourseTeacherWorkloadDataUseCase,
    RegisterCourseActiveStudentsDataUseCase,
    FindAllCourseActiveStudentsDataUseCase,
    DeleteCourseActiveStudentsDataUseCase,
  ],
})
export class HttpModule {}
