import pino from 'pino';
import path from 'path';

function getLogLevel(): pino.Level | 'silent' {
  return process.env.CYNDAQUIL_LOG_LEVEL ??
    process.env.NODE_ENV === 'development'
    ? 'info'
    : 'silent';
}

class Logger {
  private logger: pino.BaseLogger;
  constructor() {
    let logger: pino.BaseLogger;
    if (process.env.CYNDAQUIL_LOG_FILE) {
      const transport = pino.transport({
        target: 'pino/file',
        options: {
          destination: path.resolve(process.cwd(), 'null', 'access.log'),
          mkdir: true,
        },
      });
      logger = pino(
        {
          level: getLogLevel(),
          name: 'cyndaquil-logger',
          base: undefined
        },
        transport
      );
    } else {
      logger = pino({
        level: getLogLevel(),
        name: 'cyndaquil-logger',
        base: undefined
      });
    }
    this.logger = logger;
  }
  info(msg:any){ this.logger.info(msg); }
  trace(msg:any){ this.logger.trace(msg); }
  debug(msg:any){ this.logger.debug(msg); }
  warn(msg:any){ this.logger.warn(msg); }
  error(msg:any){ this.logger.error(msg); }
}

export const logger = new Logger();
