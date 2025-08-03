import { DeleteTeacherUseCase } from './delete-teacher'
import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { makeTeacher } from 'test/factories/make-teacher'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryTeachersRepository: InMemoryTeachersRepository

let sut: DeleteTeacherUseCase

describe('Delete Teacher', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository()

    sut = new DeleteTeacherUseCase(inMemoryTeachersRepository)
  })

  it('should be able to delete a teacher', async () => {
    const newTeacher = makeTeacher({}, new UniqueEntityId('teacher-1'))

    inMemoryTeachersRepository.create(newTeacher)

    await sut.execute({
      teacherId: 'teacher-1',
    })

    expect(inMemoryTeachersRepository.items).toHaveLength(0)
  })

  it('should not be possible to delete a teacher that does not exist', async () => {
    const result = await sut.execute({
      teacherId: 'teacher-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
