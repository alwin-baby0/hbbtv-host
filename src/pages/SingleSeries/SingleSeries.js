import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { CMPService, DetailService, t, UserService } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload, getDeviceType } from '../../utils/device';
import {
  EVENT_NAMES,
  IMG_PATH,
  LOCAL_STORAGE_KEYS,
  ROUTES,
  TRANSLATIONS,
  VIDEO_TYPES,
  VOD_PREVIEW_TYPES,
} from '../../constants/globalConstants';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';
import { constructRails } from '../utils';
import { Metrics } from '@firebolt-js/sdk';

const states = ['HeroSection', 'BackButton', 'Items'];

export default class SingleSeries extends Lightning.Component {
  _props = {};

  constructor(context) {
    super(context);
    this.switchSeason = this.switchSeason.bind(this);
  }

  static _template() {
    return {
      h: 1080,
      w: 1920,
      BackButton: {
        type: BackBtn,
        collision: true,
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.BACK_BTN), 80, 80),
        x: 85,
        y: 20,
        zIndex: 100,
        props: {
          parentState: 'BackButton',
        },
      },
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset(IMG_PATH.BACKGROUND),
      },
      SeriesWrapper: {
        rect: true,
        h: 883,
        w: 1570,
        HeroSection: {
          collision: true,
          h: 1080,
          type: GalleryItem,
        },
      },
      SeasonsBar: {
        type: CategoryPicker,
        props: {
          x: 110,
          y: 810,
        },
        zIndex: 2,
      },
      Wrapper: {
        collision: true,
        x: 110,
        y: 915,
        h: 600,
        w: 1770,
        clipping: true,
        Column: {
          collision: true,
          h: 600,
          w: 1770,
          type: VerticalContainer,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  async addToFavorite() {
    try {
      const { favorited, seriesId } = this._props;
      if (favorited) {
        await UserService.removeFromFavorites(seriesId);
      } else {
        await UserService.addToFavorites(seriesId, VOD_PREVIEW_TYPES.SERIES);
      }

      this._props.favorited = !this._props.favorited;

      const { favorited: newFavorited } = this._props;

      this._HeroSection._FavoriteButton.patch({
        props: {
          buttonIcon: Utils.asset(newFavorited ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE),
          buttonLabel: '',
          width: 100,
          height: 78,
          parentState: 'HeroSection',
        },
      });
    } catch (e) {
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(
          Metrics.ErrorType.MEDIA,
          '400',
          'Failed to update favorite status of VOD',
          true
        );
      console.log('error', e);
    }
  }

  async _active() {
    if (!this._props.cmpShown) {
      await CMPService.initialFetch();
      const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;
      const currentTimeInMS = Math.floor(Date.now() / 1000);

      if (expireTimeInMS === 0 || currentTimeInMS > expireTimeInMS) {
        Router.navigate(
          ROUTES.CMP,
          { movieId: this._props.seriesId, url: ROUTES.SERIES_DETAILS },
          false
        );
      }
    }

    const {
      galleryItem,
      favorited,
      duration,
      firstEpisodeVideoId,
      firstEpisodeUrl,
      firstEpisodeTitle,
      isDeeplinkEpisode,
      position,
      seriesId,
      lastPlayedId,
      lastPlayedUrl,
      lastPlayedTitle,
      ssai,
      ssaiLastEp,
    } = this._props;
    const { id } = galleryItem;

    eventTrackPayload(EVENT_NAMES.VIEW_SERIE, id, seriesId);
    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        height: 1080,
        firstEpisodeVideoId: firstEpisodeVideoId,
        firstEpisodeUrl: firstEpisodeUrl,
        firstEpisodeTitle: firstEpisodeTitle,
        isDeeplinkEpisode: isDeeplinkEpisode,
        seriesId: seriesId,
        ssai,
        parentState: 'HeroSection',
      },
      Info: {
        GalleryButton: {
          props: {
            width: 430,
            height: 78,
            buttonLabel: t(TRANSLATIONS.WATCH_FIRST_EPISODE)?.toUpperCase(),
          },
        },
      },
    });

    const isValidPosition =
      position !== undefined && position !== null && !isNaN(position) && position > 0;

    if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
      if (isValidPosition) {
        this._HeroSection._Info.patch(
          {
            AuthorizedButtons: {
              flex: { direction: 'row' },
              w: 1000,
              ContinueWatching: {
                alpha: 1,
                flexItem: {
                  marginRight: 15,
                },
                props: {
                  buttonIcon: Utils.asset(IMG_PATH.PLAY_BTN),
                  buttonLabel: t(TRANSLATIONS.CONTINUE_WATCHING)?.toUpperCase(),
                  width: 440,
                  height: 78,
                  position,
                  duration,
                  callback: () => {
                    DetailService.getAdCues(lastPlayedId, seriesId, lastPlayedUrl).then(
                      ({ data: result }) => {
                        Router.navigate(ROUTES.PLAYER, {
                          videoUrl: result[0]?.content?.src ?? lastPlayedUrl,
                          duration: duration,
                          videoType: VIDEO_TYPES.SERIES,
                          seriesID: seriesId,
                          videoId: lastPlayedId,
                          continueTime: position,
                          episodeTitle: lastPlayedTitle,
                          ssai: result[0].extensions?.ssai ?? ssaiLastEp,
                        });
                      }
                    );
                  },
                },
              },
              FavoriteButton: {
                y: 0,
                flexItem: {
                  marginTop: 10,
                },
                alpha: 1,
                props: {
                  buttonIcon: Utils.asset(favorited ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE),
                  buttonLabel: '',
                  width: 100,
                  height: 78,
                  callback: () => {
                    this.addToFavorite();
                  },
                },
              },
            },
          },
          true
        );
      } else {
        this._HeroSection._Info.patch(
          {
            AuthorizedButtons: {
              flex: undefined,
              ContinueWatching: {
                alpha: 0,
                w: 0,
                flexItem: {
                  marginRight: 0,
                },
              },
              FavoriteButton: {
                y: 10,
                flexItem: {
                  marginTop: 10,
                },
                alpha: 1,
                props: {
                  buttonIcon: Utils.asset(favorited ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE),
                  buttonLabel: '',
                  width: 100,
                  height: 78,
                  callback: () => {
                    this.addToFavorite();
                  },
                },
              },
            },
          },
          true
        );
      }
    }
    this._setState('HeroSection');
    window.addEventListener('switchS', (event) => {
      this.switchSeason(event.detail.seasonId);
    });
  }

  _disable() {}

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _SeriesWrapper() {
    return this.tag('SeriesWrapper');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _BackButton() {
    return this.tag('BackButton');
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  get _SeasonsBar() {
    return this.tag('SeasonsBar');
  }

  _handleBack(e) {
    if (window.Didomi && window.Didomi.notice.isVisible()) {
      return true;
    }

    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();

    const routerHistory = Router.getHistory().filter(
      (history) => history.hash != ROUTES.SPLASH && history.hash != ROUTES.CMP
    );

    if (routerHistory.length) {
      Router.back();
    } else {
      Router.navigate(ROUTES.HOME);
    }

    this._setState('HeroSection');
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  switchSeason(seasonId) {
    let targetSeason = this._props.allSeasons.find((season) => season.seasonId === seasonId);
    this._Column.props = {
      items: constructRails(targetSeason),
      parentState: 'Items',
    };
  }

  static _states() {
    return [
      class HeroSection extends this {
        _getFocused() {
          this.patch({
            SeriesWrapper: {
              y: 0,
            },
            BackButton: {
              y: 20,
            },
            SeasonsBar: {
              y: 810,
            },
            Wrapper: {
              y: 915,
              h: 600,
            },
          });
          return this._HeroSection;
        }

        _handleDown() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('SeasonBar');
        }

        _handleUp() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('BackButton');
        }
      },

      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }
        _handleDown() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('HeroSection');
        }
      },

      class SeasonBar extends this {
        _getFocused() {
          return this._SeasonsBar;
        }
        _handleUp() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('HeroSection');
        }
        _handleDown() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          if (this._Column.Items.children.length > 0) {
            this._setState('Items');
          } else {
            return false;
          }
        }
      },

      class Items extends this {
        _getFocused() {
          return this._Column;
        }

        $enter() {
          this.$verticalContainerIndexChange();
        }

        $exit() {
          /* this._Wrapper.patch({
            y: 915,
            h: 600,
          }); */
        }

        $verticalContainerIndexChange(index) {
          if (index > 0 && index !== undefined) {
            this.patch({
              SeriesWrapper: {
                y: -650,
              },
              Wrapper: {
                y: 0,
                h: 1080,
                Column: {
                  h: 1080,
                },
              },
            });
          } else {
            this.patch({
              BackButton: {
                y: -180,
              },
              SeriesWrapper: {
                y: -340,
              },
              SeasonsBar: {
                y: 420,
              },
              Wrapper: {
                y: 500,
                h: 1080,
                Column: {
                  h: 1080,
                },
              },
            });
          }
        }

        _handleUp() {
          if (window.Didomi && window.Didomi.notice.isVisible()) {
            return true;
          }

          this._setState('SeasonBar');
        }
      },
    ];
  }
}
