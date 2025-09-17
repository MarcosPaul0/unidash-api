import { Pagination } from '@/core/pagination/pagination';
import {
  StudentsRepository,
  FindAllStudents,
} from '@/domain/application/repositories/students-repository';
import { Student } from '@/domain/entities/student';

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  async findById(id: string): Promise<Student | null> {
    const student = this.items.find((item) => item.id.toString() === id);

    if (!student) {
      return null;
    }

    return student;
  }

  async findByMatriculation(matriculation: string): Promise<Student | null> {
    const student = this.items.find(
      (item) => item.matriculation === matriculation,
    );

    if (!student) {
      return null;
    }

    return student;
  }

  async findAll({ page, itemsPerPage }: Pagination): Promise<FindAllStudents> {
    const currentPage = (page - 1) * itemsPerPage;
    const totalItemsToTake = page * itemsPerPage;

    const students = this.items.slice(currentPage, totalItemsToTake);
    const totalItems = this.items.length;
    const totalPages = Math.ceil(this.items.length / itemsPerPage);

    return {
      students,
      totalItems,
      totalPages,
    };
  }

  async save(student: Student): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === student.id);

    this.items[itemIndex] = student;
  }

  async create(student: Student) {
    this.items.push(student);
  }

  async delete(student: Student): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === student.id);

    this.items.splice(itemIndex, 1);
  }
}
