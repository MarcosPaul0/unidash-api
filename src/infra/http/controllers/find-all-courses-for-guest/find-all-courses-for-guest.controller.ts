import { Controller, Get, HttpCode } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { FindAllCoursesUseCase } from '@/domain/application/use-cases/find-all-courses/find-all-courses';
import { CoursesPresenter } from '../../presenters/courses-presenter';

@Controller('/courses-for-guest')
@Public()
export class FindAllCoursesForGuestController {
  constructor(private findAllCoursesUseCase: FindAllCoursesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const result = await this.findAllCoursesUseCase.execute({
      sessionUser: undefined,
    });

    if (result.isLeft()) {
      return [];
    }

    return {
      courses: result.value.courses.map(CoursesPresenter.toHTTP),
    };
  }
}
