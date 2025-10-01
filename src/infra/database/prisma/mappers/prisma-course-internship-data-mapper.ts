import {
  User as PrismaUser,
  City as PrismaCity,
  Teacher as PrismaTeacher,
  CourseInternshipData as PrismaCourseInternshipData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseInternshipData } from '@/domain/entities/course-internship-data';
import { City } from '@/domain/entities/city';
import { Teacher } from '@/domain/entities/teacher';

type PrismaCourseInternshipDataWithCity = PrismaCourseInternshipData & {
  city: PrismaCity;
};

type PrismaTeacherWithUser = PrismaTeacher & {
  user: PrismaUser;
};

type PrismaCourseInternshipDataWithAndTeacherCity =
  PrismaCourseInternshipData & {
    city: PrismaCity;
    teacher: PrismaTeacherWithUser;
  };

export class PrismaCourseInternshipDataMapper {
  static toDomain(
    raw: PrismaCourseInternshipDataWithCity,
  ): CourseInternshipData {
    return CourseInternshipData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        advisorId: raw.advisorId,
        city: City.create(
          {
            name: raw.city.name,
            stateId: raw.city.stateId,
          },
          new UniqueEntityId(raw.city.id),
        ),
        cityId: raw.cityId,
        conclusionTime: raw.conclusionTime,
        enterpriseCnpj: raw.enterpriseCnpj,
        employmentType: raw.employmentType,
        role: raw.role,
        studentMatriculation: raw.studentMatriculation,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static withTeacherToDomain(
    raw: PrismaCourseInternshipDataWithAndTeacherCity,
  ): CourseInternshipData {
    return CourseInternshipData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        advisorId: raw.advisorId,
        city: City.create(
          {
            name: raw.city.name,
            stateId: raw.city.stateId,
          },
          new UniqueEntityId(raw.city.id),
        ),
        advisor: Teacher.create(
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
        cityId: raw.cityId,
        employmentType: raw.employmentType,
        conclusionTime: raw.conclusionTime,
        enterpriseCnpj: raw.enterpriseCnpj,
        role: raw.role,
        studentMatriculation: raw.studentMatriculation,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseInternshipData: CourseInternshipData,
  ): Prisma.CourseInternshipDataUncheckedCreateInput {
    return {
      courseId: courseInternshipData.courseId,
      year: courseInternshipData.year,
      semester: courseInternshipData.semester,
      advisorId: courseInternshipData.advisorId,
      cityId: courseInternshipData.cityId,
      conclusionTime: courseInternshipData.conclusionTime,
      enterpriseCnpj: courseInternshipData.enterpriseCnpj,
      role: courseInternshipData.role,
      studentMatriculation: courseInternshipData.studentMatriculation,
      employmentType: courseInternshipData.employmentType,
      createdAt: courseInternshipData.createdAt,
      updatedAt: courseInternshipData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseInternshipData: CourseInternshipData,
  ): Prisma.CourseInternshipDataUncheckedUpdateInput {
    return {
      id: courseInternshipData.id.toString(),
      courseId: courseInternshipData.courseId,
      year: courseInternshipData.year,
      semester: courseInternshipData.semester,
      advisorId: courseInternshipData.advisorId,
      cityId: courseInternshipData.cityId,
      conclusionTime: courseInternshipData.conclusionTime,
      enterpriseCnpj: courseInternshipData.enterpriseCnpj,
      role: courseInternshipData.role,
      studentMatriculation: courseInternshipData.studentMatriculation,
      employmentType: courseInternshipData.employmentType,
      createdAt: courseInternshipData.createdAt,
      updatedAt: courseInternshipData.updatedAt,
    };
  }
}
