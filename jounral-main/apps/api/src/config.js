import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const rootDir = path.resolve(process.cwd());

export const PORT = process.env.PORT || 4000;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tradejournal';
export const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(rootDir, 'uploads');
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
