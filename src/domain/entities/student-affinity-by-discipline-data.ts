import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Entity } from '@/core/entities/entity';

export const HIGH_SCHOOL_DISCIPLINE = {
  history: 'history',
  geography: 'geography',
  portuguese: 'portuguese',
  biology: 'biology',
  chemical: 'chemical',
  mathematics: 'mathematics',
  physical: 'physical',
  english: 'english',
  technology: 'technology',
} as const;

export type HighSchoolDiscipline =
  (typeof HIGH_SCHOOL_DISCIPLINE)[keyof typeof HIGH_SCHOOL_DISCIPLINE];

export const AFFINITY_LEVEL = {
  low: 'low',
  medium: 'medium',
  high: 'high',
} as const;

export type AffinityLevel =
  (typeof AFFINITY_LEVEL)[keyof typeof AFFINITY_LEVEL];

export interface StudentAffinityByDisciplineDataProps {
  studentIncomingDataId: string;
  discipline: HighSchoolDiscipline;
  affinityLevel: AffinityLevel;
}

export class StudentAffinityByDisciplineData extends Entity<StudentAffinityByDisciplineDataProps> {
  get studentIncomingDataId() {
    return this.props.studentIncomingDataId;
  }

  set studentIncomingDataId(studentIncomingDataId: string) {
    if (!studentIncomingDataId) {
      return;
    }

    this.props.studentIncomingDataId = studentIncomingDataId;
  }

  get discipline() {
    return this.props.discipline;
  }

  set discipline(discipline: HighSchoolDiscipline) {
    if (!discipline) {
      return;
    }

    this.props.discipline = discipline;
  }

  get affinityLevel() {
    return this.props.affinityLevel;
  }

  set affinityLevel(affinityLevel: AffinityLevel) {
    if (!affinityLevel) {
      return;
    }

    this.props.affinityLevel = affinityLevel;
  }

  static create(
    props: StudentAffinityByDisciplineDataProps,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new StudentAffinityByDisciplineData(props, id);

    return courseStudentsData;
  }
}
