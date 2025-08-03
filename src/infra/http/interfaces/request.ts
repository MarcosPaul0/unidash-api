import { UserPayload } from '../../auth/jwt.strategy'

export interface Request {
  user: UserPayload
}
