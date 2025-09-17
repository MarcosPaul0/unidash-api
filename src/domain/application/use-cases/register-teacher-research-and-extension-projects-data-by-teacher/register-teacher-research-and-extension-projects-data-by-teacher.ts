import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { TeacherResearchAndExtensionProjectsDataAlreadyExistsError } from '../errors/teacher-research-and-extension-projects-data-already-exists-error';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';
import { TeacherResearchAndExtensionProjectsDataRepository } from '../../repositories/teacher-research-and-extension-projects-data-repository';

interface RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCaseRequest {
  teacherResearchAndExtensionProjectsData: {
    year: number;
    semester: Semester;
    extensionProjects: number;
    researchProjects: number;
  };
  sessionUser: SessionUser;
}

type RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCaseResponse =
  Either<
    | TeacherResearchAndExtensionProjectsDataAlreadyExistsError
    | ResourceNotFoundError,
    {
      teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData;
    }
  >;

@Injectable()
export class RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCase {
  constructor(
    private teacherResearchAndExtensionProjectsDataRepository: TeacherResearchAndExtensionProjectsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherResearchAndExtensionProjectsData: {
      year,
      semester,
      extensionProjects,
      researchProjects,
    },
    sessionUser,
  }: RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCaseRequest): Promise<RegisterTeacherResearchAndExtensionProjectsDataByTeacherUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['teacher'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

    const teacherId = sessionUser.id;

    const teacherResearchAndExtensionProjectsDataAlreadyExists =
      await this.teacherResearchAndExtensionProjectsDataRepository.findByPeriod(
        teacherId,
        year,
        semester,
      );

    if (teacherResearchAndExtensionProjectsDataAlreadyExists) {
      return left(
        new TeacherResearchAndExtensionProjectsDataAlreadyExistsError(),
      );
    }

    const teacherResearchAndExtensionProjectsData =
      TeacherResearchAndExtensionProjectsData.create({
        teacherId,
        year,
        semester,
        extensionProjects,
        researchProjects,
      });

    await this.teacherResearchAndExtensionProjectsDataRepository.create(
      teacherResearchAndExtensionProjectsData,
    );

    return right({
      teacherResearchAndExtensionProjectsData,
    });
  }
}
