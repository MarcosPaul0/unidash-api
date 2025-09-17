import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { SessionUser } from '@/domain/entities/user';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { Semester } from '@/domain/entities/course-data';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';
import { TeacherResearchAndExtensionProjectsDataRepository } from '../../repositories/teacher-research-and-extension-projects-data-repository';
import { TeacherResearchAndExtensionProjectsDataAlreadyExistsError } from '../errors/teacher-research-and-extension-projects-data-already-exists-error';

interface RegisterTeacherResearchAndExtensionProjectsDataUseCaseRequest {
  teacherResearchAndExtensionProjectsData: {
    teacherId: string;
    year: number;
    semester: Semester;
    extensionProjects: number;
    researchProjects: number;
  };
  sessionUser: SessionUser;
}

type RegisterTeacherResearchAndExtensionProjectsDataUseCaseResponse = Either<
  | TeacherResearchAndExtensionProjectsDataAlreadyExistsError
  | ResourceNotFoundError,
  {
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData;
  }
>;

@Injectable()
export class RegisterTeacherResearchAndExtensionProjectsDataUseCase {
  constructor(
    private teacherResearchAndExtensionProjectsDataRepository: TeacherResearchAndExtensionProjectsDataRepository,
    private authorizationService: AuthorizationService,
  ) {}

  async execute({
    teacherResearchAndExtensionProjectsData: {
      teacherId,
      year,
      semester,
      extensionProjects,
      researchProjects,
    },
    sessionUser,
  }: RegisterTeacherResearchAndExtensionProjectsDataUseCaseRequest): Promise<RegisterTeacherResearchAndExtensionProjectsDataUseCaseResponse> {
    const authorization = await this.authorizationService.ensureUserRole(
      sessionUser,
      ['admin'],
    );

    if (authorization.isLeft()) {
      return left(authorization.value);
    }

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
