// TODO limpar código

import { ActiveStudentsByIngress } from '@/domain/entities/active-students-by-ingress';
import { CourseActiveStudentsData } from '@/domain/entities/course-active-students-data';
import { CourseDepartureData } from '@/domain/entities/course-departure-data';
import { CourseRegistrationLockData } from '@/domain/entities/course-registration-lock-data';
import { CourseStudentsData } from '@/domain/entities/course-students-data';
import { CourseTeacherWorkloadData } from '@/domain/entities/course-teacher-workload-data';

type CourseIndicatorsParams = {
  courseRegistrationLockData: CourseRegistrationLockData[];
  courseStudentsData: CourseStudentsData[];
  courseDepartureData: CourseDepartureData[];
  courseTeacherWorkloadData: CourseTeacherWorkloadData[];
  courseActiveStudentsData: CourseActiveStudentsData[];
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
    courseActiveStudentsData,
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

    const registrationLocks = new Map();

    courseRegistrationLockData.forEach((data) => {
      const yearData = registrationLocks[String(data.year)];

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
            teacherYearWorkload.firstSemester += data.workloadInHours;
          } else {
            yearTeachersWorkload.hasDataInSecondSemester = true;
            teacherYearWorkload.secondSemester += data.workloadInHours;
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
                firstSemester: isFirstSemester ? data.workloadInHours : 0,
                secondSemester: !isFirstSemester ? data.workloadInHours : 0,
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
              firstSemester: isFirstSemester ? data.workloadInHours : 0,
              secondSemester: !isFirstSemester ? data.workloadInHours : 0,
            },
          ],
        };
      }
    });

    const activeStudents = {};

    courseActiveStudentsData.forEach((data) => {
      const yearActiveStudents = activeStudents[data.year];

      if (yearActiveStudents && data.semester === 'second') {
        activeStudents[data.year] = this.formatActiveStudentsByIngress(
          data.activeStudentsByIngress,
        );
      } else {
        activeStudents[data.year] = this.formatActiveStudentsByIngress(
          data.activeStudentsByIngress,
        );
      }
    });

    const students = {};

    courseStudentsData.forEach((data) => {
      const yearStudents = students[data.year];

      if (yearStudents) {
        students[data.year] = {
          entrants: yearStudents.entrants + data.entrants,
          vacancies: yearStudents.vacancies + data.vacancies,
          subscribers: yearStudents.subscribers + data.subscribers,
        };
      } else {
        students[data.year] = {
          entrants: data.entrants,
          vacancies: data.vacancies,
          subscribers: data.subscribers,
        };
      }
    });

    const studentDataYears = Object.keys(students);
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

      const yearActiveStudent = activeStudents[year];

      const actives = yearActiveStudent
        ? yearActiveStudent.reduce(
            (accumulator, currentActiveStudents) =>
              accumulator + currentActiveStudents.numberOfStudents,
            0,
          )
        : 1;

      complements[year] = {
        successRate: graduates / students[year].entrants,
        dropoutRate: canceled / actives,
        applicantsToSeatRatio:
          students[year].subscribers / students[year].vacancies,
        occupancyRate: students[year].entrants / students[year].vacancies,
      };
    });

    return {
      students,
      departures,
      registrationLocks,
      teachersWorkload,
      complements,
      activeStudents,
    };
  }

  private static formatActiveStudentsByIngress(
    activeStudentsByIngress: ActiveStudentsByIngress[],
  ) {
    return activeStudentsByIngress.map((activeStudents) => ({
      ingressYear: activeStudents.ingressYear,
      numberOfStudents: activeStudents.numberOfStudents,
    }));
  }
}
