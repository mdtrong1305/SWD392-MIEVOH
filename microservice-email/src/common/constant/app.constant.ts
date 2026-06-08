import 'dotenv/config';

export const RABBIT_MQ_URL = process.env.RABBIT_MQ_URL!;
export const EMAIL_HOST = process.env.EMAIL_HOST!;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;

console.log(
  '\n',
  {
    RABBIT_MQ_URL,
    EMAIL_HOST,
    EMAIL_USER: EMAIL_USER ? 'configured' : 'missing',
    EMAIL_PASS: EMAIL_PASS ? 'configured' : 'missing',
  },
  '\n',
);