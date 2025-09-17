import {
  StudentIncomingData as PrismaStudentIncomingData,
  StudentAffinityByDisciplineData as PrismaStudentAffinityByDisciplineData,
  StudentHobbyOrHabitData as PrismaStudentHobbyOrHabitData,
  StudentAssetData as PrismaStudentAssetData,
  StudentCourseChoiceReasonData as PrismaStudentCourseChoiceReasonData,
  StudentUniversityChoiceReasonData as PrismaStudentUniversityChoiceReasonData,
  StudentTechnologyData as PrismaStudentTechnologyData,
  StudentHobbyOrHabit as PrismaStudentHobbyOrHabit,
  StudentAsset as PrismaStudentAsset,
  StudentCourseChoiceReason as PrismaStudentCourseChoiceReason,
  StudentUniversityChoiceReason as PrismaStudentUniversityChoiceReason,
  StudentTechnology as PrismaStudentTechnology,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { StudentIncomingData } from '@/domain/entities/student-incoming-data';
import { StudentAffinityByDisciplineData } from '@/domain/entities/student-affinity-by-discipline-data';
import { StudentHobbyOrHabitData } from '@/domain/entities/student-hobby-or-habit-data';
import { StudentAssetData } from '@/domain/entities/student-asset-data';
import { StudentCourseChoiceReasonData } from '@/domain/entities/student-course-choice-reason-data';
import { StudentUniversityChoiceReasonData } from '@/domain/entities/student-university-choice-reason-data';
import { StudentTechnologyData } from '@/domain/entities/student-technology-data';

type PrismaStudentHobbyOrHabitFullData = PrismaStudentHobbyOrHabitData & {
  studentHobbyOrHabit: PrismaStudentHobbyOrHabit;
};

type PrismaStudentAssetFullData = PrismaStudentAssetData & {
  studentAsset: PrismaStudentAsset;
};

type PrismaStudentCourseChoiceReasonFullData =
  PrismaStudentCourseChoiceReasonData & {
    studentCourseChoiceReason: PrismaStudentCourseChoiceReason;
  };

type PrismaStudentUniversityChoiceReasonFullData =
  PrismaStudentUniversityChoiceReasonData & {
    studentUniversityChoiceReason: PrismaStudentUniversityChoiceReason;
  };

type PrismaStudentTechnologyFullData = PrismaStudentTechnologyData & {
  studentTechnology: PrismaStudentTechnology;
};

type PrismaStudentIncomingFullDataWithTeacher = PrismaStudentIncomingData & {
  studentAffinityByDisciplineData: PrismaStudentAffinityByDisciplineData[];
  studentHobbyOrHabitData: PrismaStudentHobbyOrHabitFullData[];
  studentAssetData: PrismaStudentAssetFullData[];
  studentCourseChoiceReasonData: PrismaStudentCourseChoiceReasonFullData[];
  studentUniversityChoiceReasonData: PrismaStudentUniversityChoiceReasonFullData[];
  studentTechnologyData: PrismaStudentTechnologyFullData[];
};

export class PrismaStudentIncomingDataMapper {
  static toDomain(raw: PrismaStudentIncomingData): StudentIncomingData {
    return StudentIncomingData.create(
      {
        studentId: raw.studentId,
        workExpectation: raw.workExpectation,
        currentEducation: raw.currentEducation,
        englishProficiencyLevel: raw.englishProficiencyLevel,
        year: raw.year,
        createdAt: raw.createdAt,
        knowRelatedCourseDifference: raw.knowRelatedCourseDifference,
        nocturnalPreference: raw.nocturnalPreference,
        readPedagogicalProject: raw.readPedagogicalProject,
        semester: raw.semester,
        studentAffinityByDisciplineData: [],
        studentHobbyOrHabitData: [],
        studentAssetData: [],
        studentCourseChoiceReasonData: [],
        studentUniversityChoiceReasonData: [],
        studentTechnologyData: [],
      },
      new UniqueEntityId(raw.id),
    );
  }

  static fullToDomain(
    raw: PrismaStudentIncomingFullDataWithTeacher,
  ): StudentIncomingData {
    return StudentIncomingData.create(
      {
        studentId: raw.studentId,
        workExpectation: raw.workExpectation,
        currentEducation: raw.currentEducation,
        englishProficiencyLevel: raw.englishProficiencyLevel,
        year: raw.year,
        createdAt: raw.createdAt,
        knowRelatedCourseDifference: raw.knowRelatedCourseDifference,
        nocturnalPreference: raw.nocturnalPreference,
        readPedagogicalProject: raw.readPedagogicalProject,
        semester: raw.semester,
        studentAffinityByDisciplineData:
          raw.studentAffinityByDisciplineData.map((data) =>
            StudentAffinityByDisciplineData.create(
              {
                affinityLevel: data.affinityLevel,
                discipline: data.discipline,
                studentIncomingDataId: data.studentIncomingDataId,
              },
              new UniqueEntityId(data.id),
            ),
          ),
        studentHobbyOrHabitData: raw.studentHobbyOrHabitData.map((data) =>
          StudentHobbyOrHabitData.create(
            {
              description: data.studentHobbyOrHabit.description,
              hobbyOrHabit: data.studentHobbyOrHabit.hobbyOrHabit,
              studentIncomingDataId: data.studentIncomingDataId,
            },
            new UniqueEntityId(data.id),
          ),
        ),
        studentAssetData: raw.studentAssetData.map((data) =>
          StudentAssetData.create(
            {
              description: data.studentAsset.description,
              asset: data.studentAsset.asset,
              studentIncomingDataId: data.studentIncomingDataId,
            },
            new UniqueEntityId(data.id),
          ),
        ),
        studentCourseChoiceReasonData: raw.studentCourseChoiceReasonData.map(
          (data) =>
            StudentCourseChoiceReasonData.create(
              {
                description: data.studentCourseChoiceReason.description,
                choiceReason: data.studentCourseChoiceReason.choiceReason,
                studentIncomingDataId: data.studentIncomingDataId,
              },
              new UniqueEntityId(data.id),
            ),
        ),
        studentUniversityChoiceReasonData:
          raw.studentUniversityChoiceReasonData.map((data) =>
            StudentUniversityChoiceReasonData.create(
              {
                description: data.studentUniversityChoiceReason.description,
                choiceReason: data.studentUniversityChoiceReason.choiceReason,
                studentIncomingDataId: data.studentIncomingDataId,
              },
              new UniqueEntityId(data.id),
            ),
          ),
        studentTechnologyData: raw.studentTechnologyData.map((data) =>
          StudentTechnologyData.create(
            {
              description: data.studentTechnology.description,
              technology: data.studentTechnology.technology,
              studentIncomingDataId: data.studentIncomingDataId,
            },
            new UniqueEntityId(data.id),
          ),
        ),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    studentIncomingData: StudentIncomingData,
  ): Prisma.StudentIncomingDataUncheckedCreateInput {
    return {
      knowRelatedCourseDifference:
        studentIncomingData.knowRelatedCourseDifference,
      nocturnalPreference: studentIncomingData.nocturnalPreference,
      readPedagogicalProject: studentIncomingData.readPedagogicalProject,
      studentId: studentIncomingData.studentId,
      workExpectation: studentIncomingData.workExpectation,
      year: studentIncomingData.year,
      currentEducation: studentIncomingData.currentEducation,
      englishProficiencyLevel: studentIncomingData.englishProficiencyLevel,
    };
  }
}
