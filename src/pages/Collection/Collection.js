import { Lightning, Utils } from '@lightningjs/sdk';
import BackBtn from '../../components/BackButton/BackBtn';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { IMG_PATH } from '../../constants/globalConstants';

export default class Collection extends Lightning.Component {
  _props = {};

  static _template() {
    return {
      Background: {
        src: Utils.asset(IMG_PATH.BACKGROUND_COLLECTION_PAGE),
        y: 0,
        x: 350,
        w: 1570,
        h: 883,
        zIndex: 1,
      },
      Overlay: {
        src: Utils.asset(IMG_PATH.GRADIENT_SVG),
        zIndex: 2,
      },
      Wrapper: {
        y: 0,
        x: 0,
        w: 1920,
        h: 1080,
        zIndex: 3,
        BackButton: {
          collision: true,
          type: BackBtn,
          texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.BACK_BTN), 80, 80),
          x: 45,
          y: 30,
          props: {
            parentState: 'BackButton',
          },
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

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  static _states() {
    return [
      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }

        _handleDown() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('Column');
        }

        _handleRight() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('Column');
        }
      },

      class Column extends this {
        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('BackButton');
        }

        _handleLeft() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('BackButton');
        }
      },
    ];
  }
}
