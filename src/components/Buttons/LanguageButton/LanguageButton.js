import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';
import { createApiCtx } from '../../../Services/utils';
import axios from 'axios';

export default class LanguageButton extends Lightning.Component {
  _props = {
    languageInfo: {},
  };
  static _template() {
    return {
      Column: {
        collision: true,
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
    const languageCode = localStorage.getItem('languageCode');
    const isSelected = this._props.languageInfo === languageCode;

    this._Column.patch({
      color: Colors(isSelected ? colors.focusedLanguage : colors.unfocusedLanguage).get(),
    });
  }

  _unselectButton() {
    this._selected = false;
    this._Column.patch({
      color: Colors(colors.unfocusedLanguage).get(),
    });
  }

  _enable() {
    const { languageInfo } = this._props;
    this._Column.patch({
      color: Colors(colors.background).get(),
      Text: {
        text: languageInfo,
        color: Colors(colors.white).get(),
        fontFace: 'Montserrat-SemiBold',
      },
    });
  }

  _findLanguageIndex() {
    const languageCode = localStorage.getItem('languageCode');
    const index = this._props.languageInfo.findIndex((info) => info.languageInfo === languageCode);
    return index; // Vratiće -1 ako nije pronađen
  }

  _active() {
    const languageCode = localStorage.getItem('languageCode');
    const isSelected = this._props.languageInfo === languageCode;

    if (isSelected) {
      this.fireAncestors('$setFocusLanguage', this._props.languageIndex);
    }
  }

  async _handleEnter() {
    localStorage.setItem('languageCode', this._props.languageInfo);
    const translations = await this.#getLanguageTranslations(this._props.languageInfo);
    localStorage.setItem('languageTr', JSON.stringify(translations));
    Router.navigate('home');
    window.location.reload();
  }

  _focus() {
    this._Column.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    const languageCode = localStorage.getItem('languageCode');
    const isSelected = this._props.languageInfo === languageCode;

    this._Column.patch({
      color: Colors(isSelected ? colors.focusedLanguage : colors.unfocusedLanguage).get(),
    });
  }

  _handleHover() {
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    localStorage.setItem('languageCode', this._props.languageInfo);
    Router.navigate('home');
    window.location.reload();
  }

  #getLanguageTranslations = async (lngCode) => {
    const translations = await axios(`https://api-applicaster.wedo.tv/lang/${lngCode}/app`, {
      params: {
        ctx: createApiCtx(),
      },
    });

    const res = translations.data;

    return res;
  };
}
