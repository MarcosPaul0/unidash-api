import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { CoursesRepository } from '../../repositories/courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { TeacherCourse, TeacherRole } from '@/domain/entities/teacher-course';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeacherCoursesRepository } from '../../repositories/teacher-courses-repository';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';

interface SetTeacherCourseData {
  teacherId: string;
  courseId: string;
  teacherRole: TeacherRole;
}

interface SetTeacherCourseUseCaseRequest {
  data: SetTeacherCourseData;
  sessionUser: SessionUser;
}

type SetTeacherCourseUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    teacherCourse: TeacherCourse;
  }
>;

@Injectable()
export class SetTeacherCourseUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private teachersRepository: TeachersRepository,
    private teacherCoursesRepository: TeacherCoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    data,
    sessionUser,
  }: SetTeacherCourseUseCaseRequest): Promise<SetTeacherCourseUseCaseResponse> {
    const { courseId, teacherId } = data;

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseAlreadyExists = await this.coursesRepository.findById(courseId);

    if (!courseAlreadyExists) {
      return left(new ResourceNotFoundError());
    }

    const teacherAlreadyExists =
      await this.teachersRepository.findById(teacherId);

    if (!teacherAlreadyExists) {
      return left(new ResourceNotFoundError());
    }

    const teacherCourse =
      await this.teacherCoursesRepository.findByTeacherAndCourseId(
        teacherId,
        courseId,
      );

    if (teacherCourse) {
      Object.assign(teacherCourse, data);

      await this.teacherCoursesRepository.save(teacherCourse);

      return right({ teacherCourse });
    }

    const teacherCourseToCreate = TeacherCourse.create(data);

    await this.teacherCoursesRepository.create(teacherCourseToCreate);

    return right({
      teacherCourse: teacherCourseToCreate,
    });
  }
}
