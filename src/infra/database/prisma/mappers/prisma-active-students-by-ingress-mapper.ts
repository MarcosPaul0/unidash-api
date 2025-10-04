import {
  ActiveStudentsByIngress as PrismaActiveStudentsByIngress,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ActiveStudentsByIngress } from '@/domain/entities/active-students-by-ingress';

export class PrismaActiveStudentsByIngressMapper {
  static toDomain(raw: PrismaActiveStudentsByIngress): ActiveStudentsByIngress {
    return ActiveStudentsByIngress.create(
      {
        ingressYear: raw.ingressYear,
        numberOfStudents: raw.numberOfStudents,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    activeStudentsByIngress: ActiveStudentsByIngress,
    courseActiveStudentsDataId: string,
  ): Prisma.ActiveStudentsByIngressUncheckedCreateInput {
    return {
      courseActiveStudentsDataId: courseActiveStudentsDataId,
      ingressYear: activeStudentsByIngress.ingressYear,
      numberOfStudents: activeStudentsByIngress.numberOfStudents,
    };
  }
}
