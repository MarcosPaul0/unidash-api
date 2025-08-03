import { Pagination } from '@/core/pagination/pagination';
import {
  FindAllTeachers,
  TeachersRepository,
} from '@/domain/application/repositories/teacher-repository';
import { Teacher } from '@/domain/entities/teacher';

export class InMemoryTeachersRepository implements TeachersRepository {
  public items: Teacher[] = [];

  async findById(id: string): Promise<Teacher | null> {
    const teacher = this.items.find((item) => item.id.toString() === id);

    if (!teacher) {
      return null;
    }

    return teacher;
  }

  async save(teacher: Teacher): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === teacher.id);

    this.items[itemIndex] = teacher;
  }

  async create(teacher: Teacher) {
    this.items.push(teacher);
  }

  async delete(teacher: Teacher): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === teacher.id);

    this.items.splice(itemIndex, 1);
  }

  async findAll(): Promise<Teacher[]> {
    return this.items;
  }

  async findAllWithPagination({
    page,
    itemsPerPage,
  }: Pagination): Promise<FindAllTeachers> {
    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const teachers = this.items.slice(currentPage, totalItemsToTake);
    const totalItems = this.items.length;
    const totalPages = Math.ceil(this.items.length / itemsPerPage);

    return {
      teachers,
      totalItems,
      totalPages,
    };
  }
}
