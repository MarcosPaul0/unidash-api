import { z } from 'zod';

export const envSchema = z.object({
  DB_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  JWT_ACCESS_TOKEN_EXPIRATION_SECONDS: z.coerce.number(),
  JWT_REFRESH_TOKEN_EXPIRATION_DAYS: z.coerce.number(),
  SMTP_HOST: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),
  SMTP_PORT: z.coerce.number(),
  FRONTEND_BASE_URL: z.url(),
  ACCOUNT_ACTIVATION_URL: z.url(),
  PASSWORD_RESET_URL: z.url(),
  REFRESH_TOKEN_COOKIE: z.string(),
});

export type Env = z.infer<typeof envSchema>;
