import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';
import { Semester } from '@prisma/client';
import { StudentAffinityByDisciplineData } from './student-affinity-by-discipline-data';
import { StudentHobbyOrHabitData } from './student-hobby-or-habit-data';
import { StudentAssetData } from './student-asset-data';
import { StudentCourseChoiceReasonData } from './student-course-choice-reason-data';
import { StudentUniversityChoiceReasonData } from './student-university-choice-reason-data';
import { StudentTechnologyData } from './student-technology-data';

export const WORK_EXPECTATION = {
  employmentContract: 'employmentContract',
  independentContractor: 'independentContractor',
  undecided: 'undecided',
  publicSector: 'publicSector',
  academicCareer: 'academicCareer',
} as const;

export type WorkExpectation =
  (typeof WORK_EXPECTATION)[keyof typeof WORK_EXPECTATION];

export const CURRENT_EDUCATION = {
  technicalInField: 'technicalInField',
  technicalOutField: 'technicalOutField',
  higherInField: 'higherInField',
  higherOutField: 'higherOutField',
  none: 'none',
} as const;

export type CurrentEducation =
  (typeof CURRENT_EDUCATION)[keyof typeof CURRENT_EDUCATION];

export const ENGLISH_PROFICIENCY_LEVEL = {
  low: 'low',
  intermediate: 'intermediate',
  fluent: 'fluent',
} as const;

export type EnglishProficiencyLevel =
  (typeof ENGLISH_PROFICIENCY_LEVEL)[keyof typeof ENGLISH_PROFICIENCY_LEVEL];

export interface StudentIncomingDataProps {
  studentId: string;
  year: number;
  semester: Semester;
  workExpectation: WorkExpectation;
  currentEducation: CurrentEducation;
  englishProficiencyLevel: EnglishProficiencyLevel;
  nocturnalPreference: boolean;
  knowRelatedCourseDifference: boolean;
  readPedagogicalProject: boolean;
  studentAffinityByDisciplineData: StudentAffinityByDisciplineData[];
  studentHobbyOrHabitData: StudentHobbyOrHabitData[];
  studentAssetData: StudentAssetData[];
  studentCourseChoiceReasonData: StudentCourseChoiceReasonData[];
  studentUniversityChoiceReasonData: StudentUniversityChoiceReasonData[];
  studentTechnologyData: StudentTechnologyData[];
  createdAt: Date;
}

export class StudentIncomingData extends Entity<StudentIncomingDataProps> {
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
  string;

  set semester(semester: Semester) {
    if (!semester) {
      return;
    }

    this.props.semester = semester;
  }

  get studentId() {
    return this.props.studentId;
  }

  set studentId(studentId: string) {
    if (!studentId) {
      return;
    }

    this.props.studentId = studentId;
  }

  get workExpectation() {
    return this.props.workExpectation;
  }

  set workExpectation(workExpectation: WorkExpectation) {
    if (!workExpectation) {
      return;
    }

    this.props.workExpectation = workExpectation;
  }

  get currentEducation() {
    return this.props.currentEducation;
  }

  set currentEducation(currentEducation: CurrentEducation) {
    if (!currentEducation) {
      return;
    }

    this.props.currentEducation = currentEducation;
  }

  get englishProficiencyLevel() {
    return this.props.englishProficiencyLevel;
  }

  set englishProficiencyLevel(
    englishProficiencyLevel: EnglishProficiencyLevel,
  ) {
    if (!englishProficiencyLevel) {
      return;
    }

    this.props.englishProficiencyLevel = englishProficiencyLevel;
  }

  get nocturnalPreference() {
    return this.props.nocturnalPreference;
  }

  set nocturnalPreference(nocturnalPreference: boolean) {
    if (!nocturnalPreference) {
      return;
    }

    this.props.nocturnalPreference = nocturnalPreference;
  }

  get knowRelatedCourseDifference() {
    return this.props.knowRelatedCourseDifference;
  }

  set knowRelatedCourseDifference(knowRelatedCourseDifference: boolean) {
    if (!knowRelatedCourseDifference) {
      return;
    }

    this.props.knowRelatedCourseDifference = knowRelatedCourseDifference;
  }

  get readPedagogicalProject() {
    return this.props.readPedagogicalProject;
  }

  set readPedagogicalProject(readPedagogicalProject: boolean) {
    if (!readPedagogicalProject) {
      return;
    }

    this.props.readPedagogicalProject = readPedagogicalProject;
  }

  get studentAffinityByDisciplineData() {
    return this.props.studentAffinityByDisciplineData;
  }

  set studentAffinityByDisciplineData(
    studentAffinityByDisciplineData: StudentAffinityByDisciplineData[],
  ) {
    if (!studentAffinityByDisciplineData) {
      return;
    }

    this.props.studentAffinityByDisciplineData =
      studentAffinityByDisciplineData;
  }

  get studentHobbyOrHabitData() {
    return this.props.studentHobbyOrHabitData;
  }

  set studentHobbyOrHabitData(
    studentHobbyOrHabitData: StudentHobbyOrHabitData[],
  ) {
    if (!studentHobbyOrHabitData) {
      return;
    }

    this.props.studentHobbyOrHabitData = studentHobbyOrHabitData;
  }

  get studentAssetData() {
    return this.props.studentAssetData;
  }

  set studentAssetData(studentAssetData: StudentAssetData[]) {
    if (!studentAssetData) {
      return;
    }

    this.props.studentAssetData = studentAssetData;
  }

  get studentCourseChoiceReasonData() {
    return this.props.studentCourseChoiceReasonData;
  }

  set studentCourseChoiceReasonData(
    studentCourseChoiceReasonData: StudentCourseChoiceReasonData[],
  ) {
    if (!studentCourseChoiceReasonData) {
      return;
    }

    this.props.studentCourseChoiceReasonData = studentCourseChoiceReasonData;
  }

  get studentUniversityChoiceReasonData() {
    return this.props.studentUniversityChoiceReasonData;
  }

  set studentUniversityChoiceReasonData(
    studentUniversityChoiceReasonData: StudentUniversityChoiceReasonData[],
  ) {
    if (!studentUniversityChoiceReasonData) {
      return;
    }

    this.props.studentUniversityChoiceReasonData =
      studentUniversityChoiceReasonData;
  }

  get studentTechnologyData() {
    return this.props.studentTechnologyData;
  }

  set studentTechnologyData(studentTechnologyData: StudentTechnologyData[]) {
    if (!studentTechnologyData) {
      return;
    }

    this.props.studentTechnologyData = studentTechnologyData;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<
      StudentIncomingDataProps,
      | 'createdAt'
      | 'studentAffinityByDisciplineData'
      | 'studentAssetData'
      | 'studentCourseChoiceReasonData'
      | 'studentHobbyOrHabitData'
      | 'studentTechnologyData'
      | 'studentUniversityChoiceReasonData'
    >,
    id?: UniqueEntityId,
  ) {
    const studentIncomingData = new StudentIncomingData(
      {
        ...props,
        studentAffinityByDisciplineData:
          props.studentAffinityByDisciplineData ?? [],
        studentAssetData: props.studentAssetData ?? [],
        studentCourseChoiceReasonData:
          props.studentCourseChoiceReasonData ?? [],
        studentHobbyOrHabitData: props.studentHobbyOrHabitData ?? [],
        studentTechnologyData: props.studentTechnologyData ?? [],
        studentUniversityChoiceReasonData:
          props.studentUniversityChoiceReasonData ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return studentIncomingData;
  }
}
