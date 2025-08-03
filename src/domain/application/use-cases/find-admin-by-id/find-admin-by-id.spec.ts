import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryAdminsRepository } from '../../../../../test/repositories/in-memory-admins-repository';
import { FindAdminByIdUseCase } from './find-admin-by-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryAdminsRepository: InMemoryAdminsRepository;

let sut: FindAdminByIdUseCase;

describe('Find Admin By Id', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository();

    sut = new FindAdminByIdUseCase(inMemoryAdminsRepository);
  });

  it('should be able to find a admin by id', async () => {
    const admin = makeAdmin();

    inMemoryAdminsRepository.items.push(admin);

    const result = await sut.execute({
      id: admin.id.toString(),
      userRole: 'admin',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      admin,
    });
  });

  it('should throw if the admin was not found', async () => {
    const result = await sut.execute({
      id: 'fake-id',
      userRole: 'admin',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });

  it('should throw if the user is not an admin', async () => {
    const result = await sut.execute({
      id: 'fake-id',
      userRole: 'teacher',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });
});
