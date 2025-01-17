import { Colors, Language, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import LanguageButton from '../../Components/Buttons/LanguageButton/LanguageButton';
import { CMPService } from '../../Services/CMPService';
import Button from '../../Components/Button/Button';

export default class LanguageSettings extends Lightning.Component {
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
        // clipping: true,
        CMPContainer: {
          w: 1310,
          h: 920,
          Buttons: {
            w: 1050,
            h: 400,
            y: 100,
            type: VerticalContainer,
          },
        },
        // Buttons: {
        //   w: 1050,
        //   h: 400,
        //   y: 100,
        //   type: VerticalContainer,
        // },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
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
      this._Column._focusedIndex = 0;
    } else {
      this._Column.Items.children[id]._selectButton();
      this._Column._focusedIndex = id;
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
      CMPContainer: undefined,
      Languages: undefined,
    });
    if (contentId === 0) {
      await CMPService.initialFetch();
      const serialNumber = localStorage.getItem('serialNumber');

      const buttonsResult = CMPService.cmpData.buttons;

      const buttons = Object.values(buttonsResult).map((value) => {
        return {
          type: Button,
          w: 1050,
          flexItem: {
            marginBottom: 18,
          },
          props: {
            width: 1050,
            height: 72,
            // buttonLabel: value.label,
            buttonLabel: Language.translate(value.label),
            buttonIcon: '',
            strokeWidth: 1.5,
            borderColor: '#696969',
            callback: async () => {
              if (value.callback_url) {
                const chosenValue = value.label === 'Yes, I Agree' ? 1 : 0;
                await CMPService.selectCMPChoice(serialNumber, chosenValue);
                await Router.navigate('home');
              } else {
                Router.navigate('cmp-customize', { options: value.options });
              }
            },
          },
        };
      });

      this.tag('Content').patch({
        CMPContainer: {
          flex: { direction: 'column', alignItems: 'center' },
          w: 1310,
          h: 920,
          Title: {
            w: 1000,
            h: 50,
            text: {
              // text: 'We value you privacy',
              text: Language.translate('CMPTitle'),
              fontSize: 40,
              fontFace: 'Montserrat-Bold',
              lineHeight: 50,
              textAlign: 'center',
            },
          },
          Description: {
            w: 1000,
            h: 100,
            y: 30,
            text: {
              // text: 'We use cookies to enhance browsing experience. By clicking “Yes” you consent to our use of cookies. You can customize your consent preferences by clicking “Customize”',
              text: Language.translate('CMPDescription'),
              fontSize: 24,
              fontFace: 'Montserrat-Regular',
              lineHeight: 30,
              textAlign: 'center',
            },
          },
          Buttons: {
            w: 1050,
            h: 400,
            y: 100,
            type: VerticalContainer,
            props: {
              items: buttons,
            },
          },
        },
      });

      // console.log('b8tt', buttonsResult);
    } else if (contentId === 1) {
      console.log(this._props);
      const { languages } = this._props.languagesData;
      const languagesArr = languages.split(',');

      const items = languagesArr.map((language, index) => ({
        type: LanguageButton,
        props: {
          languageInfo: language,
          languageIndex: index,
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
    }
  }

  /* _getFocused() {
    return this.tag('Wrapper.Column');
  } */

  _active() {
    this._setState('DefaultState');
    this.$changeContent(0);
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
          if (this.tag('Content.CMPContainer')) {
            this._setState('CMPContainer');
          }
          if (this.tag('Content.Languages')) {
            this._setState('Languages');
          }
        }
      },

      class CMPContainer extends this {
        _getFocused() {
          return this.tag('Content.CMPContainer.Buttons');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },

      class Languages extends this {
        _getFocused() {
          return this.tag('Content.Languages');
        }

        _handleUp() {
          this._setState('DefaultState');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },
    ];
  }
}
