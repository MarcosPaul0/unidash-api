import { TokenEncrypter } from '@/domain/marketplace/application/cryptography/tokenEncrypter'

export class FakeEncrypter implements TokenEncrypter {
  tokenIsExpired = false
  async generateAccessToken(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }

  async generateRefreshToken(
    payload: Record<string, unknown>,
  ): Promise<string> {
    return JSON.stringify(payload)
  }

  async verifyToken(token: string): Promise<Record<string, unknown> | null> {
    const payload = {
      sub: `_${token}`,
      userRole: `_${token}`,
    }

    const result = !this.tokenIsExpired ? payload : null
    this.tokenIsExpired = false

    return result
  }
}
