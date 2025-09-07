import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { TeachersRepository } from '../../repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { TeacherCoursesRepository } from '../../repositories/teacher-courses-repository';
import { TeacherCourse } from '@/domain/entities/teacher-course';

interface FindTeacherUseCaseRequest {
  sessionUser: SessionUser;
}

type FindTeacherUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    teacher: Teacher;
    teacherCourses: TeacherCourse[];
  }
>;

@Injectable()
export class FindTeacherUseCase {
  constructor(
    private teachersRepository: TeachersRepository,
    private teacherCoursesRepository: TeacherCoursesRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    sessionUser,
  }: FindTeacherUseCaseRequest): Promise<FindTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherId = sessionUser.id.toString();

    const teacher = await this.teachersRepository.findById(teacherId);

    if (!teacher) {
      return left(new ResourceNotFoundError());
    }

    const teacherCourses =
      await this.teacherCoursesRepository.findAllByTeacherId(teacherId);

    return right({
      teacher,
      teacherCourses,
    });
  }
}
