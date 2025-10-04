import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseCompletionWorkDataAlreadyExistsError } from '../errors/course-completion-work-data-already-exists-error';
import { CourseCompletionWorkData } from '@/domain/entities/course-completion-work-data';
import { CourseCompletionWorkDataRepository } from '../../repositories/course-completion-work-data-repository';

interface RegisterCourseCompletionWorkDataUseCaseRequest {
  courseCompletionWorkData: {
    courseId: string;
    year: number;
    semester: Semester;
    enrollments: number;
    defenses: number;
    abandonments: number;
  };
  sessionUser: SessionUser;
}

type RegisterCourseCompletionWorkDataUseCaseResponse = Either<
  CourseCompletionWorkDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseCompletionWorkData: CourseCompletionWorkData;
  }
>;

@Injectable()
export class RegisterCourseCompletionWorkDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseCompletionWorkDataRepository: CourseCompletionWorkDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseCompletionWorkData: {
      courseId,
      year,
      semester,
      enrollments,
      defenses,
      abandonments,
    },
    sessionUser,
  }: RegisterCourseCompletionWorkDataUseCaseRequest): Promise<RegisterCourseCompletionWorkDataUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher', 'workCompletionManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseCompletionWorkDataAlreadyExists =
      await this.courseCompletionWorkDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseCompletionWorkDataAlreadyExists) {
      return left(new CourseCompletionWorkDataAlreadyExistsError());
    }

    const courseCompletionWorkData = CourseCompletionWorkData.create({
      courseId,
      year,
      semester,
      enrollments,
      defenses,
      abandonments,
    });

    await this.courseCompletionWorkDataRepository.create(
      courseCompletionWorkData,
    );

    return right({
      courseCompletionWorkData,
    });
  }
}
