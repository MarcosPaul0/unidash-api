import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { UserActionToken, UserActionTokenProps } from './user-action-token';

export type AccountActivationTokenProps = Omit<
  UserActionTokenProps,
  'actionType'
>;

export class AccountActivationToken extends UserActionToken {
  static create(
    props: Optional<AccountActivationTokenProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const accountActivationToken = new AccountActivationToken(
      {
        ...props,
        actionType: 'accountConfirmation',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return accountActivationToken;
  }
}
