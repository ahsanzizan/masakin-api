declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DATABASE_URL: string;
      SECRET_ENCRYPTION_SALT_OR_ROUNDS: string;
      JWT_SECRET: string;
    }
  }
}

export {};
