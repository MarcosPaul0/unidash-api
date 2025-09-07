import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';
import { TeacherSupervisedCompletionWorkDataRepository } from '../../repositories/teacher-supervised-completion-work-data-repository';
import { TeacherSupervisedCompletionWorkDataAlreadyExistsError } from '../errors/teacher-supervised-completion-work-data-already-exists-error';

interface RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCaseRequest {
  teacherSupervisedCompletionWorkData: {
    courseId: string;
    year: number;
    semester: Semester;
    approved: number;
    failed: number;
  };
  sessionUser: SessionUser;
}

type RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCaseResponse =
  Either<
    | TeacherSupervisedCompletionWorkDataAlreadyExistsError
    | ResourceNotFoundError,
    {
      teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData;
    }
  >;

@Injectable()
export class RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private teacherSupervisedCompletionWorkDataRepository: TeacherSupervisedCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherSupervisedCompletionWorkData: {
      courseId,
      year,
      semester,
      approved,
      failed,
    },
    sessionUser,
  }: RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCaseRequest): Promise<RegisterTeacherSupervisedCompletionWorkDataByTeacherUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherId = sessionUser.id;

    const teacherSupervisedCompletionWorkDataAlreadyExists =
      await this.teacherSupervisedCompletionWorkDataRepository.findByCourseTeacherAndPeriod(
        courseId,
        teacherId,
        year,
        semester,
      );

    if (teacherSupervisedCompletionWorkDataAlreadyExists) {
      return left(new TeacherSupervisedCompletionWorkDataAlreadyExistsError());
    }

    const teacherSupervisedCompletionWorkData =
      TeacherSupervisedCompletionWorkData.create({
        courseId,
        teacherId,
        year,
        semester,
        approved,
        failed,
      });

    await this.teacherSupervisedCompletionWorkDataRepository.create(
      teacherSupervisedCompletionWorkData,
    );

    return right({
      teacherSupervisedCompletionWorkData,
    });
  }
}
