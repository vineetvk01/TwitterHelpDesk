import dotenv from 'dotenv';

dotenv.config();

export const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';