import { AFFINITY_LEVEL } from '@/domain/entities/student-affinity-by-discipline-data';
import { StudentIncomingData } from '@/domain/entities/student-incoming-data';

interface CourseStudentIncomingIndicatorsParams {
  studentIncomingData: StudentIncomingData[];
}

export class CourseStudentIncomingIndicatorsPresenter {
  static toHTTP({
    studentIncomingData,
  }: CourseStudentIncomingIndicatorsParams) {
    const studentIncomingByCity = {};
    const studentIncomingByEnglishProficiencyLevel = {};
    const studentIncomingByCurrentEducation = {};
    const studentIncomingByWorkExpectation = {};
    const studentIncomingByCourseComplements = {};
    const studentIncomingByAffinityByDiscipline = {};
    const studentIncomingByAsset = {};
    const studentIncomingByCourseChoiceReason = {};
    const studentIncomingByHobbyOrHabit = {};
    const studentIncomingByTechnology = {};
    const studentIncomingByUniversityChoiceReason = {};

    studentIncomingData.forEach((data) => {
      const yearCity = studentIncomingByCity[data.year];

      if (!yearCity) {
        const newYearCity = [
          {
            city: data.city?.name,
            cityId: data.city?.id.toString(),
            count: 1,
          },
        ];

        studentIncomingByCity[data.year] = newYearCity;
      } else {
        const cityData = yearCity.find((data) => data.cityId === data.cityId);

        if (cityData) {
          cityData.count += 1;
        } else {
          yearCity.push({
            city: data.city?.name,
            cityId: data.city?.id.toString(),
            count: 1,
          });
        }
      }

      const yearWorkExpectation = studentIncomingByWorkExpectation[data.year];

      if (!yearWorkExpectation) {
        const newYearWorkExpectation = [
          {
            type: data.workExpectation,
            count: 1,
          },
        ];

        studentIncomingByWorkExpectation[data.year] = newYearWorkExpectation;
      } else {
        const workExpectationData = yearWorkExpectation.find(
          (data) => data.type === data.workExpectation,
        );

        if (workExpectationData) {
          workExpectationData.count += 1;
        } else {
          yearWorkExpectation.push({
            type: data.workExpectation,
            count: 1,
          });
        }
      }

      const yearCurrentEducation = studentIncomingByCurrentEducation[data.year];

      if (!yearCurrentEducation) {
        const newYearCurrentEducation = [
          {
            type: data.currentEducation,
            count: 1,
          },
        ];

        studentIncomingByCurrentEducation[data.year] = newYearCurrentEducation;
      } else {
        const currentEducationData = yearCurrentEducation.find(
          (data) => data.type === data.currentEducation,
        );

        if (currentEducationData) {
          currentEducationData.count += 1;
        } else {
          yearCurrentEducation.push({
            type: data.currentEducation,
            count: 1,
          });
        }
      }

      const yearEnglishProficiencyLevel =
        studentIncomingByEnglishProficiencyLevel[data.year];

      if (!yearEnglishProficiencyLevel) {
        const newYearEnglishProficiencyLevel = [
          {
            englishLevel: data.englishProficiencyLevel,
            count: 1,
          },
        ];

        studentIncomingByEnglishProficiencyLevel[data.year] =
          newYearEnglishProficiencyLevel;
      } else {
        const englishProficiencyLevelData = yearEnglishProficiencyLevel.find(
          (data) => data.englishLevel === data.englishProficiencyLevel,
        );

        if (englishProficiencyLevelData) {
          englishProficiencyLevelData.count += 1;
        } else {
          yearEnglishProficiencyLevel.push({
            englishLevel: data.englishProficiencyLevel,
            count: 1,
          });
        }
      }

      const yearCourseComplements =
        studentIncomingByCourseComplements[data.year];

      if (!yearCourseComplements) {
        const newYearCourseComplements = [
          {
            question: 'knowRelatedCourseDifference',
            yes: data.knowRelatedCourseDifference ? 1 : 0,
            no: data.knowRelatedCourseDifference ? 0 : 1,
          },
          {
            question: 'nocturnalPreference',
            yes: data.nocturnalPreference ? 1 : 0,
            no: data.nocturnalPreference ? 0 : 1,
          },
          {
            question: 'readPedagogicalProject',
            yes: data.readPedagogicalProject ? 1 : 0,
            no: data.readPedagogicalProject ? 0 : 1,
          },
        ];

        studentIncomingByCourseComplements[data.year] =
          newYearCourseComplements;
      } else {
        yearCourseComplements[0].yes += data.knowRelatedCourseDifference
          ? 1
          : 0;
        yearCourseComplements[0].no += data.knowRelatedCourseDifference ? 0 : 1;

        yearCourseComplements[1].yes += data.nocturnalPreference ? 1 : 0;
        yearCourseComplements[1].no += data.nocturnalPreference ? 0 : 1;

        yearCourseComplements[2].yes += data.readPedagogicalProject ? 1 : 0;
        yearCourseComplements[2].no += data.readPedagogicalProject ? 0 : 1;
      }

      const yearAffinityByDiscipline =
        studentIncomingByAffinityByDiscipline[data.year];

      if (!yearAffinityByDiscipline) {
        const newAffinityByDiscipline =
          data.studentAffinityByDisciplineData.map(
            (affinityByDisciplineData) => ({
              discipline: affinityByDisciplineData.discipline,
              high:
                affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.high
                  ? 1
                  : 0,
              medium:
                affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.medium
                  ? 1
                  : 0,
              low:
                affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.low
                  ? 1
                  : 0,
            }),
          );

        studentIncomingByAffinityByDiscipline[data.year] =
          newAffinityByDiscipline;
      } else {
        data.studentAffinityByDisciplineData.forEach(
          (affinityByDisciplineData) => {
            const yearDisciplineData = yearAffinityByDiscipline.find(
              (yearData) =>
                yearData.discipline === affinityByDisciplineData.discipline,
            );

            if (yearDisciplineData) {
              yearDisciplineData.high +=
                affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.high
                  ? 1
                  : 0;
              yearDisciplineData.medium +=
                affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.medium
                  ? 1
                  : 0;
              yearDisciplineData.low +=
                affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.low
                  ? 1
                  : 0;
            } else {
              yearAffinityByDiscipline.push({
                discipline: affinityByDisciplineData.discipline,
                high:
                  affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.high
                    ? 1
                    : 0,
                medium:
                  affinityByDisciplineData.affinityLevel ===
                  AFFINITY_LEVEL.medium
                    ? 1
                    : 0,
                low:
                  affinityByDisciplineData.affinityLevel === AFFINITY_LEVEL.low
                    ? 1
                    : 0,
              });
            }
          },
        );
      }

      const yearAsset = studentIncomingByAsset[data.year];

      if (!yearAsset) {
        const newAsset = data.studentAssetData.map((assetData) => ({
          asset: assetData.asset,
          count: 1,
        }));

        studentIncomingByAsset[data.year] = newAsset;
      } else {
        data.studentAssetData.forEach((assetData) => {
          const yearAssetData = yearAsset.find(
            (yearData) => yearData.asset === assetData.asset,
          );

          if (yearAssetData) {
            yearAssetData.count += 1;
          } else {
            yearAsset.push({
              asset: assetData.asset,
              count: 1,
            });
          }
        });
      }

      const yearCourseChoiceReason =
        studentIncomingByCourseChoiceReason[data.year];

      if (!yearCourseChoiceReason) {
        const newCourseChoiceReason = data.studentCourseChoiceReasonData.map(
          (courseChoiceReasonData) => ({
            choiceReason: courseChoiceReasonData.choiceReason,
            count: 1,
          }),
        );

        studentIncomingByCourseChoiceReason[data.year] = newCourseChoiceReason;
      } else {
        data.studentCourseChoiceReasonData.forEach((courseChoiceReasonData) => {
          const yearCourseChoiceReasonData = yearCourseChoiceReason.find(
            (yearData) =>
              yearData.choiceReason === courseChoiceReasonData.choiceReason,
          );

          if (yearCourseChoiceReasonData) {
            yearCourseChoiceReasonData.count += 1;
          } else {
            yearCourseChoiceReason.push({
              choiceReason: courseChoiceReasonData.choiceReason,
              count: 1,
            });
          }
        });
      }

      const yearHobbyOrHabit = studentIncomingByHobbyOrHabit[data.year];

      if (!yearHobbyOrHabit) {
        const newHobbyOrHabit = data.studentHobbyOrHabitData.map(
          (hobbyOrHabitData) => ({
            hobbyOrHabit: hobbyOrHabitData.hobbyOrHabit,
            count: 1,
          }),
        );

        studentIncomingByHobbyOrHabit[data.year] = newHobbyOrHabit;
      } else {
        data.studentHobbyOrHabitData.forEach((hobbyOrHabitData) => {
          const yearHobbyOrHabitData = yearHobbyOrHabit.find(
            (yearData) =>
              yearData.hobbyOrHabit === hobbyOrHabitData.hobbyOrHabit,
          );

          if (yearHobbyOrHabitData) {
            yearHobbyOrHabitData.count += 1;
          } else {
            yearHobbyOrHabit.push({
              hobbyOrHabit: hobbyOrHabitData.hobbyOrHabit,
              count: 1,
            });
          }
        });
      }

      const yearTechnology = studentIncomingByTechnology[data.year];

      if (!yearTechnology) {
        const newTechnology = data.studentTechnologyData.map(
          (technologyData) => ({
            technology: technologyData.technology,
            count: 1,
          }),
        );

        studentIncomingByTechnology[data.year] = newTechnology;
      } else {
        data.studentTechnologyData.forEach((technologyData) => {
          const yearTechnologyData = yearTechnology.find(
            (yearData) => yearData.Technology === technologyData.technology,
          );

          if (yearTechnologyData) {
            yearTechnologyData.count += 1;
          } else {
            yearTechnology.push({
              technology: technologyData.technology,
              count: 1,
            });
          }
        });
      }

      const yearUniversityChoiceReason =
        studentIncomingByUniversityChoiceReason[data.year];

      if (!yearUniversityChoiceReason) {
        const newUniversityChoiceReason =
          data.studentUniversityChoiceReasonData.map(
            (UniversityChoiceReasonData) => ({
              choiceReason: UniversityChoiceReasonData.choiceReason,
              count: 1,
            }),
          );

        studentIncomingByUniversityChoiceReason[data.year] =
          newUniversityChoiceReason;
      } else {
        data.studentUniversityChoiceReasonData.forEach(
          (UniversityChoiceReasonData) => {
            const yearUniversityChoiceReasonData =
              yearUniversityChoiceReason.find(
                (yearData) =>
                  yearData.choiceReason ===
                  UniversityChoiceReasonData.choiceReason,
              );

            if (yearUniversityChoiceReasonData) {
              yearUniversityChoiceReasonData.count += 1;
            } else {
              yearUniversityChoiceReason.push({
                choiceReason: UniversityChoiceReasonData.choiceReason,
                count: 1,
              });
            }
          },
        );
      }
    });

    return {
      studentIncomingByCity,
      studentIncomingByEnglishProficiencyLevel,
      studentIncomingByCurrentEducation,
      studentIncomingByWorkExpectation,
      studentIncomingByCourseComplements,
      studentIncomingByAffinityByDiscipline,
      studentIncomingByAsset,
      studentIncomingByCourseChoiceReason,
      studentIncomingByHobbyOrHabit,
      studentIncomingByTechnology,
      studentIncomingByUniversityChoiceReason,
    };
  }
}
