import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { DetailService, LoggingService, UserService } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload, getDeviceType } from '../../utils/device';
import {
  API_METHODS,
  API_URLS,
  EVENT_NAMES,
  IMG_PATH,
  LOCAL_STORAGE_KEYS,
  RAIL_TYPES,
  ROUTES,
  TRANSLATIONS,
  VIDEO_TYPES,
  VOD_PREVIEW_TYPES,
} from '../../constants/globalConstants';
import CategoryPicker from '../../components/CategoryPicker/CategoryPicker';
import { constructRails } from '../utils';
import { Metrics } from '@firebolt-js/sdk';
import { hideElementsAndCheckCmp } from '../../utils';
import { t } from '../../utils';
import { V2 } from '../../Services/utils';
import { parseSeasonData } from '../../Models';
import { railItemConstructor } from '../utils/railItems';

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
    if (this._HeroSection?._Info) this._HeroSection._Info.y = 120
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
      LoggingService.postLog(LOG_LEVEL.ERROR, e?.response?.status, e?.response);
    }
  }

  _firstEnable() {
    hideElementsAndCheckCmp();
  }

  async _active() {
    const {
      galleryItem,
      favorited,
      firstEpisodeVideoId,
      firstEpisodeUrl,
      firstEpisodeTitle,
      firstEpisodeEpisodeNumber,
      firstEpisodeSeasonNumber,
      isDeeplinkEpisode,
      position,
      seriesId,
      lastPlayedId,
      lastPlayedUrl,
      lastPlayedTitle,
      lastPlayedEpisodeNumber,
      lastPlayedSeasonNumber,
      lastPlayedEpisodeDuration,
      ssai,
      ssaiLastEp,
      episodeTitle,
      seasonTitle,
      seasonNumber,
      seriesTitle,
    } = this._props;
    const { id, badgeText } = galleryItem;

    eventTrackPayload(EVENT_NAMES.VIEW_SERIE, id, seriesId);
    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        height: 1080,
        firstEpisodeVideoId: firstEpisodeVideoId,
        firstEpisodeUrl: firstEpisodeUrl,
        firstEpisodeTitle: firstEpisodeTitle,
        firstEpisodeEpisodeNumber,
        firstEpisodeSeasonNumber,
        isDeeplinkEpisode: isDeeplinkEpisode,
        seriesId: seriesId,
        ssai,
        parentState: 'HeroSection',
        badgeText,
        episodeTitle,
        seasonTitle,
        seasonNumber,
        seriesTitle,
      },
      Info: {
        GalleryButton: {
          props: {
            width: 465,
            height: 78,
            buttonLabel: `${t(TRANSLATIONS.WATCH_FIRST_EPISODE)?.toUpperCase()}${(seasonNumber || firstEpisodeSeasonNumber) ? ` S${seasonNumber || firstEpisodeSeasonNumber}` : ''
              }${(seasonNumber ? '1' : firstEpisodeEpisodeNumber) ? ` E${seasonNumber ? '1' : firstEpisodeEpisodeNumber}` : ''
              }`,
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
                  marginLeft: 35,
                },
                props: {
                  buttonIcon: Utils.asset(IMG_PATH.PLAY_BTN),
                  buttonLabel: `${t(
                    TRANSLATIONS.CONTINUE_WATCHING
                  )?.toUpperCase()} S${lastPlayedSeasonNumber} E${lastPlayedEpisodeNumber}`,
                  width: 450,
                  height: 78,
                  position,
                  duration: lastPlayedEpisodeDuration,
                  callback: () => {
                    // this._HeroSection._Info.visible = false;
                    this._HeroSection._Spinner.visible = true;
                    this._HeroSection._Spinner
                      .animation({
                        duration: 2, // animation duration in seconds
                        repeat: -1, // repeat indefinitely
                        actions: [
                          { p: 'rotation', v: { 0: 0, 1: 10 * Math.PI } }, // rotate 360 degrees
                        ],
                      })
                      .start();

                    DetailService.getAdCues(lastPlayedId, seriesId, lastPlayedUrl).then(
                      ({ data: result }) => {
                        Router.navigate(ROUTES.PLAYER, {
                          videoUrl: result?.entry[0]?.files?.url ?? lastPlayedUrl,
                          duration: lastPlayedEpisodeDuration,
                          videoType: VIDEO_TYPES.SERIES,
                          seriesID: seriesId,
                          videoId: lastPlayedId,
                          episodeNumber: lastPlayedEpisodeNumber,
                          seasonNumber: lastPlayedSeasonNumber,
                          continueTime: position,
                          episodeTitle: lastPlayedTitle,
                          ssai: result?.entry[0]?.extensions?.ssai ?? ssaiLastEp,
                        });
                      }
                    );
                  },
                },
              },
              FavoriteButton: {
                y: 0,
                x: 0,
                flexItem: {
                  marginTop: 10,
                },
                alpha: 1,
                props: {
                  enabled: true,
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
                x: 35,
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


  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _BackButton() {
    return this.tag('BackButton');
  }

  get _SeasonsBar() {
    return this.tag('SeasonsBar');
  }

  _handleBack(e) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.EPISODE_ID_DETAIL);

    if (window.Didomi && didomiVisible) {
      return;
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
      items: [...constructRails(targetSeason), ...this._props.playlistVODS],
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
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('SeasonBar');
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('BackButton');
        }
      },

      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }
        _handleDown() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('HeroSection');
        }
      },

      class SeasonBar extends this {
        _getFocused() {
          return this._SeasonsBar;
        }
        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('HeroSection');
        }
        _handleDown() {
          if (window.Didomi && didomiVisible) {
            return;
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

        $verticalContainerIndexChange(index) {
          if (index > 0 && index !== undefined) {
            this.patch({
              SeriesWrapper: {
                y: -800,
              },
              SeasonsBar: {
                y: -200,
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
                y: -390,
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

        async $horizontalContainerIndexChange(index, position, page, seasonId, seriesId) {
          if (index === this._Column.Items.children[0].Items.children.length - 1) {
            const timestamp = new Date().getTime();

            const newRails = await DetailService._request({
              url: `/${API_URLS.GET_SEASON}`,
              apiVersion: V2,
              method: API_METHODS.GET,
              params: {
                _: timestamp,
                season_id: seasonId,
                page,
              },
              headers: {
                'X-API-Live-Key': process.env.APP_LIVE_KEY,
              },
            }).then((data) => parseSeasonData(data, seriesId, seasonId));

            if (newRails?.items) {
              const railItems = railItemConstructor(newRails.items, RAIL_TYPES.EPISODE);

              this._Column.Items.children[0]._appendItems(railItems);
            }
          }
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('SeasonBar');
        }
      },
    ];
  }
}
