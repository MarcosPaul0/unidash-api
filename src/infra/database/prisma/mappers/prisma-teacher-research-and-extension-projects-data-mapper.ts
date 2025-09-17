import {
  TeacherResearchAndExtensionProjectsData as PrismaTeacherResearchAndExtensionProjectsData,
  Teacher as PrismaTeacher,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Teacher } from '@/domain/entities/teacher';
import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';

type PrismaTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaTeacherResearchAndExtensionProjectsDataWithTeacher =
  PrismaTeacherResearchAndExtensionProjectsData & {
    teacher: PrismaTeacherUser;
  };

export class PrismaTeacherResearchAndExtensionProjectsDataMapper {
  static toDomain(
    raw: PrismaTeacherResearchAndExtensionProjectsData,
  ): TeacherResearchAndExtensionProjectsData {
    return TeacherResearchAndExtensionProjectsData.create(
      {
        teacherId: raw.teacherId,
        year: raw.year,
        semester: raw.semester,
        extensionProjects: raw.extensionProjects,
        researchProjects: raw.researchProjects,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withTeacherToDomain(
    raw: PrismaTeacherResearchAndExtensionProjectsDataWithTeacher,
  ): TeacherResearchAndExtensionProjectsData {
    return TeacherResearchAndExtensionProjectsData.create(
      {
        teacherId: raw.teacherId,
        year: raw.year,
        semester: raw.semester,
        extensionProjects: raw.extensionProjects,
        researchProjects: raw.researchProjects,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        teacher: Teacher.create(
          {
            email: raw.teacher.user.email,
            name: raw.teacher.user.name,
            isActive: raw.teacher.isActive,
            password: raw.teacher.user.password,
            role: raw.teacher.user.role,
            accountActivatedAt: raw.teacher.user.accountActivatedAt,
            createdAt: raw.teacher.user.createdAt,
            updatedAt: raw.teacher.user.updatedAt,
          },
          new UniqueEntityId(raw.teacher.user.id),
        ),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Prisma.TeacherResearchAndExtensionProjectsDataUncheckedCreateInput {
    return {
      teacherId: teacherResearchAndExtensionProjectsData.teacherId,
      year: teacherResearchAndExtensionProjectsData.year,
      semester: teacherResearchAndExtensionProjectsData.semester,
      extensionProjects:
        teacherResearchAndExtensionProjectsData.extensionProjects,
      researchProjects:
        teacherResearchAndExtensionProjectsData.researchProjects,
      createdAt: teacherResearchAndExtensionProjectsData.createdAt,
      updatedAt: teacherResearchAndExtensionProjectsData.updatedAt,
    };
  }

  static toPrismaUpdate(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ): Prisma.TeacherResearchAndExtensionProjectsDataUncheckedUpdateInput {
    return {
      id: teacherResearchAndExtensionProjectsData.id.toString(),
      year: teacherResearchAndExtensionProjectsData.year,
      extensionProjects:
        teacherResearchAndExtensionProjectsData.extensionProjects,
      researchProjects:
        teacherResearchAndExtensionProjectsData.researchProjects,
      createdAt: teacherResearchAndExtensionProjectsData.createdAt,
      updatedAt: teacherResearchAndExtensionProjectsData.updatedAt,
    };
  }
}
