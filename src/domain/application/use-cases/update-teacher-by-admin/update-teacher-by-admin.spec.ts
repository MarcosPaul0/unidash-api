import { InMemoryTeachersRepository } from 'test/repositories/in-memory-teachers-repository';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { makeTeacher } from 'test/factories/make-teacher';
import { makeAdmin } from 'test/factories/make-admin';
import {
  UpdateTeacherByAdminData,
  UpdateTeacherByAdminUseCase,
} from './update-teacher-by-admin';
import { InMemoryTeacherCoursesRepository } from 'test/repositories/in-memory-teacher-courses-repository';
import { AuthorizationService } from '@/infra/authorization/authorization.service';
import { makeSessionUser } from 'test/factories/make-session-user';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';

let inMemoryTeachersRepository: InMemoryTeachersRepository;
let inMemoryTeacherCoursesRepository: InMemoryTeacherCoursesRepository;
let authorizationService: AuthorizationService;

let sut: UpdateTeacherByAdminUseCase;

describe('Update Teacher By Admin', () => {
  beforeEach(() => {
    inMemoryTeachersRepository = new InMemoryTeachersRepository();
    inMemoryTeacherCoursesRepository = new InMemoryTeacherCoursesRepository();
    authorizationService = new AuthorizationService(
      inMemoryTeacherCoursesRepository,
    );

    sut = new UpdateTeacherByAdminUseCase(
      inMemoryTeachersRepository,
      authorizationService,
    );
  });

  it('should be able to update teacher with admin session', async () => {
    const admin = makeAdmin();

    const teacher = makeTeacher(
      {
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      },
      new UniqueEntityId('teacher-1'),
    );

    inMemoryTeachersRepository.teachers.push(teacher);

    const data: UpdateTeacherByAdminData = {
      name: 'John Doe Doe',
    };

    const result = await sut.execute({
      teacherId: 'teacher-1',
      data,
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryTeachersRepository.teachers[0].name).toEqual('John Doe Doe');
  });

  it('should not be able to update teacher if session user is teacher', async () => {
    const teacher = makeTeacher();

    const data: UpdateTeacherByAdminData = {
      name: 'John Doe Doe',
    };

    const result = await sut.execute({
      teacherId: teacher.id.toString(),
      data,
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to update teacher if session user is student', async () => {
    const teacher = makeTeacher();

    const data: UpdateTeacherByAdminData = {
      name: 'John Doe Doe',
    };

    const result = await sut.execute({
      teacherId: teacher.id.toString(),
      data,
      sessionUser: makeSessionUser(teacher),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(NotAllowedError);
  });

  it('should not be able to update teacher if the teacher was not found', async () => {
    const admin = makeAdmin();

    const data: UpdateTeacherByAdminData = {
      name: 'John Doe Doe',
    };

    const result = await sut.execute({
      teacherId: 'teacher-1',
      data,
      sessionUser: makeSessionUser(admin),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).instanceOf(ResourceNotFoundError);
  });
});
