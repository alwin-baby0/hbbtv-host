import { Colors, Language, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services/CMPService';
import qrcode from 'qrcode';
import LanguageButton from '../../Components/Buttons/LanguageButton/LanguageButton';
import { parseVodMoviesPageData, parseVodUserContentData } from '../../Models';
import { constructRails } from '../utils';
import MemberTabButton from '../../components/MemberTabButton/MemberTabButton';
import UserRecentlyWatched from './UserRecentlyWatched';
import UserFavorites from './UserFavorites';

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
    isLoggedIn: false,
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
        // w: 1310,
        w: 1450,
        // h: 920,
        h: 1020,
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

  _enable() {
    if (!localStorage.getItem('languageCode')) localStorage.setItem('languageCode', 'en');
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
      y: 225,
    });
    CMPService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
    if (contentId === 0) {
      const response = await CMPService.getDeviceCode();

      const device_code = response.data.device_code;
      const verification_uri = response.data.verification_uri;

      const userLanguageTranslations = this._props.userLanguageTranslations;
      // console.log(userLanguageTranslations);

      const selectedLanguageCode = localStorage.getItem('languageCode');

      const languageObject = userLanguageTranslations.find(
        (item) => item.lang === selectedLanguageCode
      );

      window.addEventListener('userLogIn', this.userLoginButtonsUpdate);

      if (!localStorage.getItem('userData')) {
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
                w: 750,
                h: 800,
                Title: {
                  h: 120,
                  w: 500,
                  text: {
                    text: languageObject?.title,
                    fontFace: 'Montserrat-Bold',
                    fontSize: 30,
                    lineHeight: 35,
                    letterSpacing: 2,
                  },
                },
                Text: {
                  h: 300,
                  w: 650,
                  text: {
                    text: languageObject?.text,
                    fontFace: 'Montserrat-Regular',
                    fontSize: 25,
                    lineHeight: 30,
                    letterSpacing: 2,
                  },
                },
              },
              Divider: {
                w: 1,
                h: 450,
                rect: true,
                color: Colors('#ffffff').alpha(0.5).get(),
              },
              QRCodeInfo: {
                x: 150,
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
                    text: languageObject?.scanText,
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
      } else {
        const recentlyWatched = await CMPService.getRecentlyWatched();
        // console.log(recentlyWatched.data.recently_watched);
        // console.log(recentlyWatched.data.recently_watched.length);

        const parsedMovies = parseVodUserContentData({
          data: {
            // railTitle: 'Continue Watching',
            railTitle: Language.translate('continueWatching'),
            entry: recentlyWatched.data.recently_watched,
          },
          itemsPerRow: recentlyWatched.data.recently_watched.length,
        });

        const favorites = await CMPService.getFavorites();

        const parsedFavorites = parseVodUserContentData({
          data: {
            // railTitle: 'Favorites',
            railTitle: Language.translate('favorites'),
            entry: favorites.data.favorites,
          },
          itemsPerRow: favorites.data.favorites.length,
        });

        this.tag('Content').patch({
          QRContainer: {
            w: 1450,
            h: 800,
            flex: {
              direction: 'column',
            },
            Info: {
              w: 1310,
              h: 100,
              Title: {
                h: 120,
                w: 1310,
                text: {
                  // text: languageObject?.loggedInText,
                  text: languageObject?.loggedInText,
                  fontFace: 'Montserrat-Bold',
                  fontSize: 30,
                  lineHeight: 35,
                  letterSpacing: 2,
                },
              },
            },
            RecentlyWatched: {
              type: UserRecentlyWatched,
              w: 1450,
              h: 500,
              props: {
                items: parsedMovies,
              },
            },
            Favorites: {
              type: UserFavorites,
              w: 1450,
              h: 920,
              props: {
                items: parsedFavorites,
              },
            },
          },
        });
      }
    } else if (contentId === 1) {
      const recentlyWatched = await CMPService.getRecentlyWatched();
      console.log(recentlyWatched.data.recently_watched);
      console.log(recentlyWatched.data.recently_watched.length);

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
    } else if (contentId === 2) {
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
    } else if (contentId === 3) {
      CMPService.revokeToken(localStorage.getItem('userData').access_token);
      localStorage.removeItem('userData');
      CMPService.clearPollingInterval();
      this.$setFocus(0);
      this._Column._removeLastItems(3);
      this.$changeContent(0);
    }
  }

  userLoginButtonsUpdate() {
    //this._props.isLoggedIn = true;
    this.$changeContent(0);

    this._Column._appendItems([
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 1,
          // title: 'Continue Watching',
          title: Language.translate('continueWatching'),
        },
        w: 250,
        h: 100,
        tabIndex: 1,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 2,
          // title: 'Favorites',
          title: Language.translate('favorites'),
        },
        w: 250,
        h: 100,
        tabIndex: 2,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 3,
          // title: 'Logout',
          title: Language.translate('logout'),
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
          if (this.tag('Content.QRContainer.RecentlyWatched')) {
            this._setState('UserRecentlyWatched');
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

      class UserRecentlyWatched extends this {
        _getFocused() {
          return this.tag('Content.QRContainer.RecentlyWatched');
        }

        $enter() {
          const userLanguageTranslations = this._props.userLanguageTranslations;
          console.log(userLanguageTranslations);

          const selectedLanguageCode = localStorage.getItem('languageCode');

          const languageObject = userLanguageTranslations.find(
            (item) => item.lang === selectedLanguageCode
          );
          // this.tag('Content.QRContainer.Info.Title').patch({
          //   visible: true,
          // });
          this.tag('Content.QRContainer.Info').patch({
            Title: {
              h: 120,
              w: 1310,
              text: {
                // text: languageObject?.loggedInText,
                text: languageObject?.loggedInText,
                fontFace: 'Montserrat-Bold',
                fontSize: 30,
                lineHeight: 35,
                letterSpacing: 2,
              },
            },
            h: 100,
          });
          this.tag('Content').patch({
            y: 225,
          });
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('UserFavorites');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class UserFavorites extends this {
        _getFocused() {
          return this.tag('Content.QRContainer.Favorites');
        }

        $enter() {
          console.log('entered');
          // this.tag('Content.QRContainer.Info.Title').patch({
          //   visible: false,
          // });
          this.tag('Content.QRContainer.Info').patch({
            Title: undefined,
            h: 0,
          });

          this.tag('Content').patch({
            y: 80,
          });
        }

        _handleUp() {
          this._setState('UserRecentlyWatched');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },
    ];
  }
}
