import { Pagination } from '@/core/pagination/pagination';
import {
  FindAllTeachers,
  FindAllTeachersFilter,
  FindWithCourses,
  TeachersRepository,
} from '@/domain/application/repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';
import { TeacherCourse } from '@/domain/entities/teacher-course';

export class InMemoryTeachersRepository implements TeachersRepository {
  public teachers: Teacher[] = [];
  public teacherCourses: TeacherCourse[] = [];

  async findByIdWithCourses(id: string): Promise<FindWithCourses | null> {
    const teacher = this.teachers.find((item) => item.id.toString() === id);

    if (!teacher) {
      return null;
    }

    const teacherCourses = this.teacherCourses.filter(
      (teacherCourse) => teacherCourse.teacherId === teacher.id.toString(),
    );

    return {
      teacher,
      teacherCourse: teacherCourses,
    };
  }

  async findById(id: string): Promise<Teacher | null> {
    const teacher = this.teachers.find((item) => item.id.toString() === id);

    if (!teacher) {
      return null;
    }

    return teacher;
  }

  async save(teacher: Teacher): Promise<void> {
    const itemIndex = this.teachers.findIndex((item) => item.id === teacher.id);

    this.teachers[itemIndex] = teacher;
  }

  async create(teacher: Teacher) {
    this.teachers.push(teacher);
  }

  async delete(teacher: Teacher): Promise<void> {
    const itemIndex = this.teachers.findIndex((item) => item.id === teacher.id);

    this.teachers.splice(itemIndex, 1);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teachers;
  }

  async findAllWithPagination(
    {
      page,

      itemsPerPage,
    }: Pagination,
    filters?: FindAllTeachersFilter,
  ): Promise<FindAllTeachers> {
    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    var teachersWithFilters = this.teachers;

    if (filters?.isActive !== undefined) {
      teachersWithFilters = teachersWithFilters.filter(
        (teacher) => teacher.isActive === filters.isActive,
      );
    }

    if (filters?.name !== undefined) {
      teachersWithFilters = teachersWithFilters.filter(
        (teacher) => teacher.name === filters.name,
      );
    }

    const teachers = teachersWithFilters.slice(currentPage, totalItemsToTake);
    const totalItems = teachersWithFilters.length;
    const totalPages = Math.ceil(teachersWithFilters.length / itemsPerPage);

    return {
      teachers,
      totalItems,
      totalPages,
    };
  }

  async findAllOutsideOfCourse(
    courseId: string,
    pagination?: Pagination,
    filters?: FindAllTeachersFilter,
  ): Promise<FindAllTeachers> {
    const itemsPerPage = pagination
      ? pagination.itemsPerPage
      : this.teachers.length;
    const page = pagination ? pagination.page : 1;

    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    var teachersWithFilters = this.teachers;

    teachersWithFilters = teachersWithFilters.filter((teacher) =>
      this.teacherCourses
        .filter(
          (teacherCourse) => teacherCourse.teacherId === teacher.id.toString(),
        )
        .every((teacherCourse) => teacherCourse.courseId !== courseId),
    );

    if (filters?.isActive !== undefined) {
      teachersWithFilters = teachersWithFilters.filter(
        (teacher) => teacher.isActive === filters.isActive,
      );
    }

    if (filters?.name !== undefined) {
      teachersWithFilters = teachersWithFilters.filter(
        (teacher) => teacher.name === filters.name,
      );
    }

    const teachers = teachersWithFilters.slice(currentPage, totalItemsToTake);
    const totalItems = teachersWithFilters.length;
    const totalPages = Math.ceil(teachersWithFilters.length / itemsPerPage);

    return {
      teachers,
      totalItems,
      totalPages,
    };
  }
}
