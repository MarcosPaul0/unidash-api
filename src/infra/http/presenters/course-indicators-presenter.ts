import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseStudentsData } from '@/domain/entities/course-students-data';

type CourseIndicatorsParams = {
  courseRegistrationLockData: CourseRegistrationLockData[];
  courseStudentsData: CourseStudentsData[];
  courseDepartureData: CourseDepartureData[];
};

/*
  {
    2025: [
      {
        type: 'cancelado',
        firstSemester: 12,
        secondSemester: 12,
      },
      {
        type: 'abandono',
        firstSemester: 15,
        secondSemester: 18,
      },
    ],
    2024: [
      {
        type: 'cancelado',
        firstSemester: 12,
        secondSemester: 12,
      },
      {
        type: 'abandono',
        firstSemester: 15,
        secondSemester: 18,
      },
    ]
  }

*/

const DEPARTURE_TYPES = [
  'completed',
  'maximumDuration',
  'dropouts',
  'transfers',
  'withdrawals',
  'removals',
  'newExams',
  'deaths',
];

const REGISTRATION_LOCK_TYPES = [
  'difficultyInDiscipline',
  'workload',
  'teacherMethodology',
  'incompatibilityWithWork',
  'lossOfInterest',
  'other',
];

export class CourseIndicatorsPresenter {
  static toHTTP({
    courseDepartureData,
    courseRegistrationLockData,
    courseStudentsData,
  }: CourseIndicatorsParams) {
    const departures = {};

    courseDepartureData.forEach((data) => {
      const yearData = departures[data.year];

      if (!yearData) {
        const newYearData = DEPARTURE_TYPES.map((type) => ({
          type,
          firstSemester: 0,
          secondSemester: 0,
        }));

        departures[data.year] = {
          hasDataInFirstSemester: false,
          hasDataInSecondSemester: false,
          data: newYearData,
        };
      }

      DEPARTURE_TYPES.forEach((type) => {
        const departureByYear = departures[data.year].data;
        const target = departureByYear.find(
          (typeIndicator) => typeIndicator.type === type,
        );

        if (data.semester === 'first') {
          departures[data.year].hasDataInFirstSemester = true;
          target.firstSemester += data[type] as number;
        } else {
          departures[data.year].hasDataInSecondSemester = true;
          target.secondSemester += data[type] as number;
        }
      });
    });

    const registrationLocks = {};

    courseRegistrationLockData.forEach((data) => {
      const yearData = registrationLocks[data.year];

      if (!yearData) {
        const newYearData = REGISTRATION_LOCK_TYPES.map((type) => ({
          type,
          firstSemester: 0,
          secondSemester: 0,
        }));

        registrationLocks[data.year] = {
          hasDataInFirstSemester: false,
          hasDataInSecondSemester: false,
          data: newYearData,
        };
      }

      REGISTRATION_LOCK_TYPES.forEach((type) => {
        const registrationLockByYear = registrationLocks[data.year].data;
        const target = registrationLockByYear.find(
          (typeIndicator) => typeIndicator.type === type,
        );

        if (data.semester === 'first') {
          registrationLocks[data.year].hasDataInFirstSemester = true;
          target.firstSemester += data[type] as number;
        } else {
          registrationLocks[data.year].hasDataInSecondSemester = true;
          target.secondSemester += data[type] as number;
        }
      });
    });

    const students = courseStudentsData.map((data) => ({
      year: data.year,
      entrants: data.entrants,
      actives: data.actives,
      locks: data.locks,
      canceled: data.canceled,
      vacancies: data.vacancies,
      subscribers: data.subscribers,
    }));

    return {
      students,
      departures,
      registrationLocks,
    };
  }
}
