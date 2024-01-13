declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DATABASE_URL: string;
      SECRET_ENCRYPTION_SALT_OR_ROUNDS: string;
      JWT_SECRET: string;
      CLOUD_NAME: string;
      API_KEY: string;
      API_SECRET: string;
    }
  }
}

export {};
