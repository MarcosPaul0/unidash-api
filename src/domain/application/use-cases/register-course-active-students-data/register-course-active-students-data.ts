import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { CoursesRepository } from '../../repositories/courses-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { CourseActiveStudentsDataAlreadyExistsError } from '../errors/course-active-students-data-already-exists-error';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';
import { CourseActiveStudentsDataRepository } from '../../repositories/course-active-students-data-repository';
import { ActiveStudentsByIngress } from '@/domain/entities/active-students-by-ingress';

interface ActiveStudentsByIngressUseCaseRequest {
  ingressYear: number;
  numberOfStudents: number;
}

interface RegisterCourseActiveStudentsDataUseCaseRequest {
  courseActiveStudentsData: {
    courseId: string;
    year: number;
    semester: Semester;
    activeStudentsByIngress: ActiveStudentsByIngressUseCaseRequest[];
  };
  sessionUser: SessionUser;
}

type RegisterCourseActiveStudentsDataUseCaseResponse = Either<
  CourseActiveStudentsDataAlreadyExistsError | ResourceNotFoundError,
  {
    courseActiveStudentsData: CourseActiveStudentsData;
  }
>;

@Injectable()
export class RegisterCourseActiveStudentsDataUseCase {
  constructor(
    private coursesRepository: CoursesRepository,
    private courseActiveStudentsDataRepository: CourseActiveStudentsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    courseActiveStudentsData: {
      courseId,
      year,
      semester,
      activeStudentsByIngress,
    },
    sessionUser,
  }: RegisterCourseActiveStudentsDataUseCaseRequest): Promise<RegisterCourseActiveStudentsDataUseCaseResponse> {
    const course = await this.coursesRepository.findById(courseId);

    if (!course) {
      return left(new ResourceNotFoundError());
    }

    const authorization =
      await this.authorizationService.ensureIsAdminOrTeacherWithRole(
        sessionUser,
        courseId,
        ['courseManagerTeacher'],
      );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const courseActiveStudentsDataAlreadyExists =
      await this.courseActiveStudentsDataRepository.findByCourseAndPeriod(
        courseId,
        year,
        semester,
      );

    if (courseActiveStudentsDataAlreadyExists) {
      return left(new CourseActiveStudentsDataAlreadyExistsError());
    }

    const courseActiveStudentsData = CourseActiveStudentsData.create({
      courseId,
      year,
      semester,
      activeStudentsByIngress: activeStudentsByIngress.map((activeStudents) =>
        ActiveStudentsByIngress.create(activeStudents),
      ),
    });

    await this.courseActiveStudentsDataRepository.create(
      courseActiveStudentsData,
    );

    return right({
      courseActiveStudentsData,
    });
  }
}
