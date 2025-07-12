import dotenv from 'dotenv';

if (process.env.ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else if (process.env.ENV !== 'production') {
  dotenv.config();
}
