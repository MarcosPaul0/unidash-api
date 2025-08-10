import { CourseDepartureData } from '@/domain/entities/course-departure-data';

export class CourseDepartureDataPresenter {
  static toHTTP(courseDepartureData: CourseDepartureData) {
    return {
      id: courseDepartureData.id.toString(),
      courseId: courseDepartureData.courseId,
      year: courseDepartureData.year,
      semester: courseDepartureData.semester,
      completed: courseDepartureData.completed,
      maximumDuration: courseDepartureData.maximumDuration,
      dropouts: courseDepartureData.dropouts,
      transfers: courseDepartureData.transfers,
      withdrawals: courseDepartureData.withdrawals,
      removals: courseDepartureData.removals,
      newExams: courseDepartureData.newExams,
      deaths: courseDepartureData.deaths,
      createdAt: courseDepartureData.createdAt,
      updatedAt: courseDepartureData.updatedAt,
    };
  }
}
