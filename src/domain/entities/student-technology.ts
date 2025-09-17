import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

export const TECHNOLOGY = {
  internetNavigation: 'internetNavigation',
  softwareInstallation: 'softwareInstallation',
  programmingAndLanguages: 'programmingAndLanguages',
  spreadsheets: 'spreadsheets',
  operatingSystemSetup: 'operatingSystemSetup',
} as const;

export type Technology = (typeof TECHNOLOGY)[keyof typeof TECHNOLOGY];

export interface StudentTechnologyProps {
  technology: Technology;
  description: string;
}

export class StudentTechnology extends Entity<StudentTechnologyProps> {
  get technology() {
    return this.props.technology;
  }

  set technology(technology: Technology) {
    if (!technology) {
      return;
    }

    this.props.technology = technology;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    if (!description) {
      return;
    }

    this.props.description = description;
  }

  static create(props: StudentTechnologyProps, id?: UniqueEntityId) {
    const teacherCourse = new StudentTechnology(props, id);

    return teacherCourse;
  }
}
