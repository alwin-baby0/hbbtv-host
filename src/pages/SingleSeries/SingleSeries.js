import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { CMPService, DetailService, t } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload } from '../../utils/device';

export default class SingleSeries extends Lightning.Component {
  _props = {};

  static _template() {
    return {
      h: 1080,
      w: 1920,
      BackButton: {
        type: BackBtn,
        collision: true,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
        x: 85,
        y: 20,
        zIndex: 100,
      },
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.jpg'),
      },
      SeriesWrapper: {
        rect: true,
        h: 620,
        w: 1920,
        HeroSection: {
          collision: true,
          h: 620,
          type: GalleryItem,
        },
      },
      Wrapper: {
        collision: true,
        x: 110,
        y: 715,
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
        await CMPService.removeFromFavorites(seriesId);
      } else {
        await CMPService.addToFavorites(seriesId, 'series');
      }

      this._props.favorited = !this._props.favorited;

      const { favorited: newFavorited } = this._props;

      this._HeroSection._FavoriteButton.patch({
        props: {
          buttonIcon: Utils.asset(newFavorited ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
          buttonLabel: t('favorite')?.toUpperCase(),
          width: 360,
        },
      });
    } catch (e) {
      //skip
      console.log('error', e);
    }
  }

  async _active() {
    const router = Router.getHistory().filter((history) => history.hash != 'splash');
    if (!router.length) {
      await CMPService.initialFetch();
      const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;
      const currentTimeInMS = Math.floor(Date.now() / 1000);

      if (expireTimeInMS && currentTimeInMS > expireTimeInMS) {
        Router.navigate('cmp', false);
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

    eventTrackPayload('view_serie', id);
    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        height: 620,
        firstEpisodeVideoId: firstEpisodeVideoId,
        firstEpisodeUrl: firstEpisodeUrl,
        firstEpisodeTitle: firstEpisodeTitle,
        isDeeplinkEpisode: isDeeplinkEpisode,
        seriesId: seriesId,
        ssai,
      },
      Info: {
        GalleryButton: {
          props: {
            width: 430,
            buttonLabel: t('watch_first_episode')?.toUpperCase(),
          },
        },
      },
    });

    const isValidPosition =
      position !== undefined && position !== null && !isNaN(position) && position > 0;

    if (localStorage.getItem('userData')) {
      if (isValidPosition) {
        this._HeroSection._Info.patch(
          {
            AuthorizedButtons: {
              flex: { direction: 'row' },
              ContinueWatching: {
                alpha: 1,
                flexItem: {
                  marginRight: 10,
                },
                props: {
                  buttonIcon: Utils.asset('icons/home/play.svg'),
                  buttonLabel: t('continue_watching')?.toUpperCase(),
                  width: 440,
                  callback: () => {
                    DetailService.getAdCues(lastPlayedId, seriesId, lastPlayedUrl).then(
                      ({ data: result }) => {
                        Router.navigate('player', {
                          videoUrl: result[0]?.content?.src ?? lastPlayedUrl,
                          duration: duration,
                          videoType: 'series',
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
                  buttonIcon: Utils.asset(favorited ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
                  buttonLabel: t('favorite').toUpperCase(),
                  width: 360,
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
                  buttonIcon: Utils.asset(favorited ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
                  buttonLabel: t('favorite').toUpperCase(),
                  width: 360,
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
  }

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

  $updateVerticalState(nextState) {
    this._setState(nextState);
  }

  _getFocused() {}

  _handleBack(e) {
    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();
    const router = Router.getHistory().filter((history) => history.hash != 'splash');
    if (router.length) {
      Router.setHistory([...router]);
      Router.back();
    } else {
      Router.navigate('home');
    }
    this._setState('HeroSection');
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
          });
          return this._HeroSection;
        }

        _handleDown() {
          if (this._Column.Items.children.length > 0) {
            this._setState('Items');
          } else {
            return false;
          }
        }

        _handleUp() {
          this._setState('BackButton');
        }
      },

      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }
        _handleDown() {
          this._setState('HeroSection');
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
          this._Wrapper.patch({
            y: 715,
            h: 600,
          });
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
                y: -140,
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
          this._setState('HeroSection');
        }
      },
    ];
  }
}
