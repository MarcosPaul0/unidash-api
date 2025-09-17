import {
  CourseSearchComplementaryActivitiesData as PrismaCourseSearchComplementaryActivitiesData,
  Prisma,
} from '@prisma/client';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CourseSearchComplementaryActivitiesData } from '@/domain/entities/course-search-complementary-activities-data';

export class PrismaCourseSearchComplementaryActivitiesDataMapper {
  static toDomain(
    raw: PrismaCourseSearchComplementaryActivitiesData,
  ): CourseSearchComplementaryActivitiesData {
    return CourseSearchComplementaryActivitiesData.create(
      {
        courseId: raw.courseId,
        year: raw.year,
        semester: raw.semester,
        scientificInitiation: raw.scientificInitiation,
        developmentInitiation: raw.developmentInitiation,
        publishedArticles: raw.publishedArticles,
        fullPublishedArticles: raw.fullPublishedArticles,
        publishedAbstracts: raw.publishedAbstracts,
        presentationOfWork: raw.presentationOfWork,
        participationInEvents: raw.participationInEvents,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrismaCreate(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Prisma.CourseSearchComplementaryActivitiesDataUncheckedCreateInput {
    return {
      courseId: courseSearchComplementaryActivitiesData.courseId,
      year: courseSearchComplementaryActivitiesData.year,
      semester: courseSearchComplementaryActivitiesData.semester,
      scientificInitiation:
        courseSearchComplementaryActivitiesData.scientificInitiation,
      developmentInitiation:
        courseSearchComplementaryActivitiesData.developmentInitiation,
      publishedArticles:
        courseSearchComplementaryActivitiesData.publishedArticles,
      fullPublishedArticles:
        courseSearchComplementaryActivitiesData.fullPublishedArticles,
      publishedAbstracts:
        courseSearchComplementaryActivitiesData.publishedAbstracts,
      presentationOfWork:
        courseSearchComplementaryActivitiesData.presentationOfWork,
      participationInEvents:
        courseSearchComplementaryActivitiesData.participationInEvents,
      createdAt: courseSearchComplementaryActivitiesData.createdAt,
      updatedAt: courseSearchComplementaryActivitiesData.updatedAt,
    };
  }

  static toPrismaUpdate(
    courseSearchComplementaryActivitiesData: CourseSearchComplementaryActivitiesData,
  ): Prisma.CourseSearchComplementaryActivitiesDataUncheckedUpdateInput {
    return {
      id: courseSearchComplementaryActivitiesData.id.toString(),
      year: courseSearchComplementaryActivitiesData.year,
      semester: courseSearchComplementaryActivitiesData.semester,
      scientificInitiation:
        courseSearchComplementaryActivitiesData.scientificInitiation,
      developmentInitiation:
        courseSearchComplementaryActivitiesData.developmentInitiation,
      publishedArticles:
        courseSearchComplementaryActivitiesData.publishedArticles,
      fullPublishedArticles:
        courseSearchComplementaryActivitiesData.fullPublishedArticles,
      publishedAbstracts:
        courseSearchComplementaryActivitiesData.publishedAbstracts,
      presentationOfWork:
        courseSearchComplementaryActivitiesData.presentationOfWork,
      participationInEvents:
        courseSearchComplementaryActivitiesData.participationInEvents,
      createdAt: courseSearchComplementaryActivitiesData.createdAt,
      updatedAt: courseSearchComplementaryActivitiesData.updatedAt,
    };
  }
}
