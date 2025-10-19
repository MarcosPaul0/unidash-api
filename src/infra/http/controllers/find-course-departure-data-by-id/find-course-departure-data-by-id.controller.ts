import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error';
import { CurrentUser } from '../../../auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { SessionUser } from '@/domain/entities/user';
import { FindCourseDepartureDataByIdUseCase } from '@/domain/application/use-cases/find-course-departure-data-by-id/find-course-departure-data-by-id';
import { CourseDepartureDataPresenter } from '../../presenters/course-departure-data-presenter';

@Controller('/course-departure-data/by-id/:courseDepartureDataId')
export class FindCourseDepartureDataByIdController {
  constructor(
    private findCourseDepartureDataByIdUseCase: FindCourseDepartureDataByIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() sessionUser: SessionUser,
    @Param('courseDepartureDataId') courseDepartureDataId: string,
  ) {
    const result = await this.findCourseDepartureDataByIdUseCase.execute({
      courseDepartureDataId,
      sessionUser,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    return {
      courseDepartureData: CourseDepartureDataPresenter.toHTTP(
        result.value.courseDepartureData,
      ),
    };
  }
}
