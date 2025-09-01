import { Lightning, Utils } from '@lightningjs/sdk';
import BackBtn from '../../components/BackButton/BackBtn';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';

export default class Collection extends Lightning.Component {
  _props = {};

  static _template() {
    return {
      Wrapper: {
        w: 1920,
        h: 1080,
        BackButton: {
          collision: true,
          type: BackBtn,
          texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
          x: 45,
          y: 30,
        },
        Column: {
          collision: true,
          w: 1700,
          h: 600,
          x: 100,
          y: 150,
          type: VerticalContainer,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  get _Column() {
    return this.tag('Column');
  }

  get _BackButton() {
    return this.tag('BackButton');
  }

  _active() {
    this._setState('Column');
  }

  _getFocused() {
    return this._Column;
  }

  static _states() {
    return [
      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }

        _handleDown() {
          this._setState('Column');
        }

        _handleRight() {
          this._setState('Column');
        }
      },

      class Column extends this {
        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          this._setState('BackButton');
        }

        _handleLeft() {
          this._setState('BackButton');
        }
      },
    ];
  }
}
