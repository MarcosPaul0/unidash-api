import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export const USER_ROLE = {
  teacher: 'teacher',
  student: 'student',
  admin: 'admin',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface UserProps {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  accountActivatedAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface SessionUser extends Omit<UserProps, 'password'> {
  id: string;
}

export class User<Props = unknown> extends Entity<Props & UserProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    if (!name) {
      return;
    }

    this.props.name = name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  set password(newPassword: string) {
    if (!newPassword) {
      return;
    }

    this.props.password = newPassword;
  }

  get role() {
    return this.props.role;
  }

  set role(role: UserRole) {
    if (!role) {
      return;
    }

    this.props.role = role;
  }

  get accountActivatedAt() {
    return this.props.accountActivatedAt;
  }

  set accountActivatedAt(accountActivatedAt: Date | undefined | null) {
    if (!accountActivatedAt) {
      return;
    }

    this.props.accountActivatedAt = accountActivatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
