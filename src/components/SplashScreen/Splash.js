import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { Registry } from '@lightningjs/sdk';

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        src: Utils.asset('images/splash-screen.png'),
      },
    };
  }

  _firstActive() {
    setTimeout(() => {
      Router.navigate('home', false);
    }, 3000);
  }

  _inactive() {
    setTimeout(() => {
      Registry.clearTimeouts();
    }, 3000);
  }
}
