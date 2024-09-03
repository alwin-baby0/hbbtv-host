import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class LanguageButton extends Lightning.Component {
  _props = {
    languageInfo: {},
  };
  static _template() {
    return {
      Column: {
        flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
        w: 1045,
        h: 85,
        rect: true,
        Text: {},
      },
    };
  }

  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
  }

  get _Column() {
    return this.tag('Column');
  }

  _selectButton() {
    this._selected = true;
    var languageCode = localStorage.getItem('languageCode');
    let selectedLanguage =
      languageCode === 'en' ? 0 : languageCode === 'de' ? 1 : languageCode === 'it' ? 2 : undefined;

    this.tag('Column').patch({
      color:
        selectedLanguage === 0 ? Colors(colors.focus).get() : Colors(colors.focusedLanguage).get(),
    });
  }

  _unselectButton() {
    this._selected = false;
    this.tag('Column').patch({
      color: Colors(colors.unfocusedLanguage).get(),
    });
  }

  _enable() {
    const { languageInfo } = this._props;
    this.tag('Column').patch({
      color: Colors(colors.background).get(),
    });

    this.tag('Column.Text').patch({
      text: languageInfo.code,
      color: Colors(colors.white).get(),
      fontFace: 'Montserrat-SemiBold',
    });
  }

  _active() {
    var languageCode = localStorage.getItem('languageCode');
    let selectedLanguage =
      languageCode === 'en' ? 0 : languageCode === 'de' ? 1 : languageCode === 'it' ? 2 : undefined;

    // Set the new selected language and update the UI
    this._selectedLanguage = selectedLanguage;
    this.fireAncestors('$setFocus', selectedLanguage);
  }

  _init() {}

  _handleEnter() {
    const { languageInfo } = this._props;
    const languageCode = languageInfo.value;
    localStorage.setItem('languageCode', languageCode);

    Router.navigate('home');
    window.location.reload();
  }

  _focus() {
    this.tag('Column').patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    if (this._selected) {
      this.tag('Column').patch({
        color: Colors(colors.focusedLanguage).get(),
      });
    } else {
      this.tag('Column').patch({
        color: Colors(colors.unfocusedLanguage).get(),
      });
    }
  }

  _getFocused() {}

  static _states() {
    return [];
  }
}
