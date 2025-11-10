import { Colors, Lightning, Router } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { AuthorizationService, UserService, t } from '../../Services';
import qrcode from 'qrcode';
import UserRecentlyWatched from './UserRecentlyWatched';
import UserFavorites from './UserFavorites';
import {
  LOCAL_STORAGE_KEYS,
  ROUTES,
  TRANSLATIONS,
  RAIL_TYPES,
} from '../../constants/globalConstants';
import { parseVodUserContentData } from '../../Models';
import { constructRails } from '../utils';

const states = ['UserRecentlyWatched', 'UserFavorites'];

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
    window.addEventListener('userLogIn', this.userLoginButtonsUpdate);
  }

  static _template() {
    return {
      collision: true,
      Background: {
        w: 1920,
        h: 1080,
        color: Colors(colors.background).get(),
        rect: true,
      },
      Content: {
        coliison: true,
        w: 1920,
        h: 1000,
        y: 80,
        clipping: true,
        QRContainer: {
          collision: true,
          Info: {
            Title: {
              text: {
                fontFace: 'Montserrat-Bold',
                fontSize: 32,
                lineHeight: 36,
                letterSpacing: 2,
              },
            },
          },
        },
      },
    };
  }

  get _Content() {
    return this.tag('Content');
  }

  get _UserFavorites() {
    return this.tag('Content.QRContainer.Favorites');
  }

  get _UserRecentlyWatched() {
    return this.tag('Content.QRContainer.RecentlyWatched');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this.$changeContent();
  }

  _enable() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE))
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE, 'en');
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

  async $horizontalContainerIndexChange(index, refName) {
    if (refName === 'RecentlyWatched') {
      if (
        index === this._UserRecentlyWatched._RecentlyWatched.Items.children.length - 1 &&
        this._props.hasMoreRcw
      ) {
        this._props.recentlyWPage++;
        const rcw = await UserService.getRecentlyWatched(this._props.recentlyWPage);

        if (!rcw.data.recently_watched || rcw.data.recently_watched.length < 8) {
          this._props.hasMoreRcw = false;
        }

        const parsedMovies = parseVodUserContentData({
          data: {
            entry: rcw.data.recently_watched,
            railType: RAIL_TYPES.CONTINUE_WATCHING,
          },
          itemsPerRow: 4,
        });

        const rails = constructRails(parsedMovies);

        this._UserRecentlyWatched._RecentlyWatched._appendItems(rails);
      }
    }

    if (refName === 'Favorites') {
      if (
        index === this._UserFavorites._Favorites.Items.children.length - 1 &&
        this._props.hasMoreFav
      ) {
        this._props.favoritesPage++;
        const favorites = await UserService.getFavorites(this._props.favoritesPage);

        if (!favorites.data.favorites || favorites.data.favorites.length < 8) {
          this._props.hasMoreFav = false;
        }

        const parsedMovies = parseVodUserContentData({
          data: {
            entry: favorites.data.favorites,
            railType: RAIL_TYPES.USER_CONTENT,
          },
          itemsPerRow: 4,
        });

        const rails = constructRails(parsedMovies);

        this._UserFavorites._Favorites._appendItems(rails);
      }
    }
  }

  async retrieveContentOnLogin() {
    const recentlyWatched = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
      ? await UserService.getRecentlyWatched()
      : undefined;

    const parsedMovies = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
      ? parseVodUserContentData({
          data: {
            railTitle: t(TRANSLATIONS.CONTINUE_WATCHING),
            railType: RAIL_TYPES.CONTINUE_WATCHING,
            entry: recentlyWatched.data.recently_watched,
          },
          itemsPerRow:
            recentlyWatched.data.recently_watched && recentlyWatched.data.recently_watched.length
              ? recentlyWatched.data.recently_watched.length
              : 0,
        })
      : undefined;

    const favorites = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
      ? await UserService.getFavorites()
      : undefined;

    const parsedFavorites = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)
      ? parseVodUserContentData({
          data: {
            railTitle: t(TRANSLATIONS.FAVORITES),
            railType: RAIL_TYPES.USER_CONTENT,
            entry: favorites.data.favorites,
          },
          itemsPerRow:
            favorites.data.favorites && favorites.data.favorites.length
              ? favorites.data.favorites.length
              : 0,
        })
      : undefined;

    this._props = { ...this._props, recentlyWatched, parsedMovies, favorites, parsedFavorites };
  }

  async $changeContent() {
    !this._props.recentlyWatched && (await this.retrieveContentOnLogin());

    const { recentlyWatched, favorites, parsedFavorites, parsedMovies, verificationUri } =
      this._props;

    if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
      const qrCode = verificationUri.url;

      qrcode.toDataURL(qrCode).then((image) => {
        this._Content.patch({
          QRContainer: {
            y: 200,
            x: 100,
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
              h: 540,
              y: 100,
              Title: {
                h: 120,
                w: 600,
                text: {
                  text: t(TRANSLATIONS.SIGNUP_TITLE),
                  wordWrap: true,
                  wordWrapWidth: 500,
                  maxLines: 2,
                  maxLinesSuffix: '...',
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
            QRCodeInfo: {
              x: 300,
              flex: {
                direction: 'column',
                alignItems: 'center',
              },
              QRCode: {
                w: 440,
                h: 440,
                src: image,
                zIndex: 100,
              },
              QRText: {
                flexItem: {
                  marginTop: 30,
                },
                text: {
                  text: t(TRANSLATIONS.SIGNUP_SCAN),
                  fontFace: 'Montserrat-Bold',
                  fontSize: 27,
                  lineHeight: 30,
                  letterSpacing: 2,
                },
              },
            },
          },
        });
      });
    } else {
      this._Content.patch({
        QRContainer: {
          collision: true,
          y: 100,
          x: 100,
          w: 1450,
          h: 800,
          flex: {
            direction: 'column',
          },
          Info: undefined,
          Divider: undefined,
          QRCodeInfo: undefined,
          RecentlyWatched: {
            type: UserRecentlyWatched,
            collision: true,
            w: 1450,
            h:
              !recentlyWatched?.data?.recently_watched ||
              recentlyWatched?.data?.recently_watched?.length === 0
                ? 95
                : 320,
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
            collision: true,
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

      this._setState('UserRecentlyWatched');
    }
  }

  async userLoginButtonsUpdate() {
    this.$changeContent();
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
          return this._UserRecentlyWatched;
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

        _handleUp() {
          this._setState('UserRecentlyWatched');
        }
      },
    ];
  }
}
