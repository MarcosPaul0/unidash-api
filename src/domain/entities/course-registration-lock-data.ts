import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseRegistrationLockDataProps extends CourseDataProps {
  difficultyInDiscipline: number;
  workload: number;
  teacherMethodology: number;
  incompatibilityWithWork: number;
  lossOfInterest: number;
  other: number;
}

export class CourseRegistrationLockData extends CourseData<CourseRegistrationLockDataProps> {
  get difficultyInDiscipline() {
    return this.props.difficultyInDiscipline;
  }

  set difficultyInDiscipline(difficultyInDiscipline: number) {
    if (!difficultyInDiscipline) {
      return;
    }

    this.props.difficultyInDiscipline = difficultyInDiscipline;
  }

  get workload() {
    return this.props.workload;
  }

  set workload(workload: number) {
    if (!workload) {
      return;
    }

    this.props.workload = workload;
  }

  get teacherMethodology() {
    return this.props.teacherMethodology;
  }

  set teacherMethodology(teacherMethodology: number) {
    if (!teacherMethodology) {
      return;
    }

    this.props.teacherMethodology = teacherMethodology;
  }

  get incompatibilityWithWork() {
    return this.props.incompatibilityWithWork;
  }

  set incompatibilityWithWork(incompatibilityWithWork: number) {
    if (!incompatibilityWithWork) {
      return;
    }

    this.props.incompatibilityWithWork = incompatibilityWithWork;
  }

  get lossOfInterest() {
    return this.props.lossOfInterest;
  }

  set lossOfInterest(lossOfInterest: number) {
    if (!lossOfInterest) {
      return;
    }

    this.props.lossOfInterest = lossOfInterest;
  }

  get other() {
    return this.props.other;
  }

  set other(other: number) {
    if (!other) {
      return;
    }

    this.props.other = other;
  }

  static create(
    props: Optional<CourseRegistrationLockDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new CourseRegistrationLockData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
