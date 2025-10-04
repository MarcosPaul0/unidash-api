import { ActiveStudentsByIngress } from '@/domain/entities/active-students-by-ingress';

export abstract class ActiveStudentsByIngressRepository {
  abstract createMany(
    courseActiveStudentsDataId: string,
    activeStudentsByIngress: ActiveStudentsByIngress[],
  ): Promise<void>;
  abstract findById(
    activeStudentsByIngressId: string,
  ): Promise<ActiveStudentsByIngress | null>;
}
