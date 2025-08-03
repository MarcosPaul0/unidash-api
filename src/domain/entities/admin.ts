import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { User, UserProps } from './user';
import { Optional } from '@/core/types/optional';

export type AdminProps = UserProps;

export class Admin extends User<AdminProps> {
  static create(props: Optional<AdminProps, 'createdAt'>, id?: UniqueEntityId) {
    const admin = new Admin(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: 'admin',
      },
      id,
    );

    return admin;
  }
}
