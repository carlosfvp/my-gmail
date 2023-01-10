export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URL: string;
      ENV: 'test' | 'dev' | 'prod';
      APP_PORT: number;
      WS_PORT: number;
    }
  }
}
