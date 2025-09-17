import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

export class TeacherTechnicalScientificProductionsDataPresenter {
  static toHTTP(
    teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData,
  ) {
    const teacherData = Boolean(
      teacherTechnicalScientificProductionsData?.teacher,
    )
      ? {
          teacherName: teacherTechnicalScientificProductionsData.teacher!.name,
          teacherEmail:
            teacherTechnicalScientificProductionsData.teacher!.email ?? null,
        }
      : {};

    return {
      id: teacherTechnicalScientificProductionsData.id.toString(),
      teacherId: teacherTechnicalScientificProductionsData.teacherId,
      year: teacherTechnicalScientificProductionsData.year,
      semester: teacherTechnicalScientificProductionsData.semester,
      periodicals: teacherTechnicalScientificProductionsData.periodicals,
      congress: teacherTechnicalScientificProductionsData.congress,
      booksChapter: teacherTechnicalScientificProductionsData.booksChapter,
      programs: teacherTechnicalScientificProductionsData.programs,
      abstracts: teacherTechnicalScientificProductionsData.abstracts,
      createdAt: teacherTechnicalScientificProductionsData.createdAt,
      updatedAt: teacherTechnicalScientificProductionsData.updatedAt,
      ...teacherData,
    };
  }
}
