import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services/CMPService';
import qrcode from 'qrcode';
import LanguageButton from '../../Components/Buttons/LanguageButton/LanguageButton';
const languagesData = [
  {
    code: 'EN',
    value: 'en',
  },
  {
    code: 'DE',
    value: 'de',
  },
  {
    code: 'IT',
    value: 'it',
  },
];

export default class Settings extends Lightning.Component {
  _props = {
    lastId: 0,
    lastLanguage: 0,
  };
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: Colors(colors.background).get(),
        rect: true,
      },
      Wrapper: {
        x: 110,
        y: 225,
        h: 300,
        w: 1720,
        Column: {
          h: 300,
          w: 1720,
          type: VerticalContainer,
        },
      },
      Content: {
        w: 1310,
        h: 920,
        x: 480,
        y: 225,
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  _firstActive() {
    this._setState('DefaultState');
    this.$changeContent(0);
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this._Column.Items.children[lastId]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this._Column.Items.children[0]._selectButton();
    } else {
      this._Column.Items.children[id]._selectButton();
    }
    // Update the lastId variable with the current ID
    this._props.lastId = id;
  }

  $setFocusLanguage(id) {
    const { lastLanguage } = this._props;

    if (typeof lastLanguage !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this.tag('Content.Languages').Items.children[lastLanguage]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this.tag('Content.Languages').Items.children[0]._selectButton();
    } else {
      this.tag('Content.Languages').Items.children[id]._selectButton();
    }
    // Update the lastId variable with the current ID
    this._props.lastLanguage = id;
  }

  async $changeContent(contentId) {
    this.tag('Content').patch({
      QRCode: undefined,
      Languages: undefined,
    });
    if (contentId !== 0) {
      CMPService.clearPollingInterval();
    }
    if (contentId === 0) {
      const getQRCode = await CMPService.fetchDeviceCode();
      const qrCode = getQRCode.verification_uri.url;

      qrcode.toDataURL(qrCode).then((image) => {
        this.tag('Content').patch({
          QRCode: {
            w: 263,
            h: 263,
            src: image,
            zIndex: 100,
          },
        });
      });
    } else if (contentId === 1) {
      this._setState('Languages');
      const items = languagesData.map((language) => ({
        type: LanguageButton,
        props: {
          languageInfo: language,
        },
        w: 1050,
        h: 100,
      }));

      this.tag('Content').patch({
        Languages: {
          type: VerticalContainer,
          w: 1050,
          h: 300,
          props: {
            items: items,
            enableScroll: false,
            w: 1050,
            h: 300,
          },
        },
      });
    } else {
    }
  }

  static _states() {
    return [
      class DefaultState extends this {
        _getFocused() {
          return this.tag('Wrapper.Column');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleRight() {
          if (this.tag('Content.Languages')) {
            this._setState('Languages');
          }
        }
      },

      class Languages extends this {
        _getFocused() {
          return this.tag('Content.Languages');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },
    ];
  }
}
