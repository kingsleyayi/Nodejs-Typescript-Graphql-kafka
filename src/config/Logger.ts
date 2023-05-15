import { createLogger, transports, format, transport, level } from 'winston';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { logDir, environment } from '.';

let dir = logDir;
if (!dir) dir = path.resolve('logs');

// create directory if it is not present
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const logLevel = environment === 'development' ? 'debug' : 'warn';

const winstonFormatFile = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms'}),
  format.align(),
  format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  )
)

const winstonFormatConsole = format.combine(
  format.colorize({
      all: true
  }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms'}),
  format.align(),
  format.printf(
      (info) => `[timestamp : ${info.timestamp}] [level: ${info.level}] : ${info.message}`,
  )
)

const options = {
  file: {
    levels: 'warn',
    filename: dir + '/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '21d',
  },
};

const transportfile: DailyRotateFile = new DailyRotateFile(options.file);
transportfile.on('rotate', function(oldFilename, newFilename) {});



//creates a logger instace and exports it. It logs to a daily rotate file 
export default createLogger({
  format:winstonFormatFile,
  level:'warn',
  transports: [
    transportfile,
    new transports.Console({
      level: logLevel,
      format: winstonFormatConsole
    })
  ],
});
