import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../../repositories/students-repository'

interface DeleteStudentUseCaseRequest {
  studentId: string
}

type DeleteStudentUseCaseResponse = Either<
  ResourceNotFoundError,
  Record<string, never>
>

@Injectable()
export class DeleteStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({
    studentId,
  }: DeleteStudentUseCaseRequest): Promise<DeleteStudentUseCaseResponse> {
    const student = await this.studentsRepository.findById(studentId)

    if (!student) {
      return left(new ResourceNotFoundError())
    }

    await this.studentsRepository.delete(student)

    return right({})
  }
}
