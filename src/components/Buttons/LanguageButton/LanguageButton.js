import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';
import { createApiCtx } from '../../../Services/utils';
import axios from 'axios';
import { LOCAL_STORAGE_KEYS, ROUTES } from '../../../constants/globalConstants';
import { didomiVisible } from '../../../App';
import { InactivityService } from '../../../Services';
import { unload } from '../../Player/HLS';

export default class LanguageButton extends Lightning.Component {
  _props = {
    languageInfo: '',
    languageCode: '',
  };

  static _template() {
    return {
      collision: true,
      zIndex: 3,
      flex: { direction: 'row', alignItems: 'center' },
      flexItem: {
        marginBottom: 20,
      },
      color: Colors(colors.unfocusedLanguage).alpha(0).get(),
      w: 300,
      h: 65,
      rect: true,
      shader: { type: Lightning.shaders.RoundedRectangle, radius: 12 },
      Text: {
        y: 2,
        text: {
          fontSize: 32,
          fontFace: 'Montserrat-Bold',
          paddingLeft: 35,
        },
      },
    };
  }

  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
  }

  _enable() {
    const languageCode = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);
    const isSelected = this._props.languageCode === languageCode;

    this.patch({
      Text: {
        text: this._props.languageInfo,
        color: Colors(isSelected ? colors.focus : colors.white).get(),
        fontFace: 'Montserrat-Bold',
      },
    });
  }

  _findLanguageIndex() {
    const languageCode = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);
    const index = this._props.languageInfo.findIndex((info) => info.languageCode === languageCode);
    return index; // Vratiće -1 ako nije pronađen
  }

  _active() {
    const languageCode = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);
    const isSelected = this._props.languageCode === languageCode;

    if (isSelected) {
      this.fireAncestors('$setFocusLanguage', this._props.languageIndex);
    }
  }

  restartHbbTvApp() {
    if (window.disableRedButton) window.disableRedButton()
    const video = document.getElementById('lightning-video-player');
    if (video) {
      video.pause()
      unload(video)
      video.remove()
    }
    InactivityService.stop();
    this.application.closeApp();
    if (window.removeCanvasAndLightningScripts) window.removeCanvasAndLightningScripts()
    window.history.pushState({}, '', '/');
    if (window.showHbbtvLoader) window.showHbbtvLoader()
    if (window.insertLightningScripts) window.insertLightningScripts()
  }

  async _handleEnter() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE, this._props.languageCode);
    if (!!window.hbbtvApp) {
      this.restartHbbTvApp()
    } else {
      Router.navigate(ROUTES.HOME);
      window.location.reload();
    }
  }

  _focus() {
    this.patch({
      color: Colors(colors.focus).get(),
      Text: {
        color: Colors(colors.white).get(),
      },
    });
  }

  _unfocus() {
    const languageCode = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);
    const isSelected = this._props.languageCode === languageCode;

    this.patch({
      color: Colors(colors.unfocusedLanguage).alpha(0).get(),
      Text: {
        color: Colors(isSelected ? colors.focus : colors.white).get(),
      },
    });
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
  }

  async _handleClick() {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE, this._props.languageCode);
    const translations = await this.#getLanguageTranslations(this._props.languageCode);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_TRANSLATIONS, JSON.stringify(translations));
    Router.navigate(ROUTES.HOME);
    window.location.reload();
  }

  #getLanguageTranslations = async (lngCode) => {
    const translations = await axios(`${process.env.APP_BASE_URL_2}/lang/${lngCode}/app`, {
      params: {
        ctx: createApiCtx(),
      },
    });

    const res = translations.data;

    return res;
  };
}
