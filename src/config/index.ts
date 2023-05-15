import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const environment = process.env.NODE_ENV;
export const logDir = process.env.LOG_DIR;
export const serverPort = process.env.PORT;
export const databaseUrl = process.env.DATABASE_URL;
export const jwtSecret = process.env.JWT_SECRET;

export const kafkaClientId = process.env.CLIENT_ID;
export const kafkaBroker = process.env.BROKERS || "broker";
export const kafkaUsername = process.env.USERNAME || "username";
export const kafkaPassword = process.env.PASSWORD || "password";
