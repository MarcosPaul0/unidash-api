import { FindAllCoursesUseCase } from './find-all-courses';
import { InMemoryCoursesRepository } from 'test/repositories/in-memory-courses-repository';
import { makeCourse } from 'test/factories/make-course';

let inMemoryCoursesRepository: InMemoryCoursesRepository;

let sut: FindAllCoursesUseCase;

describe('Find All Courses', () => {
  beforeEach(() => {
    inMemoryCoursesRepository = new InMemoryCoursesRepository();
    sut = new FindAllCoursesUseCase(inMemoryCoursesRepository);
  });

  it('should be able to find all courses', async () => {
    const course1 = makeCourse();
    const course2 = makeCourse();
    const course3 = makeCourse();

    inMemoryCoursesRepository.courses.push(course1, course2, course3);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      courses: [course1, course2, course3],
    });
  });
});
