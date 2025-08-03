import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository'
import { FindTeacherByIdUseCase } from './find-teacher-by-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeTeacher } from 'test/factories/make-teacher'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryTeachersRepository: InMemoryTeachersRepository

let sut: FindTeacherByIdUseCase

describe('Find Teacher By Id', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository()

    sut = new FindTeacherByIdUseCase(inMemoryTeachersRepository)
  })

  it('should be able to find a teacher by id', async () => {
    const teacher = makeTeacher({}, new UniqueEntityId('teacher-1'))

    inMemoryTeachersRepository.create(teacher)

    const result = await sut.execute({
      id: 'teacher-1',
      userRole: 'teacher',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      teacher,
    })
  })

  it('should throw if the teacher was not found', async () => {
    const result = await sut.execute({
      id: 'teacher-2',
      userRole: 'teacher',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ResourceNotFoundError)
  })

  it('should throw if the user is not an teacher', async () => {
    const result = await sut.execute({
      id: 'teacher-1',
      userRole: 'student',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ResourceNotFoundError)
  })
})
