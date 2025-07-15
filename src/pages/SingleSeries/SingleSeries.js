import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { CMPService, DetailService, parseTranslations, t } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload } from '../../utils/device';

export default class SingleSeries extends Lightning.Component {
  _props = {};
  _translations;
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

    this._translations = parseTranslations();
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
          buttonLabel: t(this._translations, 'favorite')?.toUpperCase(),
          width: 360,
        },
      });
    } catch (e) {
      //skip
      console.log('error', e);
    }
  }

  _active() {
    const {
      galleryItem,
      favorited,
      duration,
      firstEpisodeVideoId,
      firstEpisodeUrl,
      isDeeplinkEpisode,
      position,
      seriesId,
      lastPlayedId,
      lastPlayedUrl,
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
        isDeeplinkEpisode: isDeeplinkEpisode,
        seriesId: seriesId,
        ssai,
      },
    });

    this._HeroSection._GalleryButton.patch({
      props: {
        width: 430,
        buttonLabel: t(this._translations, 'watch_first_episode')?.toUpperCase(),
      },
    });

    const isValidPosition =
      position !== undefined && position !== null && !isNaN(position) && position > 0;

    if (localStorage.getItem('userData')) {
      if (isValidPosition) {
        this._HeroSection.tag('Info').patch(
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
                  buttonLabel: t(this._translations, 'continue_watching')?.toUpperCase(),
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
                  buttonLabel: t(this._translations, 'favorite').toUpperCase(),
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
        this._HeroSection.tag('Info').patch(
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
                  buttonLabel: t(this._translations, 'favorite').toUpperCase(),
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

  $updateVerticalState(nextState) {
    this._setState(nextState);
  }

  _init() {}

  _getFocused() {}

  _handleBack(e) {
    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();
    const router = Router.getHistory().filter((history) => history.hash != 'splash');
    Router.setHistory([...router]);
    Router.back();
    this._setState('HeroSection');
  }

  static _states() {
    return [
      class HeroSection extends this {
        _getFocused() {
          this._SeriesWrapper.patch({
            y: 0,
          });
          this._BackButton.patch({
            y: 20,
          });
          return this._HeroSection;
        }

        _handleDown() {
          if (this.tag('Column').Items.children.length > 0) {
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
          this.tag('Wrapper').patch({
            y: 715,
            h: 600,
          });
        }

        $verticalContainerIndexChange(index) {
          if (index > 0 && index !== undefined) {
            this._SeriesWrapper.patch({
              y: -650,
            });
            this.tag('Wrapper').patch({
              y: 0,
              h: 1080,
            });
            this.tag('Column').patch({
              h: 1080,
            });
          } else {
            this._BackButton.patch({
              y: -180,
            });
            this._SeriesWrapper.patch({
              y: -140,
            });
            this.tag('Wrapper').patch({
              y: 500,
              h: 1080,
            });
            this.tag('Column').patch({
              h: 1080,
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
