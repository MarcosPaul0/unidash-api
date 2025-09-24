import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';
import { Teacher } from './teacher';

export interface CourseTeacherWorkloadDataProps extends CourseDataProps {
  workloadInMinutes: number;
  teacherId: string;
  teacher?: Teacher | null;
}

export class CourseTeacherWorkloadData extends CourseData<CourseTeacherWorkloadDataProps> {
  get teacherId() {
    return this.props.teacherId;
  }

  set teacherId(teacherId: string) {
    if (!teacherId) {
      return;
    }

    this.props.teacherId = teacherId;
  }

  get workloadInMinutes() {
    return this.props.workloadInMinutes;
  }

  set workloadInMinutes(workloadInMinutes: number) {
    if (!workloadInMinutes) {
      return;
    }

    this.props.workloadInMinutes = workloadInMinutes;
  }

  get teacher(): Teacher | null {
    return this.props.teacher ?? null;
  }

  set teacher(teacher: Teacher) {
    if (!teacher) {
      return;
    }

    this.props.teacher = teacher;
  }

  static create(
    props: Optional<CourseTeacherWorkloadDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new CourseTeacherWorkloadData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
