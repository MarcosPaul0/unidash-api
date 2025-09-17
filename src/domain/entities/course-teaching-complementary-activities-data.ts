import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';

export interface CourseTeachingComplementaryActivitiesDataProps
  extends CourseDataProps {
  subjectMonitoring: number;
  sponsorshipOfNewStudents: number;
  providingTraining: number;
  coursesInTheArea: number;
  coursesOutsideTheArea: number;
  electivesDisciplines: number;
  complementaryCoursesInTheArea: number;
  preparationForTest: number;
}

export class CourseTeachingComplementaryActivitiesData extends CourseData<CourseTeachingComplementaryActivitiesDataProps> {
  get subjectMonitoring() {
    return this.props.subjectMonitoring;
  }

  set subjectMonitoring(subjectMonitoring: number) {
    if (!subjectMonitoring) {
      return;
    }

    this.props.subjectMonitoring = subjectMonitoring;
  }

  get sponsorshipOfNewStudents() {
    return this.props.sponsorshipOfNewStudents;
  }

  set sponsorshipOfNewStudents(sponsorshipOfNewStudents: number) {
    if (!sponsorshipOfNewStudents) {
      return;
    }

    this.props.sponsorshipOfNewStudents = sponsorshipOfNewStudents;
  }

  get providingTraining() {
    return this.props.providingTraining;
  }

  set providingTraining(providingTraining: number) {
    if (!providingTraining) {
      return;
    }

    this.props.providingTraining = providingTraining;
  }

  get coursesInTheArea() {
    return this.props.coursesInTheArea;
  }

  set coursesInTheArea(coursesInTheArea: number) {
    if (!coursesInTheArea) {
      return;
    }

    this.props.coursesInTheArea = coursesInTheArea;
  }

  get coursesOutsideTheArea() {
    return this.props.coursesOutsideTheArea;
  }

  set coursesOutsideTheArea(coursesOutsideTheArea: number) {
    if (!coursesOutsideTheArea) {
      return;
    }

    this.props.coursesOutsideTheArea = coursesOutsideTheArea;
  }

  get electivesDisciplines() {
    return this.props.electivesDisciplines;
  }

  set electivesDisciplines(electivesDisciplines: number) {
    if (!electivesDisciplines) {
      return;
    }

    this.props.electivesDisciplines = electivesDisciplines;
  }

  get complementaryCoursesInTheArea() {
    return this.props.complementaryCoursesInTheArea;
  }

  set complementaryCoursesInTheArea(complementaryCoursesInTheArea: number) {
    if (!complementaryCoursesInTheArea) {
      return;
    }

    this.props.complementaryCoursesInTheArea = complementaryCoursesInTheArea;
  }

  get preparationForTest() {
    return this.props.preparationForTest;
  }

  set preparationForTest(preparationForTest: number) {
    if (!preparationForTest) {
      return;
    }

    this.props.preparationForTest = preparationForTest;
  }

  static create(
    props: Optional<
      CourseTeachingComplementaryActivitiesDataProps,
      'createdAt'
    >,
    id?: UniqueEntityId,
  ) {
    const courseTeachingComplementaryActivitiesData =
      new CourseTeachingComplementaryActivitiesData(
        {
          ...props,
          createdAt: props.createdAt ?? new Date(),
        },
        id,
      );

    return courseTeachingComplementaryActivitiesData;
  }
}
