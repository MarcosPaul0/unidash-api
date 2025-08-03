import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';
import { Teacher } from './teacher';
import { Course } from './course';

export const TEACHER_ROLE = {
  internshipManagerTeacher: 'internshipManagerTeacher',
  courseManagerTeacher: 'courseManagerTeacher',
  workCompletionManagerTeacher: 'workCompletionManagerTeacher',
  complementaryActivitiesManagerTeacher:
    'complementaryActivitiesManagerTeacher',
  extensionsActivitiesManagerTeacher: 'extensionsActivitiesManagerTeacher',
  normalTeacher: 'normalTeacher',
} as const;

export type TeacherRole = (typeof TEACHER_ROLE)[keyof typeof TEACHER_ROLE];

export interface TeacherCourseProps {
  teacherRole: TeacherRole;
  courseId: string;
  teacherId: string;
  createdAt: Date;
  updatedAt?: Date | null;
  teacher?: Teacher | null;
  course?: Course | null;
}

export class TeacherCourse extends Entity<TeacherCourseProps> {
  get teacherRole() {
    return this.props.teacherRole;
  }

  set teacherRole(teacherRole: TeacherRole) {
    if (!teacherRole) {
      return;
    }

    this.props.teacherRole = teacherRole;
  }

  get courseId() {
    return this.props.courseId;
  }

  set courseId(courseId: string) {
    if (!courseId) {
      return;
    }

    this.props.courseId = courseId;
  }

  get teacherId() {
    return this.props.teacherId;
  }

  set teacherId(teacherId: string) {
    if (!teacherId) {
      return;
    }

    this.props.teacherId = teacherId;
  }

  get teacher() {
    if (!this.props.teacher) {
      throw new Error('Teacher is not set');
    }

    return this.props.teacher;
  }

  set teacher(teacher: Teacher) {
    if (!teacher) {
      return;
    }

    this.props.teacher = teacher;
  }

  get course() {
    if (!this.props.course) {
      throw new Error('Teacher is not set');
    }

    return this.props.course;
  }

  set course(course: Course) {
    if (!course) {
      return;
    }

    this.props.course = course;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<TeacherCourseProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const teacherCourse = new TeacherCourse(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return teacherCourse;
  }
}
