import * as winston from 'winston';

console.log(winston);
console.log(winston.transports);

export default logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    version: process.env.APP_VERSION,
    platform: process.env.APP_PLATFORM,
  },
  transports: [
    new winston.transports.Http({
      host: process.env.APP_BASE_URL,
      path: '/logs',
      ssl: true,
    }),
  ],
});
