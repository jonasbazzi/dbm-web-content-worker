import dotenv from 'dotenv';

if (process.env.ENV === 'test') {
  dotenv.config({ path: 'tests/.env' });
} else if (process.env.ENV !== 'production') {
  dotenv.config();
}

export function getBooleanFromEnv(value, defaultValue) {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return 'true' === value.toLowerCase().trim();
}
