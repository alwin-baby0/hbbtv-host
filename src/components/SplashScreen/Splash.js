import { Lightning, Router, Utils } from '@lightningjs/sdk';

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

  _enable() {
    setTimeout(() => {
      Router.navigate('home', false);
    }, 3000);
  }
}
