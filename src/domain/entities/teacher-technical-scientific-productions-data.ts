import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Semester } from './course-data';
import { Teacher } from './teacher';
import { Entity } from '@/core/entities/entity';

export interface TeacherTechnicalScientificProductionsDataProps {
  year: number;
  semester: Semester;
  createdAt: Date;
  updatedAt?: Date | null;
  periodicals: number;
  congress: number;
  booksChapter: number;
  programs: number;
  abstracts: number;
  teacherId: string;
  teacher?: Teacher | null;
}

export class TeacherTechnicalScientificProductionsData extends Entity<TeacherTechnicalScientificProductionsDataProps> {
  get teacherId() {
    return this.props.teacherId;
  }

  set teacherId(teacherId: string) {
    if (!teacherId) {
      return;
    }

    this.props.teacherId = teacherId;
  }

  get periodicals() {
    return this.props.periodicals;
  }

  set periodicals(periodicals: number) {
    if (!periodicals) {
      return;
    }

    this.props.periodicals = periodicals;
  }

  get congress() {
    return this.props.congress;
  }

  set congress(congress: number) {
    if (!congress) {
      return;
    }

    this.props.congress = congress;
  }

  get booksChapter() {
    return this.props.booksChapter;
  }

  set booksChapter(booksChapter: number) {
    if (!booksChapter) {
      return;
    }

    this.props.booksChapter = booksChapter;
  }

  get programs() {
    return this.props.programs;
  }

  set programs(programs: number) {
    if (!programs) {
      return;
    }

    this.props.programs = programs;
  }

  get abstracts() {
    return this.props.abstracts;
  }

  set abstracts(abstracts: number) {
    if (!abstracts) {
      return;
    }

    this.props.abstracts = abstracts;
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
    props: Optional<
      TeacherTechnicalScientificProductionsDataProps,
      'createdAt'
    >,
    id?: UniqueEntityId,
  ) {
    const courseStudentsData = new TeacherTechnicalScientificProductionsData(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return courseStudentsData;
  }
}
