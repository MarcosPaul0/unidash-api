import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export const USER_ACTION_TOKEN_TYPE = {
  accountConfirmation: 'accountConfirmation',
  passwordReset: 'passwordReset',
} as const

export type UserActionTokenType =
  (typeof USER_ACTION_TOKEN_TYPE)[keyof typeof USER_ACTION_TOKEN_TYPE]

export interface UserActionTokenProps {
  userId: UniqueEntityId
  token: string
  actionType: UserActionTokenType
  expiresAt: Date
  createdAt: Date
}

export class UserActionToken extends Entity<UserActionTokenProps> {
  get userId() {
    return this.props.userId
  }

  get token() {
    return this.props.token
  }

  get actionType() {
    return this.props.actionType
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  get createdAt() {
    return this.props.createdAt
  }
}
