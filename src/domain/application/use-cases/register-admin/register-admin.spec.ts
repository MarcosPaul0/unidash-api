import { FakeHasher } from 'test/cryptography/fake-hasher'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { RegisterAdminUseCase } from './register-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher

let sut: RegisterAdminUseCase

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterAdminUseCase(
      inMemoryAdminsRepository,
      inMemoryUsersRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminsRepository.items[0],
    })
  })

  it('should hash admin password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to register a new admin if the user already exists', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })
    inMemoryUsersRepository.items.push(student)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(UserAlreadyExistsError)
  })
})
