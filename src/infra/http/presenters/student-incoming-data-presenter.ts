import { StudentIncomingData } from '@/domain/entities/student-incoming-data';

export class StudentIncomingDataPresenter {
  static toHTTP(studentIncomingData: StudentIncomingData) {
    return {
      id: studentIncomingData.id.toString(),
      studentId: studentIncomingData.studentId,
      year: studentIncomingData.year,
      semester: studentIncomingData.semester,
      workExpectation: studentIncomingData.workExpectation,
      englishProficiencyLevel: studentIncomingData.englishProficiencyLevel,
      currentEducation: studentIncomingData.currentEducation,
      nocturnalPreference: studentIncomingData.nocturnalPreference,
      knowRelatedCourseDifference:
        studentIncomingData.knowRelatedCourseDifference,
      readPedagogicalProject: studentIncomingData.readPedagogicalProject,
      createdAt: studentIncomingData.createdAt,
      studentAffinityByDisciplineData:
        studentIncomingData.studentAffinityByDisciplineData.map((data) => ({
          affinityLevel: data.affinityLevel,
          discipline: data.discipline,
        })),
      studentHobbyOrHabitData: studentIncomingData.studentHobbyOrHabitData.map(
        (data) => ({
          hobbyOrHabit: data.hobbyOrHabit,
          description: data.description,
        }),
      ),
      studentAssetData: studentIncomingData.studentAssetData.map((data) => ({
        asset: data.asset,
        description: data.description,
      })),
      studentCourseChoiceReasonData:
        studentIncomingData.studentCourseChoiceReasonData.map((data) => ({
          choiceReason: data.choiceReason,
          description: data.description,
        })),
      studentUniversityChoiceReasonData:
        studentIncomingData.studentUniversityChoiceReasonData.map((data) => ({
          choiceReason: data.choiceReason,
          description: data.description,
        })),
      studentTechnologyData: studentIncomingData.studentTechnologyData.map(
        (data) => ({
          technology: data.technology,
          description: data.description,
        }),
      ),
    };
  }
}
