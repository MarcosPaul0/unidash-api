import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';
import { TeacherTechnicalScientificProductionsData } from '@/domain/entities/teacher-technical-scientific-productions-data';

const TECHNICAL_SCIENTIFIC_PRODUCTIONS_TYPES = [
  'periodicals',
  'congress',
  'booksChapter',
  'programs',
  'abstracts',
];

interface CourseTeachersProductionsIndicatorsParams {
  teacherTechnicalScientificProductionsData: TeacherTechnicalScientificProductionsData[];
  teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData[];
}

export class CourseTeachersProductionsIndicatorsPresenter {
  static toHTTP({
    teacherResearchAndExtensionProjectsData,
    teacherTechnicalScientificProductionsData,
  }: CourseTeachersProductionsIndicatorsParams) {
    const technicalScientificProductionsByTeacher = {};
    const technicalScientificProductionsByType = {};

    teacherTechnicalScientificProductionsData.forEach((data) => {
      const yearDataByTeacher =
        technicalScientificProductionsByTeacher[data.year];
      const yearDataByType = technicalScientificProductionsByType[data.year];

      if (!yearDataByTeacher) {
        const newTeacherYearData = [
          {
            teacherId: data.teacherId,
            teacher: data.teacher!.name,
            periodicals: data.periodicals,
            congress: data.congress,
            booksChapter: data.booksChapter,
            programs: data.programs,
            abstracts: data.abstracts,
          },
        ];

        technicalScientificProductionsByTeacher[data.year] = newTeacherYearData;
      } else {
        const teacherData = yearDataByTeacher.find(
          (data) => data.teacherId == data.teacherId,
        );

        if (teacherData) {
          teacherData.periodicals += data.periodicals;
          teacherData.congress += data.congress;
          teacherData.booksChapter += data.booksChapter;
          teacherData.programs += data.programs;
          teacherData.abstracts += data.abstracts;
        } else {
          yearDataByTeacher.push({
            teacherId: data.teacherId,
            teacher: data.teacher!.name,
            periodicals: data.periodicals,
            congress: data.congress,
            booksChapter: data.booksChapter,
            programs: data.programs,
            abstracts: data.abstracts,
          });
        }
      }

      if (!yearDataByType) {
        const newTypeYearData = TECHNICAL_SCIENTIFIC_PRODUCTIONS_TYPES.map(
          (type) => ({
            type,
            count: data[type],
          }),
        );

        technicalScientificProductionsByType[data.year] = newTypeYearData;
      } else {
        TECHNICAL_SCIENTIFIC_PRODUCTIONS_TYPES.forEach((type) => {
          const technicalScientificProductionsByYear =
            technicalScientificProductionsByType[data.year];

          const target = technicalScientificProductionsByYear.find(
            (typeIndicator) => typeIndicator.type === type,
          );

          target.count += data[type];
        });
      }
    });

    const researchAndExtensionProjectsByTeacher = {};

    teacherResearchAndExtensionProjectsData.forEach((data) => {
      const yearDataByTeacher =
        researchAndExtensionProjectsByTeacher[data.year];

      if (!yearDataByTeacher) {
        const newTeacherYearData = [
          {
            teacherId: data.teacherId,
            teacher: data.teacher!.name,
            extensionProjects: data.extensionProjects,
            researchProjects: data.researchProjects,
          },
        ];

        researchAndExtensionProjectsByTeacher[data.year] = newTeacherYearData;
      } else {
        const teacherData = yearDataByTeacher.find(
          (data) => data.teacherId == data.teacherId,
        );

        if (teacherData) {
          teacherData.extensionProjects += data.extensionProjects;
          teacherData.researchProjects += data.researchProjects;
        } else {
          yearDataByTeacher.push({
            teacherId: data.teacherId,
            teacher: data.teacher!.name,
            periodicals: data.extensionProjects,
            congress: data.researchProjects,
          });
        }
      }
    });

    return {
      technicalScientificProductionsByTeacher,
      technicalScientificProductionsByType,
      researchAndExtensionProjectsByTeacher,
    };
  }
}
