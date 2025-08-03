import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UpdateStudentData, UpdateStudentUseCase } from './update-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository

let sut: UpdateStudentUseCase

describe('Update Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    sut = new UpdateStudentUseCase(inMemoryStudentsRepository)
  })

  it('should be able to update student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: '123456',
    })

    inMemoryStudentsRepository.items.push(student)

    const data: UpdateStudentData = {
      name: 'John Doe',
      matriculation: '121123567890',
    }

    const result = await sut.execute({
      studentId: student.id.toString(),
      data,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].name).toEqual('John Doe')
    expect(inMemoryStudentsRepository.items[0].matriculation).toEqual(
      '121123567890',
    )
  })

  it('should not be able to update student if the student was not found', async () => {
    const data: UpdateStudentData = {
      name: 'John Doe',
      matriculation: '121123567890',
    }

    const result = await sut.execute({
      studentId: 'fakeId',
      data,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ResourceNotFoundError)
  })
})
