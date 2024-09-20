import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services/CMPService';
import qrcode from 'qrcode';
import LanguageButton from '../../Components/Buttons/LanguageButton/LanguageButton';
import { parseVodMoviesPageData } from '../../Models';
import { constructRails } from '../utils';
import MemberTabButton from '../../components/MemberTabButton/MemberTabButton';
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
    deviceData: undefined,
  };

  constructor(context) {
    super(context);
    this.userLoginButtonsUpdate = this.userLoginButtonsUpdate.bind(this);
  }

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
        clipping: true,
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  _active() {
    this._setState('DefaultState');
    this.$changeContent(0);
  }

  _disable() {
    CMPService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
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
      QRContainer: undefined,
      Languages: undefined,
      Favorites: undefined,
      RecentlyWatched: undefined,
    });
    CMPService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
    if (contentId === 0) {
      window.addEventListener('userLogIn', this.userLoginButtonsUpdate);

      const { device_code, verification_uri } = this._props.deviceData;
      await CMPService.setDeviceCodeStatusInterval(device_code);
      const qrCode = verification_uri.url;

      qrcode.toDataURL(qrCode).then((image) => {
        this.tag('Content').patch({
          QRContainer: {
            w: 1310,
            h: 800,
            flex: {
              direction: 'row',
            },
            Info: {
              flex: {
                direction: 'column',
              },
              w: 650,
              h: 800,
              Title: {
                h: 120,
                w: 450,
                text: {
                  text: `Sign up for unlimited entertainment - it's free!`,
                  fontFace: 'Montserrat-Bold',
                  fontSize: 30,
                  lineHeight: 35,
                  letterSpacing: 2,
                },
              },
              Text: {
                h: 200,
                w: 500,
                text: {
                  text: 'Sign up now for free and unlock even more features! Sync wedotv across all your devices and enjoy seamless streaming of your favorite movies and series – anytime, anywhere.',
                  fontFace: 'Montserrat-Regular',
                  fontSize: 25,
                  lineHeight: 30,
                  letterSpacing: 2,
                },
              },
            },
            Divider: {
              w: 1,
              h: 350,
              rect: true,
              color: Colors('#ffffff').alpha(0.5).get(),
            },
            QRCodeInfo: {
              x: 200,
              flex: {
                direction: 'column',
                alignItems: 'center',
              },
              QRCode: {
                w: 280,
                h: 280,
                src: image,
                zIndex: 100,
              },
              QRText: {
                flexItem: {
                  marginTop: 10,
                },
                text: {
                  text: 'Scan the QR code',
                  fontFace: 'Montserrat-Bold',
                  fontSize: 25,
                  lineHeight: 30,
                  letterSpacing: 2,
                },
              },
            },
          },
        });
      });
    } else if (contentId === 1) {
      //this._setState('Languages');
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
    } else if (contentId === 2) {
      const recentlyWatched = await CMPService.getRecentlyWatched();
      console.log(recentlyWatched.data.recently_watched);

      const parsedMovies = parseVodMoviesPageData({
        data: {
          entry: recentlyWatched.data.recently_watched,
        },
        itemsPerRow: 4,
      });

      this.tag('Content').patch({
        RecentlyWatched: {
          type: VerticalContainer,
          w: 1310,
          h: 920,
          props: {
            items: constructRails(parsedMovies),
            h: 920,
          },
        },
      });
    } else if (contentId === 3) {
      const favorites = await CMPService.getFavorites();
      console.log(favorites.data.favorites);
      const parsedMovies = parseVodMoviesPageData({
        data: {
          entry: favorites.data.favorites,
        },
        itemsPerRow: 4,
      });

      this.tag('Content').patch({
        Favorites: {
          type: VerticalContainer,
          w: 1310,
          h: 920,
          props: {
            items: constructRails(parsedMovies),
            h: 920,
          },
        },
      });
    }
  }

  userLoginButtonsUpdate() {
    this._Column._appendItems([
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 2,
          title: 'Continue Watching',
        },
        w: 250,
        h: 100,
        tabIndex: 2,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 3,
          title: 'Favorites',
        },
        w: 250,
        h: 100,
        tabIndex: 3,
      },
    ]);
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
          if (this.tag('Content.Favorites')) {
            this._setState('Favorites');
          }
          if (this.tag('Content.RecentlyWatched')) {
            this._setState('RecentlyWatched');
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

      class Favorites extends this {
        _getFocused() {
          return this.tag('Content.Favorites');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class RecentlyWatched extends this {
        _getFocused() {
          return this.tag('Content.RecentlyWatched');
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
