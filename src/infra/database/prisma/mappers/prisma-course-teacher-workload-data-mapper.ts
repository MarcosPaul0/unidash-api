import {
  CourseTeacherWorkloadData as PrismaCourseTeacherWorkloadData,
  Teacher as PrismaTeacher,
  User as PrismaUser,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Teacher } from '@/domain/entities/teacher';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';

type PrismaCourseTeacherUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaCourseTeacherWorkloadDataWithTeacher =
  PrismaCourseTeacherWorkloadData & {
    teacher: PrismaCourseTeacherUser;
  };

export class PrismaCourseTeacherWorkloadDataMapper {
  static toDomain(
    raw: PrismaCourseTeacherWorkloadData,
  ): CourseTeacherWorkloadData {
    return CourseTeacherWorkloadData.create(
      {
        teacherId: raw.teacherId,
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        workloadInMinutes: raw.workloadInMinutes,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withTeacherToDomain(
    raw: PrismaCourseTeacherWorkloadDataWithTeacher,
  ): CourseTeacherWorkloadData {
    return CourseTeacherWorkloadData.create(
      {
        teacherId: raw.teacherId,
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        workloadInMinutes: raw.workloadInMinutes,
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
    teacherWorkloadData: CourseTeacherWorkloadData,
  ): Prisma.CourseTeacherWorkloadDataUncheckedCreateInput {
    return {
      teacherId: teacherWorkloadData.teacherId,
      courseId: teacherWorkloadData.courseId,
      year: teacherWorkloadData.year,
      semester: teacherWorkloadData.semester,
      workloadInMinutes: teacherWorkloadData.workloadInMinutes,
      createdAt: teacherWorkloadData.createdAt,
      updatedAt: teacherWorkloadData.updatedAt,
    };
  }

  static toPrismaUpdate(
    teacherWorkloadData: CourseTeacherWorkloadData,
  ): Prisma.CourseTeacherWorkloadDataUncheckedUpdateInput {
    return {
      id: teacherWorkloadData.id.toString(),
      year: teacherWorkloadData.year,
      semester: teacherWorkloadData.semester,
      workloadInMinutes: teacherWorkloadData.workloadInMinutes,
      createdAt: teacherWorkloadData.createdAt,
      updatedAt: teacherWorkloadData.updatedAt,
    };
  }
}
