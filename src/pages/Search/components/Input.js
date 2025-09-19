import { Colors, Utils } from '@lightningjs/sdk';
import { Input } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import { t } from '../../../Services';

export default class InputField extends lng.Component {
  static _template() {
    return {
      InputWrapper: {
        collision: true,
        w: 1700,
        h: 110,
        rect: true,
        flex: { direction: 'row', alignItems: 'center' },
        Children: {
          flex: { direction: 'row' },
          IconWrapper: {
            h: 110,
            w: 80,
            flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
            Icon: {
              texture: lng.Tools.getSvgTexture(Utils.asset('/icons/ic_menu_search.SVG'), 50, 50),
            },
          },
          Input: {
            type: Input,
            y: 5,
            w: 1100,
            h: 100,
            listening: false,
            style: {
              backgroundColor: Colors('black').alpha(0).get(),
            },
          },
        },
      },
      Placeholder: {
        y: 3,
        x: 110,
        h: 110,
        w: 600,
        flex: { direction: 'row', alignItems: 'center' },
        color: Colors('#ffffff').alpha(0.3).get(),
        Text: {
          text: {
            // text: 'Search',
            fontSize: 32,
            lineHeight: 40,
            textColor: Colors('#ffffff').alpha(0.3).get(),
          },
        },
      },
    };
  }

  get _Placeholder() {
    return this.tag('Placeholder');
  }

  get _Input() {
    return this.tag('Input');
  }

  get _InputWrapper() {
    return this.tag('InputWrapper');
  }

  $setClearButtonState() {
    this._setState('ClearIcon');
  }

  _changePlaceholder() {
    if (this._Input.value === '') {
      this._Placeholder.patch({
        visible: true,
      });
    } else {
      this._Placeholder.visible = false;
    }
  }

  _active() {
    this._Placeholder.patch({
      Text: {
        text: t('search'),
      },
    });
    this._setState('Input');
  }

  static _states() {
    return [
      class Input extends this {
        _getFocused() {
          return this;
        }

        _handleRight() {
          this._setState('ClearIcon');
        }

        _focus() {
          this.fireAncestors('$setInputState');
          this._Input.listening = true;
        }

        _unfocus() {
          this._Input.listening = false;
        }

        _handleHover() {
          this._focus();
        }

        _handleUnhover() {
          this._unfocus();
        }
      },

      class ClearIcon extends this {
        _getFocused() {
          return this._ClearIcon;
        }

        _handleLeft() {
          this._setState('Input');
        }
      },
    ];
  }
}
