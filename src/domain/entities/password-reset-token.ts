import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { UserActionToken, UserActionTokenProps } from './user-action-token';

export type PasswordResetTokenProps = Omit<UserActionTokenProps, 'actionType'>;

export class PasswordResetToken extends UserActionToken {
  static create(
    props: Optional<PasswordResetTokenProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const passwordResetToken = new PasswordResetToken(
      {
        ...props,
        actionType: 'passwordReset',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return passwordResetToken;
  }
}
