import {
  TeacherSupervisedCompletionWorkData as PrismaTeacherSupervisedCompletionWorkData,
  Teacher as PrismaTeacher,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { TeacherSupervisedCompletionWorkData } from '@/domain/entities/teacher-supervised-completion-work-data';
import { Teacher } from '@/domain/entities/teacher';

type PrismaTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaTeacherSupervisedCompletionWorkDataWithTeacher =
  PrismaTeacherSupervisedCompletionWorkData & {
    teacher: PrismaTeacherUser;
  };

export class PrismaTeacherSupervisedCompletionWorkDataMapper {
  static toDomain(
    raw: PrismaTeacherSupervisedCompletionWorkData,
  ): TeacherSupervisedCompletionWorkData {
    return TeacherSupervisedCompletionWorkData.create(
      {
        courseId: raw.courseId,
        teacherId: raw.teacherId,
        year: raw.year,
        semester: raw.semester,
        approved: raw.approved,
        failed: raw.failed,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withTeacherToDomain(
    raw: PrismaTeacherSupervisedCompletionWorkDataWithTeacher,
  ): TeacherSupervisedCompletionWorkData {
    return TeacherSupervisedCompletionWorkData.create(
      {
        courseId: raw.courseId,
        teacherId: raw.teacherId,
        year: raw.year,
        semester: raw.semester,
        approved: raw.approved,
        failed: raw.failed,
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
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Prisma.TeacherSupervisedCompletionWorkDataUncheckedCreateInput {
    return {
      courseId: teacherSupervisedCompletionWorkData.courseId,
      teacherId: teacherSupervisedCompletionWorkData.teacherId,
      year: teacherSupervisedCompletionWorkData.year,
      semester: teacherSupervisedCompletionWorkData.semester,
      approved: teacherSupervisedCompletionWorkData.approved,
      failed: teacherSupervisedCompletionWorkData.failed,
      createdAt: teacherSupervisedCompletionWorkData.createdAt,
      updatedAt: teacherSupervisedCompletionWorkData.updatedAt,
    };
  }

  static toPrismaUpdate(
    teacherSupervisedCompletionWorkData: TeacherSupervisedCompletionWorkData,
  ): Prisma.TeacherSupervisedCompletionWorkDataUncheckedUpdateInput {
    return {
      id: teacherSupervisedCompletionWorkData.id.toString(),
      year: teacherSupervisedCompletionWorkData.year,
      semester: teacherSupervisedCompletionWorkData.semester,
      approved: teacherSupervisedCompletionWorkData.approved,
      failed: teacherSupervisedCompletionWorkData.failed,
      createdAt: teacherSupervisedCompletionWorkData.createdAt,
      updatedAt: teacherSupervisedCompletionWorkData.updatedAt,
    };
  }
}
