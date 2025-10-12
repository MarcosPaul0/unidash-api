// TODO limpar código

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
    const studentIncomingByUniversityChoiceReason = {};
    const studentIncomingByHobbyOrHabit = {};
    const studentIncomingByTechnology = {};
    const studentIncomingCourseAndUniversityChoiceDistribution = {};

    studentIncomingData.forEach((data) => {
      const yearCity = studentIncomingByCity[data.year];

      const cityId = data.city?.id.toString();

      if (!yearCity) {
        const newYearCity = [
          {
            city: data.city?.name,
            cityId,
            count: 1,
          },
        ];

        studentIncomingByCity[data.year] = newYearCity;
      } else {
        const cityData = yearCity.find(
          (currentData) => currentData.cityId === cityId,
        );

        if (cityData) {
          cityData.count += 1;
        } else {
          yearCity.push({
            city: data.city?.name,
            cityId,
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
          (currentData) => currentData.type === data.workExpectation,
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
          (currentData) => currentData.type === data.currentEducation,
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
          (currentData) =>
            currentData.englishLevel === data.englishProficiencyLevel,
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
              (currentData) =>
                currentData.discipline === affinityByDisciplineData.discipline,
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
            (currentData) => currentData.asset === assetData.asset,
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
            (currentData) =>
              currentData.hobbyOrHabit === hobbyOrHabitData.hobbyOrHabit,
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
            (currentData) =>
              currentData.technology === technologyData.technology,
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

      const yearStudentIncomingChoiceDistribution =
        studentIncomingCourseAndUniversityChoiceDistribution[data.year];

      if (!yearStudentIncomingChoiceDistribution) {
        studentIncomingCourseAndUniversityChoiceDistribution[data.year] = {
          universityAndCourseIsNotFirstChoice: 0,
          universityIsNotFirstChoice: 0,
          courseIsNotFirstChoice: 0,
          universityAndCourseIsFirstChoice: 0,
        };
      }

      const yearCourseChoiceReason =
        studentIncomingByCourseChoiceReason[data.year];

      let courseIsNotFirstChoice = false;

      if (!yearCourseChoiceReason) {
        const newCourseChoiceReason = data.studentCourseChoiceReasonData.map(
          (courseChoiceReasonData) => {
            if (courseChoiceReasonData.choiceReason === 'notFirstChoice') {
              courseIsNotFirstChoice = true;
            }

            return {
              choiceReason: courseChoiceReasonData.choiceReason,
              count: 1,
            };
          },
        );

        studentIncomingByCourseChoiceReason[data.year] = newCourseChoiceReason;
      } else {
        data.studentCourseChoiceReasonData.forEach((courseChoiceReasonData) => {
          if (courseChoiceReasonData.choiceReason === 'notFirstChoice') {
            courseIsNotFirstChoice = true;
          }

          const yearCourseChoiceReasonData = yearCourseChoiceReason.find(
            (currentData) =>
              currentData.choiceReason === courseChoiceReasonData.choiceReason,
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

      const yearUniversityChoiceReason =
        studentIncomingByUniversityChoiceReason[data.year];

      let universityIsNotFirstChoice = false;

      if (!yearUniversityChoiceReason) {
        const newUniversityChoiceReason =
          data.studentUniversityChoiceReasonData.map(
            (universityChoiceReasonData) => {
              if (
                universityChoiceReasonData.choiceReason === 'notFirstChoice'
              ) {
                universityIsNotFirstChoice = true;
              }

              return {
                choiceReason: universityChoiceReasonData.choiceReason,
                count: 1,
              };
            },
          );

        studentIncomingByUniversityChoiceReason[data.year] =
          newUniversityChoiceReason;
      } else {
        data.studentUniversityChoiceReasonData.forEach(
          (universityChoiceReasonData) => {
            if (universityChoiceReasonData.choiceReason === 'notFirstChoice') {
              universityIsNotFirstChoice = true;
            }

            const yearUniversityChoiceReasonData =
              yearUniversityChoiceReason.find(
                (currentData) =>
                  currentData.choiceReason ===
                  universityChoiceReasonData.choiceReason,
              );

            if (yearUniversityChoiceReasonData) {
              yearUniversityChoiceReasonData.count += 1;
            } else {
              yearUniversityChoiceReason.push({
                choiceReason: universityChoiceReasonData.choiceReason,
                count: 1,
              });
            }
          },
        );
      }

      if (courseIsNotFirstChoice && universityIsNotFirstChoice) {
        studentIncomingCourseAndUniversityChoiceDistribution[
          data.year
        ].universityAndCourseIsNotFirstChoice += 1;
      } else if (courseIsNotFirstChoice) {
        studentIncomingCourseAndUniversityChoiceDistribution[
          data.year
        ].courseIsNotFirstChoice += 1;
      } else if (universityIsNotFirstChoice) {
        studentIncomingCourseAndUniversityChoiceDistribution[
          data.year
        ].universityIsNotFirstChoice += 1;
      } else {
        studentIncomingCourseAndUniversityChoiceDistribution[
          data.year
        ].universityAndCourseIsFirstChoice += 1;
      }
    });

    const years = Object.keys(studentIncomingByAsset);

    years.forEach((year) => {
      studentIncomingByCourseChoiceReason[year].sort(
        (first, second) => second.count - first.count,
      );
      studentIncomingByUniversityChoiceReason[year].sort(
        (first, second) => second.count - first.count,
      );
      studentIncomingByTechnology[year].sort(
        (first, second) => second.count - first.count,
      );
      studentIncomingByHobbyOrHabit[year].sort(
        (first, second) => second.count - first.count,
      );
      studentIncomingByAsset[year].sort(
        (first, second) => second.count - first.count,
      );

      studentIncomingCourseAndUniversityChoiceDistribution[year] =
        Object.entries(
          studentIncomingCourseAndUniversityChoiceDistribution[year],
        ).map(([key, value]) => ({
          count: value,
          choiceClassification: key,
        }));
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
      studentIncomingCourseAndUniversityChoiceDistribution,
    };
  }
}
