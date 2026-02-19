import { CMPService } from 'src/Services/CMPService/CMPService';
import { getDeviceInfo } from 'src/utils/device';
import { V2 } from 'src/Services/utils';

jest.mock('src/utils/device');

jest.mock('src/utils/index');

describe('CMPService', () => {
  let mockRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'languageCode') return 'en';
      return null;
    });

    getDeviceInfo.mockReturnValue({
      serialNumber: 'TEST-DEVICE-123',
    });

    refreshTokenOnOauth = jest.fn();

    mockRequest = jest.spyOn(CMPService, '_request').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('selectCMPChoice - Accept Button', () => {
    it('should make a proper request to the backend when user accepts CMP', async () => {
      const deviceCode = 'TEST-DEVICE-123';
      const choicePick = 'accept';

      mockRequest.mockResolvedValue({ data: { status: 'success' } });

      // user presses accept
      await CMPService.selectCMPChoice(deviceCode, choicePick);

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/getCMP',
        apiVersion: V2,
        method: 'GET',
        headers: {
          Authorization: 'Bearer bc6b83671bd80d6a26dd7607c912c1e705f8d563',
        },
        params: {
          language: 'en',
          choice: choicePick,
          device_id: deviceCode,
        },
      });
    });

    it('should include the language parameter from localStorage', async () => {
      const deviceCode = 'TEST-DEVICE-999';
      const choicePick = 'accept';

      Storage.prototype.getItem = jest.fn((key) => {
        if (key === 'languageCode') return 'nl';
        return null;
      });

      mockRequest.mockResolvedValue({ data: { status: 'success' } });

      await CMPService.selectCMPChoice(deviceCode, choicePick);

      const callArgs = mockRequest.mock.calls[0][0];
      expect(callArgs.params.language).toBe('nl');
    });

    it('should default to "en" language if not set in localStorage', async () => {
      const deviceCode = 'TEST-DEVICE-000';
      const choicePick = 'accept';

      // Mock localStorage returning null for languageCode
      Storage.prototype.getItem = jest.fn(() => null);

      mockRequest.mockResolvedValue({ data: { status: 'success' } });

      await CMPService.selectCMPChoice(deviceCode, choicePick);

      const callArgs = mockRequest.mock.calls[0][0];
      expect(callArgs.params.language).toBe('en');
    });
  });

  describe('initialFetch', () => {
    it('should fetch CMP data on initialization', async () => {
      const mockCmpData = {
        data: {
          title: 'Cookie Consent',
          description: 'We use cookies...',
          choices: ['accept', 'reject'],
        },
      };

      mockRequest.mockResolvedValue(mockCmpData);

      await CMPService.initialFetch();

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/getCMP',
        apiVersion: V2,
        method: 'GET',
        headers: {
          Authorization: 'Bearer bc6b83671bd80d6a26dd7607c912c1e705f8d563',
        },
        params: {
          language: 'en',
          device_id: 'TEST-DEVICE-123',
        },
      });
    });

    it('should handle missing data in CMP response', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockRequest.mockResolvedValue({});

      await CMPService.initialFetch();

      expect(consoleSpy).toHaveBeenCalledWith('No data found in CMP results');
      consoleSpy.mockRestore();
    });

    it('should handle fetch errors during initialization', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const mockError = new Error('Fetch failed');

      mockRequest.mockRejectedValue(mockError);

      await CMPService.initialFetch();

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching CMP data:', mockError);
      consoleSpy.mockRestore();
    });
  });
});
