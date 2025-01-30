import FetchingService from './FetchingService';
import { V2, auth } from './utils';

class CMPService extends FetchingService {
  #cmpData;
  async initialFetch() {
    const deviceCode = localStorage.getItem('serialNumber');
    try {
      // const cmpResults = await this.#getCMP('d9b02c2e-3e91-44bc-bd76-9e5f4ef91e09');
      const cmpResults = await this.#getCMP(deviceCode);
      this.#cmpData = cmpResults;
      if (cmpResults && cmpResults.data) {
        this.#cmpData = cmpResults.data;
      } else {
        console.error('No data found in CMP results');
      }
    } catch (error) {
      console.error('Error fetching CMP data:', error);
    }
  }

  async selectCMPChoice(deviceCode, choicePick) {
    await this.#getCMPChoice(deviceCode, choicePick);
  }

  async setDeviceCodeStatusInterval(deviceCode) {
    try {
      let authCode = '';
      console.log('device code:', deviceCode);

      if (!localStorage.getItem('userData')) {
        this._intervalId = setInterval(async () => {
          try {
            const statusResponse = await this.#getDeviceCodeStatus(deviceCode);
            console.log('statusResponse', statusResponse.data);
            console.log(authCode);

            if (statusResponse.data.status === 'approved') {
              // clearInterval(intervalId);
              this.clearPollingInterval(this._intervalId); // Use the clear function
              console.log('Device code status condition met, stopping the interval.');
              console.log('status:', statusResponse.data.status);
              console.log('autorization code:', statusResponse.data.authorization_code);
              authCode = statusResponse.data.authorization_code;
              const timestamp = Math.floor(Date.now() / 1000);

              const tokenData = await this.#getToken(
                statusResponse.data.authorization_code,
                timestamp
              );
              console.log(tokenData);
              localStorage.setItem('userData', JSON.stringify(tokenData.data));
              const event = new CustomEvent('userLogIn');
              window.dispatchEvent(event);
            }
          } catch (statusError) {
            console.error('Error fetching device code status:', statusError);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error fetching device code:', error);
      this.clearPollingInterval(this._intervalId); // Use the clear function on error
    }
  }

  clearPollingInterval() {
    clearInterval(this._intervalId);
  }

  get cmpData() {
    return this.#cmpData;
  }

  #getCMP = async (deviceCode) => {
    const response = await this._request({
      url: `/cmp`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-DEVICE-ID': deviceCode,
      },
    });

    return response;
  };

  #getCMPChoice = async (deviceCode, choicePick) => {
    return await this._request({
      url: `/cmp`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-Device-ID': deviceCode,
      },
      params: {
        choice: choicePick,
      },
    });
  };

  getDeviceCode = async () => {
    return await this._request({
      url: `/device.php`,
      apiVersion: auth,
      method: 'GET',
      params: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
      },
    });
  };

  #getDeviceCodeStatus = async (deviceCode) => {
    return await this._request({
      url: `/device-status.php`,
      apiVersion: auth,
      method: 'POST',
      params: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
        device_code: deviceCode,
      },
    });
  };

  #getToken = async (authorizationCode) => {
    const timestamp = new Date().getTime();

    return await this._request({
      url: `/token.php`,
      apiVersion: auth,
      method: 'POST',
      headers: {
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
        grant_type: 'authorization_code',
        code: authorizationCode,
      },
    });
  };

  revokeToken = async (token) => {
    return await this._request({
      url: `/revoke.php`,
      apiVersion: auth,
      method: 'POST',
      data: {
        client_id: 'c8a895d28ee9c800298d4e55d4e75586e7cec291',
        client_secret: 'b6d16f854b572ac95e3bd0a12ac6ed9d921767d7',
        token: token,
      },
    });
  };

  getFavorites = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/user/favorites`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });
  };

  addToFavorites = async (videoID, vodType) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/user/favorites`,
      apiVersion: V2,
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        _: timestamp,
      },
      data: {
        video_id: videoID,
        type: vodType,
      },
    });
  };

  removeFromFavorites = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/user/favorites`,
      apiVersion: V2,
      method: 'DELETE',
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
        'X-nocache': timestamp,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: {
        _: timestamp,
      },
      data: {
        video_id: videoID,
      },
    });
  };

  getRecentlyWatched = async (page, limit = 8) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/user/recently_watched`,
      apiVersion: V2,
      method: 'GET',
      headers: {
        'X-Authorization': `Bearer ${userData.access_token}`,
      },
      params: {
        cachebuster: timestamp,
        page,
        limit,
      },
    });
  };

  addRecentlyWatched = async (videoID, vodType, vodPosition, seriesID) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/user/recently_watched`,
      apiVersion: V2,
      method: 'POST',
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
        type: vodType,
        position: vodPosition,
        ...(seriesID && { series_id: seriesID }),
      },
    });
  };

  deleteRecentlyWatched = async (videoID) => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const timestamp = new Date().getTime();

    return await this._request({
      url: `/user/recently_watched`,
      apiVersion: V2,
      method: 'DELETE',
      headers: {
        'X-nocache': timestamp,
        'X-Authorization': `Bearer ${userData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        video_id: videoID,
      },
    });
  };
}

const cmpService = new CMPService();

export { cmpService as CMPService };
