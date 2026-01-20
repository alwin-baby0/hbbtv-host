import axios from 'axios';
const API_KEY = ''; // čekamo Toma

export default class LoggingService {
  async postLog(level, deviceInfo, responseBody) {
    await axios.post(
      `https://log.wedotv.dev/api/log/${level}`,
      {
        app_bundle: process.env.APP_BUNDLE,
        app_version: process.env.APP_VERSION,
        app_platform: process.env.APP_PLATFORM,
        serialNumber: deviceInfo?.serialNumber,
        model: deviceInfo?.model,
        brand: deviceInfo?.brand,
        osVersion: deviceInfo?.osVersion,
        macAddress: deviceInfo?.macAddress,
        deviceId: deviceInfo?.serialNumber,
        response_body: responseBody,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

const loggingService = new LoggingService();

export { loggingService as LoggingService };
