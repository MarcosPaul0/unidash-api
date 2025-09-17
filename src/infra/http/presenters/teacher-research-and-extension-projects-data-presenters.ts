import { TeacherResearchAndExtensionProjectsData } from '@/domain/entities/teacher-research-and-extension-projects-data';

export class TeacherResearchAndExtensionProjectsDataPresenter {
  static toHTTP(
    teacherResearchAndExtensionProjectsData: TeacherResearchAndExtensionProjectsData,
  ) {
    const teacherData = Boolean(
      teacherResearchAndExtensionProjectsData?.teacher,
    )
      ? {
          teacherName: teacherResearchAndExtensionProjectsData.teacher!.name,
          teacherEmail:
            teacherResearchAndExtensionProjectsData.teacher!.email ?? null,
        }
      : {};

    return {
      id: teacherResearchAndExtensionProjectsData.id.toString(),
      teacherId: teacherResearchAndExtensionProjectsData.teacherId,
      year: teacherResearchAndExtensionProjectsData.year,
      semester: teacherResearchAndExtensionProjectsData.semester,
      extensionProjects:
        teacherResearchAndExtensionProjectsData.extensionProjects,
      researchProjects:
        teacherResearchAndExtensionProjectsData.researchProjects,
      createdAt: teacherResearchAndExtensionProjectsData.createdAt,
      updatedAt: teacherResearchAndExtensionProjectsData.updatedAt,
      ...teacherData,
    };
  }
}
