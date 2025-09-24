import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';

type CourseIndicatorsParams = {
  courseRegistrationLockData: CourseRegistrationLockData[];
  courseStudentsData: CourseStudentsData[];
  courseDepartureData: CourseDepartureData[];
  courseTeacherWorkloadData: CourseTeacherWorkloadData[];
};

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
    courseTeacherWorkloadData,
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

    const teachersWorkload = {};

    courseTeacherWorkloadData.forEach((data) => {
      const yearTeachersWorkload = teachersWorkload[data.year];
      const isFirstSemester = data.semester === 'first';

      if (yearTeachersWorkload) {
        const teacherYearWorkload = yearTeachersWorkload.data.find(
          (yearWorkload) => yearWorkload.teacherId === data.teacherId,
        );

        if (teacherYearWorkload) {
          if (data.semester === 'first') {
            yearTeachersWorkload.hasDataInFirstSemester = true;
            teacherYearWorkload.firstSemester += data.workloadInMinutes;
          } else {
            yearTeachersWorkload.hasDataInSecondSemester = true;
            teacherYearWorkload.secondSemester += data.workloadInMinutes;
          }
        } else {
          teachersWorkload[data.year] = {
            hasDataInFirstSemester: isFirstSemester,
            hasDataInSecondSemester: !isFirstSemester,
            data: [
              ...yearTeachersWorkload.data,
              {
                teacherId: data.teacherId,
                teacher: data.teacher!.name,
                firstSemester: isFirstSemester ? data.workloadInMinutes : 0,
                secondSemester: !isFirstSemester ? data.workloadInMinutes : 0,
              },
            ],
          };
        }
      } else {
        teachersWorkload[data.year] = {
          hasDataInFirstSemester: isFirstSemester,
          hasDataInSecondSemester: !isFirstSemester,
          data: [
            {
              teacherId: data.teacherId,
              teacher: data.teacher!.name,
              firstSemester: isFirstSemester ? data.workloadInMinutes : 0,
              secondSemester: !isFirstSemester ? data.workloadInMinutes : 0,
            },
          ],
        };
      }
    });

    const studentsByYear: Record<
      string,
      {
        entrants: number;
        actives: number;
        vacancies: number;
        subscribers: number;
      }
    > = {};

    courseStudentsData.forEach((data) => {
      const yearStudents = studentsByYear[data.year];

      if (yearStudents) {
        studentsByYear[data.year] = {
          entrants: yearStudents.entrants + data.entrants,
          actives: yearStudents.actives + data.actives,
          vacancies: yearStudents.vacancies + data.vacancies,
          subscribers: yearStudents.subscribers + data.subscribers,
        };
      } else {
        studentsByYear[data.year] = studentsByYear[data.year] = {
          entrants: data.entrants,
          actives: data.actives,
          vacancies: data.vacancies,
          subscribers: data.subscribers,
        };
      }
    });

    const students = Object.entries(studentsByYear).map(([year, data]) => {
      return {
        year,
        actives: data.actives,
      };
    });

    const studentDataYears = Object.keys(studentsByYear);
    const departuresDataYears = Object.keys(departures);
    const registrationLocksDataYears = Object.keys(registrationLocks);

    const yearsWithAllDataFilledIn = studentDataYears.filter(
      (item) =>
        departuresDataYears.includes(item) &&
        registrationLocksDataYears.includes(item),
    );

    const complements = {};

    yearsWithAllDataFilledIn.forEach((year) => {
      const canceled = departures[year].data.reduce(
        (accumulator, departureData) => {
          if (
            departureData.type === 'dropouts' ||
            departureData.type === 'removals' ||
            departureData.type === 'withdrawals'
          ) {
            return (
              accumulator +
              departureData.firstSemester +
              departureData.secondSemester
            );
          }

          return accumulator;
        },
        0,
      );

      const graduatesDepartureData = departures[year].data.find(
        (departureData) => departureData.type === 'completed',
      );

      const graduates = graduatesDepartureData
        ? graduatesDepartureData.firstSemester +
          graduatesDepartureData.secondSemester
        : 0;

      complements[year] = {
        successRate: graduates / studentsByYear[year].entrants,
        dropoutRate: canceled / studentsByYear[year].actives,
        applicantsToSeatRatio:
          studentsByYear[year].subscribers / studentsByYear[year].vacancies,
        occupancyRate:
          studentsByYear[year].entrants / studentsByYear[year].vacancies,
      };
    });

    return {
      students,
      departures,
      registrationLocks,
      teachersWorkload,
      complements,
    };
  }
}
