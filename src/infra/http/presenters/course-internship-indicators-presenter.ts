import { CourseInternshipData } from '@/domain/entities/course-internship-data';

interface CourseInternshipIndicatorsParams {
  courseInternshipData: CourseInternshipData[];
}

export class CourseInternshipIndicatorsPresenter {
  static toHTTP({ courseInternshipData }: CourseInternshipIndicatorsParams) {
    const internshipsByYear = new Map();

    courseInternshipData.forEach((currentData) => {
      const yearData = internshipsByYear.get(currentData.year);

      if (yearData) {
        internshipsByYear.set(currentData.year, [
          ...yearData,
          {
            enterpriseCnpj: currentData.enterpriseCnpj,
            role: currentData.role,
            employmentType: currentData.employmentType,
            conclusionTime: currentData.conclusionTime,
            city: currentData.city!.name,
            advisorId: currentData.advisorId,
            advisor: currentData.advisor!.name,
          },
        ]);
      } else {
        internshipsByYear.set(currentData.year, [
          {
            enterpriseCnpj: currentData.enterpriseCnpj,
            role: currentData.role,
            conclusionTime: currentData.conclusionTime,
            employmentType: currentData.employmentType,
            city: currentData.city!.name,
            advisorId: currentData.advisorId,
            advisor: currentData.advisor!.name,
          },
        ]);
      }
    });

    const internshipsByCity = {};
    const internshipsByEmploymentType = {};
    const internshipsByRole = {};
    const internshipsByAdvisor = {};
    const internshipsByConclusionTime = {};

    Array.from(internshipsByYear.keys()).forEach((year) => {
      const dataGroupedByCity = new Map();
      const dataGroupedByEmploymentType = new Map();
      const dataGroupedByRole = new Map();
      const dataGroupedByAdvisor = new Map();
      const dataGroupedByConclusionTime = new Map();

      const yearInternships = internshipsByYear.get(year);

      yearInternships.forEach((currentData) => {
        const cityCount = dataGroupedByCity.get(currentData.city);
        const employmentTypeCount = dataGroupedByEmploymentType.get(
          currentData.employmentType,
        );
        const roleCount = dataGroupedByRole.get(currentData.role);
        const advisorCount = dataGroupedByAdvisor.get(currentData.advisor);
        const conclusionTimeCount = dataGroupedByConclusionTime.get(
          currentData.conclusionTime,
        );

        if (cityCount) {
          dataGroupedByCity.set(currentData.city, cityCount + 1);
        } else {
          dataGroupedByCity.set(currentData.city, 1);
        }

        if (employmentTypeCount) {
          dataGroupedByEmploymentType.set(
            currentData.employmentType,
            employmentTypeCount + 1,
          );
        } else {
          dataGroupedByEmploymentType.set(currentData.employmentType, 1);
        }

        if (roleCount) {
          dataGroupedByRole.set(currentData.role, roleCount + 1);
        } else {
          dataGroupedByRole.set(currentData.role, 1);
        }

        if (advisorCount) {
          dataGroupedByAdvisor.set(currentData.advisor, advisorCount + 1);
        } else {
          dataGroupedByAdvisor.set(currentData.advisor, 1);
        }

        if (conclusionTimeCount) {
          dataGroupedByConclusionTime.set(
            currentData.conclusionTime,
            conclusionTimeCount + 1,
          );
        } else {
          dataGroupedByConclusionTime.set(currentData.conclusionTime, 1);
        }
      });

      internshipsByCity[year] = Array.from(dataGroupedByCity.keys()).map(
        (city) => ({ city, count: dataGroupedByCity.get(city) }),
      );

      internshipsByEmploymentType[year] = Array.from(
        dataGroupedByEmploymentType.keys(),
      ).map((employmentType) => ({
        employmentType,
        count: dataGroupedByEmploymentType.get(employmentType),
      }));

      internshipsByRole[year] = Array.from(dataGroupedByRole.keys()).map(
        (role) => ({ role, count: dataGroupedByRole.get(role) }),
      );

      internshipsByAdvisor[year] = Array.from(dataGroupedByAdvisor.keys()).map(
        (advisor) => ({
          advisor,
          count: dataGroupedByAdvisor.get(advisor),
        }),
      );

      internshipsByConclusionTime[year] = Object.fromEntries(
        dataGroupedByConclusionTime,
      );
    });

    return {
      internshipsByCity,
      internshipsByRole,
      internshipsByEmploymentType,
      internshipsByAdvisor,
      internshipsByConclusionTime,
    };
  }
}
