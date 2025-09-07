import { Controller, Get, HttpCode } from '@nestjs/common';
import { Public } from '@/infra/auth/public';
import { FindAllCoursesUseCase } from '@/domain/application/use-cases/find-all-courses/find-all-courses';
import { CoursesPresenter } from '../../presenters/courses-presenter';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { SessionUser } from '@/domain/entities/user';

@Controller('/courses')
export class FindAllCoursesController {
  constructor(private findAllCoursesUseCase: FindAllCoursesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() sessionUser: SessionUser) {
    const result = await this.findAllCoursesUseCase.execute({
      sessionUser,
    });

    if (result.isLeft()) {
      return [];
    }

    return {
      courses: result.value.courses.map(CoursesPresenter.toHTTP),
    };
  }
}
