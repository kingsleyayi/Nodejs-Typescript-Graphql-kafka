import Logger from "../config/Logger";

class eventLogger {
  public static async logError(message: string) {
    Logger.error(`${message}`);
  }

  public static async logWarn(message: string) {
    Logger.warn(`${message}`);
  }

  public static async logInfo(message: string) {
    Logger.info(`${message}`);
  }

  public static async logHttp(message: string) {
    Logger.http(`${message}`);
  }

  public static async logDebug(message: string) {
    Logger.debug(`${message}`);
  }
}

export default eventLogger;
