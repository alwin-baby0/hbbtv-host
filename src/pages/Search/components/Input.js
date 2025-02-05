import { Colors, Language, Utils } from '@lightningjs/sdk';
import { Input } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import defTr from '../../../../static/translations/en.json';
import { parseTranslations } from '../../../Services/HomePageService';

export default class InputField extends lng.Component {
  _translations;
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

  /* set props(props) {
    this._translations = parseTranslations();
  } */

  _active() {
    this._translations = parseTranslations();

    this._Placeholder.patch({
      Text: {
        text: this._translations?.search || defTr.search,
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
          this.tag('Input').listening = true;
        }

        _unfocus() {
          this.tag('Input').listening = false;
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
