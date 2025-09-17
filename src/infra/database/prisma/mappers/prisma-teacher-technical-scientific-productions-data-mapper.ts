import {
  TeacherTechnicalScientificProductionsData as PrismaTeacherTechnicalScientificProductionsData,
  Teacher as PrismaTeacher,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Teacher } from '@/domain/entities/teacher';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

type PrismaTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaTeacherTechnicalScientificProductionsDataWithTeacher =
  PrismaTeacherTechnicalScientificProductionsData & {
    teacher: PrismaTeacherUser;
  };

export class PrismaTeacherTechnicalScientificProductionsDataMapper {
  static toDomain(
    raw: PrismaTeacherTechnicalScientificProductionsData,
  ): TeacherTechnicalScientificProductionsData {
    return TeacherTechnicalScientificProductionsData.create(
      {
        teacherId: raw.teacherId,
        year: raw.year,
        semester: raw.semester,
        periodicals: raw.periodicals,
        congress: raw.congress,
        booksChapter: raw.booksChapter,
        programs: raw.programs,
        abstracts: raw.abstracts,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withTeacherToDomain(
    raw: PrismaTeacherTechnicalScientificProductionsDataWithTeacher,
  ): TeacherTechnicalScientificProductionsData {
    return TeacherTechnicalScientificProductionsData.create(
      {
        teacherId: raw.teacherId,
        year: raw.year,
        semester: raw.semester,
        periodicals: raw.periodicals,
        congress: raw.congress,
        booksChapter: raw.booksChapter,
        programs: raw.programs,
        abstracts: raw.abstracts,
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
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Prisma.TeacherTechnicalScientificProductionsDataUncheckedCreateInput {
    return {
      teacherId: teacherTechnicalScientificProductionsData.teacherId,
      year: teacherTechnicalScientificProductionsData.year,
      semester: teacherTechnicalScientificProductionsData.semester,
      periodicals: teacherTechnicalScientificProductionsData.periodicals,
      congress: teacherTechnicalScientificProductionsData.congress,
      booksChapter: teacherTechnicalScientificProductionsData.booksChapter,
      programs: teacherTechnicalScientificProductionsData.programs,
      abstracts: teacherTechnicalScientificProductionsData.abstracts,
      createdAt: teacherTechnicalScientificProductionsData.createdAt,
      updatedAt: teacherTechnicalScientificProductionsData.updatedAt,
    };
  }

  static toPrismaUpdate(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ): Prisma.TeacherTechnicalScientificProductionsDataUncheckedUpdateInput {
    return {
      id: teacherTechnicalScientificProductionsData.id.toString(),
      year: teacherTechnicalScientificProductionsData.year,
      semester: teacherTechnicalScientificProductionsData.semester,
      periodicals: teacherTechnicalScientificProductionsData.periodicals,
      congress: teacherTechnicalScientificProductionsData.congress,
      booksChapter: teacherTechnicalScientificProductionsData.booksChapter,
      programs: teacherTechnicalScientificProductionsData.programs,
      abstracts: teacherTechnicalScientificProductionsData.abstracts,
      createdAt: teacherTechnicalScientificProductionsData.createdAt,
      updatedAt: teacherTechnicalScientificProductionsData.updatedAt,
    };
  }
}
