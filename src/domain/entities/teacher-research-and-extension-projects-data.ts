import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Semester } from './course-data';
import { Teacher } from './teacher';
import { Entity } from '@/core/entities/entity';

export interface TeacherResearchAndExtensionProjectsDataProps {
  extensionProjects: number;
  researchProjects: number;
  teacherId: string;
  teacher?: Teacher | null;
  year: number;
  semester: Semester;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class TeacherResearchAndExtensionProjectsData extends Entity<TeacherResearchAndExtensionProjectsDataProps> {
  get teacherId() {
    return this.props.teacherId;
  }

  set teacherId(teacherId: string) {
    if (!teacherId) {
      return;
    }

    this.props.teacherId = teacherId;
  }

  get extensionProjects() {
    return this.props.extensionProjects;
  }

  set extensionProjects(extensionProjects: number) {
    if (!extensionProjects) {
      return;
    }

    this.props.extensionProjects = extensionProjects;
  }

  get researchProjects() {
    return this.props.researchProjects;
  }

  set researchProjects(researchProjects: number) {
    if (!researchProjects) {
      return;
    }

    this.props.researchProjects = researchProjects;
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

  get year() {
    return this.props.year;
  }

  set year(year: number) {
    if (!year) {
      return;
    }

    this.props.year = year;
  }

  get semester() {
    return this.props.semester;
  }

  set semester(semester: Semester) {
    if (!semester) {
      return;
    }

    this.props.semester = semester;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<TeacherResearchAndExtensionProjectsDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new TeacherResearchAndExtensionProjectsData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
