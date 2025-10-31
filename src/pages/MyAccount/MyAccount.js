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
  'DefaultState',
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
      Wrapper: {
        x: 110,
        y: 225,
        h: 300,
        w: 1720,
        Column: {
          collision: true,
          h: 400,
          w: 300,
          type: VerticalContainer,
        },
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

  get _Column() {
    return this.tag('Column');
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
    this._setState('DefaultState');
    this._Column.Items.children[this._contentId]._focus();
    this.$setFocus(this._contentId);
    this.$changeContent(this._contentId);
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

  async $verticalContainerIndexChange(index, refName) {
    if (refName === 'RecentlyWatched') {
      if (index === this._RecentlyWatched.Items.children.length - 1 && this._props.hasMoreRcw) {
        this._props.recentlyWPage++;
        const rcw = await UserService.getRecentlyWatched(this._props.recentlyWPage);

        if (rcw.data.recently_watched.length < 8) {
          this._props.hasMoreRcw = false;
        }

        const parsedMovies = parseVodMoviesPageData({
          data: {
            entry: rcw.data.recently_watched,
          },
          itemsPerRow: 4,
        });

        const rails = constructRails(parsedMovies);

        this._RecentlyWatched._appendItems(rails);
      }
    }

    if (refName === 'Favorites') {
      if (index === this._Favorites.Items.children.length - 1 && this._props.hasMoreFav) {
        this._props.favoritesPage++;
        const favorrrr = await UserService.getFavorites(this._props.favoritesPage);

        if (favorrrr.data.favorites.length < 8) {
          this._props.hasMoreFav = false;
        }

        const parsedMovies = parseVodMoviesPageData({
          data: {
            entry: favorrrr.data.favorites,
          },
          itemsPerRow: 4,
        });

        const rails = constructRails(parsedMovies);

        this._Favorites._appendItems(rails);
      }
    }
  }

  changeContentTimeout = null;

  async $changeContent(contentId) {
    this._contentId = contentId;
    if (this.changeContentTimeout) {
      clearTimeout(this.changeContentTimeout);
      this.changeContentTimeout = null;
    }
    this.changeContentTimeout = setTimeout(async () => {
      this._Content.patch({
        QRContainer: undefined,
        Favorites: undefined,
        RecentlyWatched: undefined,
        y: 225,
      });
      AuthorizationService.clearPollingInterval();
      window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
      if (contentId === 0) {
        const response = await AuthorizationService.getDeviceCode();

        const device_code = response.data.device_code;
        const verification_uri = response.data.verification_uri;

        window.addEventListener('userLogIn', this.userLoginButtonsUpdate);

        if (!localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
          await AuthorizationService.setDeviceCodeStatusInterval(device_code);
          const qrCode = verification_uri.url;

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
      } else if (contentId === 1) {
        this._props.hasMoreRcw = true;
        this._props.recentlyWPage = 1;
        const recentlyWatched = await UserService.getRecentlyWatched();

        const parsedMovies = parseVodMoviesPageData({
          data: {
            entry: recentlyWatched.data.recently_watched,
          },
          itemsPerRow: 4,
        });

        this._Content.patch({
          QRContainer: undefined,
          RecentlyWatched: {
            collision: true,
            type: VerticalContainer,
            w: 1310,
            h: 920,
            props: {
              items: constructRails(parsedMovies),
              h: 920,
              parentState: 'RecentlyWatched',
              ...((!recentlyWatched?.data?.recently_watched ||
                recentlyWatched?.data?.recently_watched?.length === 0) && {
                railTitle: t(TRANSLATIONS.NO_CONTINUE_WATCHING),
              }),
            },
          },
        });
      } else if (contentId === 2) {
        this._props.hasMoreFav = true;
        this._props.favoritesPage = 1;
        const favorites = await UserService.getFavorites();
        const parsedMovies = parseVodMoviesPageData({
          data: {
            entry: favorites.data.favorites,
          },
          itemsPerRow: 4,
        });

        this._Content.patch({
          QRContainer: undefined,
          Favorites: {
            collision: true,
            type: VerticalContainer,
            w: 1310,
            h: 920,
            props: {
              items: constructRails(parsedMovies),
              h: 920,
              parentState: 'Favorites',
              ...((!favorites?.data?.favorites || favorites?.data?.favorites?.length === 0) && {
                railTitle: t(TRANSLATIONS.NO_FAVORITES),
              }),
            },
          },
        });
      } else if (contentId === 3) {
        AuthorizationService.revokeToken(
          localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA).access_token
        );
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
        AuthorizationService.clearPollingInterval();
        this.$setFocus(0);
        this._Column._removeLastItems(3);
        this.$changeContent(0);
      }
    }, 1000);
  }

  userLoginButtonsUpdate() {
    this.$changeContent(0);

    this._Column._appendItems([
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 1,
          title: t(TRANSLATIONS.CONTINUE_WATCHING),
        },
        w: 250,
        h: 100,
        tabIndex: 1,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 2,
          title: t(TRANSLATIONS.FAVORITES),
        },
        w: 250,
        h: 100,
        tabIndex: 2,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 3,
          title: t(TRANSLATIONS.LOGOUT),
        },
        w: 250,
        h: 100,
        tabIndex: 3,
      },
    ]);
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
      class DefaultState extends this {
        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          Router.focusWidget(ROUTES.MENU_WIDGET);
        }

        _handleRight() {
          if (this._Favorites) {
            this._setState('Favorites');
          }
          if (this._RecentlyWatched) {
            this._setState('RecentlyWatched');
          }
          if (this._UserRecentlyWatched) {
            this._setState('UserRecentlyWatched');
          }
        }
      },

      class Favorites extends this {
        _getFocused() {
          return this._Favorites;
        }

        _handleUp() {
          Router.focusWidget(ROUTES.MENU_WIDGET);
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class RecentlyWatched extends this {
        _getFocused() {
          return this._RecentlyWatched;
        }

        _handleUp() {
          Router.focusWidget(ROUTES.MENU_WIDGET);
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class UserRecentlyWatched extends this {
        _getFocused() {
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

        _handleLeft() {
          this._setState('DefaultState');
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

        _handleLeft() {
          this._setState('DefaultState');
        }
      },
    ];
  }
}
