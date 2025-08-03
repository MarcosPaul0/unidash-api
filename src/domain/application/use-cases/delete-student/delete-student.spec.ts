import { DeleteStudentUseCase } from './delete-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteStudentUseCase

describe('Delete Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new DeleteStudentUseCase(inMemoryStudentsRepository)
  })

  it('should be able to delete a student', async () => {
    const newStudent = makeStudent({}, new UniqueEntityId('student-1'))

    inMemoryStudentsRepository.create(newStudent)

    await sut.execute({
      studentId: 'student-1',
    })

    expect(inMemoryStudentsRepository.items).toHaveLength(0)
  })

  it('should not be possible to delete a student that does not exist', async () => {
    const result = await sut.execute({
      studentId: 'student-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
