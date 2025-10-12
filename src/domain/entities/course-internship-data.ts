import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { CourseData, CourseDataProps } from './course-data';
import { Teacher } from './teacher';
import { City } from './city';

export const EMPLOYMENT_TYPE = {
  employmentContract: 'employmentContract',
  independentContractor: 'independentContractor',
  internship: 'internship',
} as const;

export type EmploymentType =
  (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE];

export interface CourseInternshipDataProps extends CourseDataProps {
  studentMatriculation: string;
  enterpriseCnpj: string;
  role: string;
  conclusionTimeInDays: number;
  employmentType: EmploymentType;

  cityId: string;
  city?: City | null;

  advisorId: string;
  advisor?: Teacher | null;
}

export class CourseInternshipData extends CourseData<CourseInternshipDataProps> {
  get studentMatriculation() {
    return this.props.studentMatriculation;
  }

  set studentMatriculation(studentMatriculation: string) {
    if (!studentMatriculation) {
      return;
    }

    this.props.studentMatriculation = studentMatriculation;
  }

  get enterpriseCnpj() {
    return this.props.enterpriseCnpj;
  }

  set enterpriseCnpj(enterpriseCnpj: string) {
    if (!enterpriseCnpj) {
      return;
    }

    this.props.enterpriseCnpj = enterpriseCnpj;
  }

  get employmentType() {
    return this.props.employmentType;
  }

  set employmentType(employmentType: EmploymentType) {
    if (!employmentType) {
      return;
    }

    this.props.employmentType = employmentType;
  }

  get role() {
    return this.props.role;
  }

  set role(role: string) {
    if (!role) {
      return;
    }

    this.props.role = role;
  }

  get conclusionTimeInDays() {
    return this.props.conclusionTimeInDays;
  }

  set conclusionTimeInDays(conclusionTimeInDays: number) {
    if (!conclusionTimeInDays) {
      return;
    }

    this.props.conclusionTimeInDays = conclusionTimeInDays;
  }

  get cityId() {
    return this.props.cityId;
  }

  set cityId(cityId: string) {
    if (!cityId) {
      return;
    }

    this.props.cityId = cityId;
  }

  get city(): City | null {
    return this.props.city ?? null;
  }

  set city(city: City) {
    if (!city) {
      return;
    }

    this.props.city = city;
  }

  get advisorId() {
    return this.props.advisorId;
  }

  set advisorId(advisorId: string) {
    if (!advisorId) {
      return;
    }

    this.props.advisorId = advisorId;
  }

  get advisor(): Teacher | null {
    return this.props.advisor ?? null;
  }

  set advisor(advisor: Teacher) {
    if (!advisor) {
      return;
    }

    this.props.advisor = advisor;
  }

  static create(
    props: Optional<CourseInternshipDataProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courseInternshipData = new CourseInternshipData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseInternshipData;
  }
}
