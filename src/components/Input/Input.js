import { Colors, Lightning } from '@lightningjs/sdk';
import { Input } from '@lightningjs/ui-components';
import { t } from '../../Services';
import { TRANSLATIONS } from '../../constants/globalConstants';

export default class InputField extends Lightning.Component {
  _props = {
    parentState: null,
  };

  static _template() {
    return {
      InputWrapper: {
        collision: true,
        w: 500,
        h: 110,
        rect: true,
        flex: { direction: 'row', alignItems: 'center' },
        Children: {
          flex: { direction: 'row' },
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
        text: t(TRANSLATIONS.SEARCH),
      },
    });
  }

  _getFocused() {
    return this;
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
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );
  }

  _handleUnhover() {
    this._unfocus();
  }
}
