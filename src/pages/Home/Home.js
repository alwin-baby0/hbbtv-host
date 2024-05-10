import { Lightning, Router, Utils } from '@lightningjs/sdk';
import Button from '../../components/Button/Button';

export default class Home extends Lightning.Component {
  static _template() {
    return {
      Content: {
        Background: {
          w: 1920,
          h: 2080,
          src: Utils.asset('images/background.jpg'),
        },
        HeroButton: {
          type: Button,
          x: 110,
          y: 550,
          props: {
            buttonLabel: 'WATCH NOW',
            buttonIcon: Utils.asset('icons/home/play.svg'),
          },
        },
      },
    };
  }

  _enable() {
    this._setState('WachNowButton');
  }

  _init() {
    this._setState('TrailorButton');
  }

  static _states() {
    return [
      class WachNowButton extends this {
        _getFocused() {
          return this.tag('HeroButton');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },
    ];
  }
}
