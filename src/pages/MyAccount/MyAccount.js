import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { AuthorizationService, t, UserService } from '../../Services';
import qrcode from 'qrcode';
import { parseVodMoviesPageData, parseVodUserContentData } from '../../Models';
import { constructRails } from '../utils';
import MemberTabButton from '../../components/MemberTabButton/MemberTabButton';
import UserRecentlyWatched from './UserRecentlyWatched';
import UserFavorites from './UserFavorites';
import { LOCAL_STORAGE_KEYS, ROUTES, TRANSLATIONS } from '../../constants/globalConstants';

const states = [
  // 'DefaultState',
  'Favorites',
  'RecentlyWatched',
  'UserRecentlyWatched',
  'UserFavorites',
];

export default class MyAccount extends Lightning.Component {
  _contentId = 0;
  _props = {
    lastId: 0,
    lastLanguage: 0,
    deviceData: undefined,
    isLoggedIn: false,
    favoritesPage: 1,
    hasMoreFav: true,
    recentlyWPage: 1,
    hasMoreRcw: true,
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
      Content: {
        w: 1450,
        h: 1020,
        x: 480,
        y: 225,
        clipping: true,
      },
    };
  }

  get _Content() {
    return this.tag('Content');
  }

  get _Favorites() {
    return this.tag('Content.Favorites');
  }

  get _UserFavorites() {
    return this.tag('Content.QRContainer.Favorites');
  }

  get _RecentlyWatched() {
    return this.tag('Content.RecentlyWatched');
  }

  get _UserRecentlyWatched() {
    return this.tag('Content.QRContainer.RecentlyWatched');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  _enable() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE))
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE, 'en');
  }

  _active() {
    this._setState('UserRecentlyWatched');
    this.$changeContent();
  }

  _disable() {
    AuthorizationService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
    this._props.hasMoreFav = true;
    this._props.favoritesPage = 1;
    this._props.hasMoreRcw = true;
    this._props.recentlyWPage = 1;
  }

  $setStateOnHover(nextState) {
    this._setState(nextState);
  }

  async $changeContent() {
    this._Content.patch({
      QRContainer: undefined,
      Favorites: undefined,
      RecentlyWatched: undefined,
      y: 225,
    });
    AuthorizationService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);

    const response = await AuthorizationService.getDeviceCode();

    const device_code = response.data.device_code;
    const verification_uri = response.data.verification_uri;

    window.addEventListener('userLogIn', this.userLoginButtonsUpdate);

    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
      await AuthorizationService.setDeviceCodeStatusInterval(device_code);
      const qrCode = verification_uri.url;
      console.log(qrCode);

      qrcode.toDataURL(qrCode).then((image) => {
        this._Content.patch({
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
                  text: t(TRANSLATIONS.SIGNUP_TITLE),
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
                  text: t(TRANSLATIONS.SIGNUP_DESCRIPTION),
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
                  text: t(TRANSLATIONS.SIGNUP_SCAN),
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
      const recentlyWatched = await UserService.getRecentlyWatched();
      console.log(recentlyWatched);

      const parsedMovies = parseVodUserContentData({
        data: {
          railTitle: t(TRANSLATIONS.CONTINUE_WATCHING),
          entry: recentlyWatched.data.recently_watched,
        },
        itemsPerRow:
          recentlyWatched.data.recently_watched && recentlyWatched.data.recently_watched.length
            ? recentlyWatched.data.recently_watched.length
            : 0,
      });

      const favorites = await UserService.getFavorites();

      const parsedFavorites = parseVodUserContentData({
        data: {
          railTitle: t(TRANSLATIONS.FAVORITES),
          entry: favorites.data.favorites,
        },
        itemsPerRow:
          favorites.data.favorites && favorites.data.favorites.length
            ? favorites.data.favorites.length
            : 0,
      });

      this._Content.patch({
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
                text: t(TRANSLATIONS.LOGGED_IN_MSG),
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
            h:
              !recentlyWatched?.data?.recently_watched ||
              recentlyWatched?.data?.recently_watched?.length === 0
                ? 95
                : 500,
            props: {
              items: parsedMovies,
              parentState: 'UserRecentlyWatched',
              ...((!recentlyWatched?.data?.recently_watched ||
                recentlyWatched?.data?.recently_watched?.length === 0) && {
                railTitle: t(TRANSLATIONS.NO_CONTINUE_WATCHING),
              }),
            },
          },
          Favorites: {
            type: UserFavorites,
            w: 1450,
            h: 920,
            props: {
              items: parsedFavorites,
              parentState: 'UserFavorites',
              ...((!favorites?.data?.favorites || favorites?.data?.favorites?.length === 0) && {
                railTitle: t(TRANSLATIONS.NO_FAVORITES),
              }),
            },
          },
        },
      });
    }
  }

  userLoginButtonsUpdate() {
    this.$changeContent(0);
  }

  _handleBack() {
    Router.setHistory([{ hash: ROUTES.HOME, state: null }]);
    Router.back();
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  static _states() {
    return [
      class UserRecentlyWatched extends this {
        _getFocused() {
          console.log('here');
          return this._UserRecentlyWatched;
        }

        $enter() {
          this._Content.patch({
            y: 225,
            QRContainer: {
              Info: {
                Title: {
                  h: 120,
                  w: 1310,
                  text: {
                    text: t(TRANSLATIONS.LOGGED_IN_MSG),
                    fontFace: 'Montserrat-Bold',
                    fontSize: 30,
                    lineHeight: 35,
                    letterSpacing: 2,
                  },
                },
                h: 100,
              },
            },
          });
        }

        _handleUp() {
          Router.focusWidget(ROUTES.MENU_WIDGET);
        }

        _handleDown() {
          this._setState('UserFavorites');
        }
      },

      class UserFavorites extends this {
        _getFocused() {
          return this._UserFavorites;
        }

        $enter() {
          this._Content.patch({
            y: 80,
            QRContainer: {
              Info: {
                Title: undefined,
                h: 0,
              },
            },
          });
        }

        _handleUp() {
          this._setState('UserRecentlyWatched');
        }
      },
    ];
  }
}
