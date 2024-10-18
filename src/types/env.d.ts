declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGO_URI: string;
            ACCESS_TOKEN_SECRET: string;
            ACCESS_TOKEN_EXPIRY: string;
        }
    }
}