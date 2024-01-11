declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SECRET_KEY: string;
      SECRET_IV: string;
      ENCRYPTION_METHOD: string;
      JWT_SECRET: string;
    }
  }
}

export {};
