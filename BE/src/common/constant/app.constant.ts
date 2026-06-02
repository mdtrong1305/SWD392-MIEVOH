import 'dotenv/config';

export const PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
export const FOLDER_IMAGE = 'public/images';

console.log(
  '\n',
  {
    PORT,
    ACCESS_TOKEN_SECRET,
    DATABASE_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
  },
  '\n',
);
