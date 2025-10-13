// TODO limpar código

import { CourseExtensionActivitiesData } from '@/domain/entities/course-extension-activities-data';
import { CourseExtensionComplementaryActivitiesData } from '@/domain/entities/course-extension-complementary-activities-data';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';
import { CourseTeachingComplementaryActivitiesData } from '@/domain/entities/course-teaching-complementary-activities-data';

type CourseActivitiesIndicatorsParams = {
  courseTeachingComplementaryActivitiesData: CourseTeachingComplementaryActivitiesData[];
  courseExtensionComplementaryActivitiesData: CourseExtensionComplementaryActivitiesData[];
  courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData[];
  courseExtensionActivitiesData: CourseExtensionActivitiesData[];
};

const EXTENSION_COMPLEMENTARY_ACTIVITIES_TYPES = [
  'culturalActivities',
  'sportsCompetitions',
  'awardsAtEvents',
  'studentRepresentation',
  'participationInCollegiateBodies',
];

const SEARCH_COMPLEMENTARY_ACTIVITIES_TYPES = [
  'scientificInitiation',
  'developmentInitiation',
  'publishedArticles',
  'fullPublishedArticles',
  'publishedAbstracts',
  'presentationOfWork',
  'participationInEvents',
];

const TEACHING_COMPLEMENTARY_ACTIVITIES_TYPES = [
  'subjectMonitoring',
  'sponsorshipOfNewStudents',
  'providingTraining',
  'coursesInTheArea',
  'coursesOutsideTheArea',
  'electivesDisciplines',
  'complementaryCoursesInTheArea',
  'preparationForTest',
];

const EXTENSION_ACTIVITIES_TYPES = [
  'specialProjects',
  'participationInCompetitions',
  'entrepreneurshipAndInnovation',
  'eventOrganization',
  'externalInternship',
  'cultureAndExtensionProjects',
  'semiannualProjects',
  'workNonGovernmentalOrganization',
  'juniorCompanies',
  'provisionOfServicesWithSelfEmployedWorkers',
];

export class CourseActivitiesIndicatorsPresenter {
  static toHTTP({
    courseExtensionActivitiesData,
    courseExtensionComplementaryActivitiesData,
    courseSearchComplementaryActivitiesData,
    courseTeachingComplementaryActivitiesData,
  }: CourseActivitiesIndicatorsParams) {
    const extensionActivities = {};

    courseExtensionActivitiesData.forEach((data) => {
      const yearData = extensionActivities[data.year];

      if (!yearData) {
        const newYearData = EXTENSION_ACTIVITIES_TYPES.map((type) => ({
          type,
          firstSemester: 0,
          secondSemester: 0,
          total: 0,
        }));

        extensionActivities[data.year] = {
          total: 0,
          data: newYearData,
        };
      }

      EXTENSION_ACTIVITIES_TYPES.forEach((type) => {
        const extensionActivitiesByYear = extensionActivities[data.year].data;

        const target = extensionActivitiesByYear.find(
          (typeIndicator) => typeIndicator.type === type,
        );

        if (data.semester === 'first') {
          target.firstSemester += data[type] as number;
        } else {
          target.secondSemester += data[type] as number;
        }

        target.total += data[type] as number;
        extensionActivities[data.year].total += data[type] as number;
      });
    });

    const extensionComplementaryActivities = {};

    courseExtensionComplementaryActivitiesData.forEach((data) => {
      const yearData = extensionComplementaryActivities[data.year];

      if (!yearData) {
        const newYearData = EXTENSION_COMPLEMENTARY_ACTIVITIES_TYPES.map(
          (type) => ({
            type,
            firstSemester: 0,
            secondSemester: 0,
            total: 0,
          }),
        );

        extensionComplementaryActivities[data.year] = {
          total: 0,
          data: newYearData,
        };
      }

      EXTENSION_COMPLEMENTARY_ACTIVITIES_TYPES.forEach((type) => {
        const extensionComplementaryActivitiesByYear =
          extensionComplementaryActivities[data.year].data;

        const target = extensionComplementaryActivitiesByYear.find(
          (typeIndicator) => typeIndicator.type === type,
        );

        if (data.semester === 'first') {
          target.firstSemester += data[type] as number;
        } else {
          target.secondSemester += data[type] as number;
        }

        target.total += data[type] as number;
        extensionComplementaryActivities[data.year].total += data[
          type
        ] as number;
      });
    });

    const teachingComplementaryActivities = {};

    courseTeachingComplementaryActivitiesData.forEach((data) => {
      const yearData = teachingComplementaryActivities[data.year];

      if (!yearData) {
        const newYearData = TEACHING_COMPLEMENTARY_ACTIVITIES_TYPES.map(
          (type) => ({
            type,
            firstSemester: 0,
            secondSemester: 0,
            total: 0,
          }),
        );

        teachingComplementaryActivities[data.year] = {
          total: 0,
          data: newYearData,
        };
      }

      TEACHING_COMPLEMENTARY_ACTIVITIES_TYPES.forEach((type) => {
        const teachingComplementaryActivitiesByYear =
          teachingComplementaryActivities[data.year].data;
        const target = teachingComplementaryActivitiesByYear.find(
          (typeIndicator) => typeIndicator.type === type,
        );

        if (data.semester === 'first') {
          target.firstSemester += data[type] as number;
        } else {
          target.secondSemester += data[type] as number;
        }

        target.total += data[type] as number;
        teachingComplementaryActivities[data.year].total += data[type];
      });
    });

    const searchComplementaryActivities = {};

    courseSearchComplementaryActivitiesData.forEach((data) => {
      const yearData = searchComplementaryActivities[data.year];

      if (!yearData) {
        const newYearData = SEARCH_COMPLEMENTARY_ACTIVITIES_TYPES.map(
          (type) => ({
            type,
            firstSemester: 0,
            secondSemester: 0,
            total: 0,
          }),
        );

        searchComplementaryActivities[data.year] = {
          total: 0,
          data: newYearData,
        };
      }

      SEARCH_COMPLEMENTARY_ACTIVITIES_TYPES.forEach((type) => {
        const searchComplementaryActivitiesByYear =
          searchComplementaryActivities[data.year].data;

        const target = searchComplementaryActivitiesByYear.find(
          (typeIndicator) => typeIndicator.type === type,
        );

        if (data.semester === 'first') {
          target.firstSemester += data[type] as number;
        } else {
          target.secondSemester += data[type] as number;
        }

        target.total += data[type] as number;
        searchComplementaryActivities[data.year].total += data[type];
      });
    });

    return {
      extensionActivities,
      extensionComplementaryActivities,
      searchComplementaryActivities,
      teachingComplementaryActivities,
    };
  }
}
