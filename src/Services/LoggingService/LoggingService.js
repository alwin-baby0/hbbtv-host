import axios from 'axios';
import { API_URLS } from '../../constants/globalConstants';
export default class LoggingService {
  async postLog(level, deviceInfo, responseBody) {
    await axios.post(
      `${process.env.APP_LOGGING_URL}/${API_URLS.LOGGING}/${level}`,
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
          Authorization: `Bearer ${process.env.APP_LOGGING_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

const loggingService = new LoggingService();

export { loggingService as LoggingService };
