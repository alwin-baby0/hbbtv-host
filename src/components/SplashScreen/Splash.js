import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { CMPService } from '../../Services/CMPService';

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        w: 1920,
        h: 1080,
        rect: true,
        src: Utils.asset('images/splash-screen.png'),
        zIndex: 1000,
      },
    };
  }

  async _active() {
    await CMPService.initialFetch();
    const buttonsResult = CMPService.cmpData;
    const expireTimeInMS = buttonsResult.consent?.expire.timestamp;

    setTimeout(() => {
      const currentTimeInMS = Math.floor(Date.now() / 1000);
      // console.log('Checking time:', currentTimeInMS);

      if (currentTimeInMS > expireTimeInMS) {
        Router.navigate('cmp');
      } else {
        Router.navigate('home');
      }
    }, 3000);
  }

  _disable() {
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    }
  }
}
