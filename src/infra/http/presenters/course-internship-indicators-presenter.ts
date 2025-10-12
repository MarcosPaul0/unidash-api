// TODO limpar código

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
            conclusionTimeInDays: currentData.conclusionTimeInDays,
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
            conclusionTimeInDays: currentData.conclusionTimeInDays,
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

      const yearInternships = internshipsByYear.get(year);

      internshipsByConclusionTime[year] = {
        averageTimeInDays: 0,
        maxTimeInDays: 0,
        minTimeInDays: 0,
      };

      yearInternships.forEach((currentData, index) => {
        const cityCount = dataGroupedByCity.get(currentData.city);
        const employmentTypeCount = dataGroupedByEmploymentType.get(
          currentData.employmentType,
        );
        const roleCount = dataGroupedByRole.get(currentData.role);
        const advisorCount = dataGroupedByAdvisor.get(currentData.advisor);

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

        internshipsByConclusionTime[year].averageTimeInDays +=
          currentData.conclusionTimeInDays;

        if (index == 0) {
          internshipsByConclusionTime[year].maxTimeInDays =
            currentData.conclusionTimeInDays;

          internshipsByConclusionTime[year].minTimeInDays =
            currentData.conclusionTimeInDays;
        } else {
          if (
            currentData.conclusionTimeInDays >
            internshipsByConclusionTime[year].maxTimeInDays
          ) {
            internshipsByConclusionTime[year].maxTimeInDays =
              currentData.conclusionTimeInDays;
          }

          if (
            currentData.conclusionTimeInDays <
            internshipsByConclusionTime[year].minTimeInDays
          ) {
            internshipsByConclusionTime[year].minTimeInDays =
              currentData.conclusionTimeInDays;
          }
        }
      });

      internshipsByConclusionTime[year].averageTimeInDays /=
        yearInternships.length;

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
