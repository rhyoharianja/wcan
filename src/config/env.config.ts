import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  WA_ACCESS_TOKEN: z.string().min(1, "WA_ACCESS_TOKEN is required"),
  WA_PHONE_NUMBER_ID: z.string().min(1, "WA_PHONE_NUMBER_ID is required"),
  WA_BUSINESS_ACCOUNT_ID: z.string().min(1, "WA_BUSINESS_ACCOUNT_ID is required"),
  WA_VERSION: z.string().default('v24.0'),
  WA_APP_SECRET: z.string().min(1, "WA_APP_SECRET is required"),
  WA_VERIFY_TOKEN: z.string().min(1, "WA_VERIFY_TOKEN is required"),
  WA_BASE_URL: z.string().default('https://graph.facebook.com/'),
});

export type EnvConfig = z.infer<typeof EnvSchema>;

export const getEnvConfig = (): EnvConfig => {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    // We don't want to crash the process immediately if imported, but we should throw if called.
    // The blueprint says "throw a descriptive error immediately at startup"
    const errorMessages = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, errors]) => `${key}: ${errors?.join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${errorMessages}`);
  }
  return result.data;
};
