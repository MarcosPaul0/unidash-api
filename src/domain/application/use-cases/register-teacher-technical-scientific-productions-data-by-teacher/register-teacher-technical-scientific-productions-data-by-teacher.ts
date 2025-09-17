import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { TeacherTechnicalScientificProductionsDataAlreadyExistsError } from '../errors/teacher-technical-scientific-productions-data-already-exists-error';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';
import { TeacherTechnicalScientificProductionsDataRepository } from '../../repositories/teacher-technical-scientific-productions-data-repository';

interface RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCaseRequest {
  teacherTechnicalScientificProductionsData: {
    year: number;
    semester: Semester;
    periodicals: number;
    congress: number;
    booksChapter: number;
    programs: number;
    abstracts: number;
  };
  sessionUser: SessionUser;
}

type RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCaseResponse =
  Either<
    | TeacherTechnicalScientificProductionsDataAlreadyExistsError
    | ResourceNotFoundError,
    {
      teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData;
    }
  >;

@Injectable()
export class RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCase {
  constructor(
    private teacherTechnicalScientificProductionsDataRepository: TeacherTechnicalScientificProductionsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherTechnicalScientificProductionsData: {
      year,
      semester,
      periodicals,
      congress,
      booksChapter,
      programs,
      abstracts,
    },
    sessionUser,
  }: RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCaseRequest): Promise<RegisterTeacherTechnicalScientificProductionsDataByTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherId = sessionUser.id;

    const teacherTechnicalScientificProductionsDataAlreadyExists =
      await this.teacherTechnicalScientificProductionsDataRepository.findByPeriod(
        teacherId,
        year,
        semester,
      );

    if (teacherTechnicalScientificProductionsDataAlreadyExists) {
      return left(
        new TeacherTechnicalScientificProductionsDataAlreadyExistsError(),
      );
    }

    const teacherTechnicalScientificProductionsData =
      TeacherTechnicalScientificProductionsData.create({
        teacherId,
        year,
        semester,
        periodicals,
        congress,
        booksChapter,
        programs,
        abstracts,
      });

    await this.teacherTechnicalScientificProductionsDataRepository.create(
      teacherTechnicalScientificProductionsData,
    );

    return right({
      teacherTechnicalScientificProductionsData,
    });
  }
}
