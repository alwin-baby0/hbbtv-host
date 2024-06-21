import lng from '@lightningjs/core';
import { Colors } from '@lightningjs/sdk';
lng;
let selectedLanguageIndex = 0;
let selectedCategorieIndex = 0;
export default class Button extends lng.Component {
  constructor(props) {
    super(props);
  }
  static _template() {
    return {
      Button: {
        collision: true,
        rect: true,
        color: Colors('#49484d').get(),
        flex: {
          direction: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        Selector: {
          y: 3,
          text: { fontSize: 40 },
        },
        Text: {
          y: 3,
          text: {
            fontSize: 25,
            color: Colors('#fafafa').get(),
            wordWrapWidth: 120,
            textAlign: 'center',
          },
        },
      },
    };
  }

  set flag(val) {
    this._flag = val;
  }

  set data(val) {
    this._data = val;
  }

  set index(val) {
    this._index = val;
  }

  get _Text() {
    return this.tag('Text');
  }

  get _Button() {
    return this.tag('Button');
  }

  get _Selector() {
    return this.tag('Selector');
  }

  _handleEnter() {
    const handleCommonLogic = () => {
      this.parent.children.forEach((button) => {
        if (button instanceof Button) {
          button._Selector.patch({
            flexItem: { marginRight: 0 },
            text: { text: '' },
          });
        }
      });
      this._Selector.patch({
        flexItem: { marginRight: 10 },
        text: { text: '•' },
      });
    };

    switch (this._flag) {
      case 'language':
        if (selectedLanguageIndex !== this._index) {
          handleCommonLogic();
          this.fireAncestors('$changedVODLanguage', { data: this._data });
          selectedLanguageIndex = this._index;
        }
        break;

      case 'genre':
        if (selectedCategorieIndex === this._index) {
          return true;
        }
        handleCommonLogic();
        this.fireAncestors('$changedVODGenre', { data: this._data.vod });
        selectedCategorieIndex = this._index;
        break;
    }
  }

  _firstEnable() {
    if (this._index === 0) {
      this._Selector.patch({
        flexItem: { marginRight: 20 },
        text: { text: '•' },
      });
    } else {
      this._Selector.patch({
        flexItem: { marginRight: 0 },
        text: { text: '' },
      });
    }
    this._Button.patch({
      w: this.w,
      h: this.h,
      texture: lng.Tools.getRoundRect(this.w, this.h, 5, 3, false),
    });
    this._Text.patch({
      text: this._data.languageTitle || this._data.genre,
    });
  }

  _focus() {
    this._Button.patch({
      color: Colors('#C40000').get(),
    });
  }
  _unfocus() {
    this._Button.patch({
      color: Colors('#49484d').get(),
    });
  }

  _handleHover() {
    this.fireAncestors('$setState', this._flag);

    // Clear old timeout, if any
    if (this._hoverTimeoutId) {
      clearTimeout(this._hoverTimeoutId);
    }

    // Set new timeout
    this._hoverTimeoutId = setTimeout(() => {
      this.fireAncestors('$setFocusBtn', { index: this._index, flag: this._flag });
    }, 10);

    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    this._handleEnter();
  }
}
