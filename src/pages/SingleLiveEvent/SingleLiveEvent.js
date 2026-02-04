import { Lightning, Router, Utils } from '@lightningjs/sdk';
import BackBtn from '../../components/BackButton/BackBtn';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import Button from '../../components/Button/Button';
import { eventTrackPayload } from '../../utils/device';
import { CMPService, t } from '../../Services';
import { EVENT_NAMES, IMG_PATH, ROUTES, TRANSLATIONS } from '../../constants/globalConstants';

const states = ['BackButton', 'HeroSection', 'Items'];

export default class SingleLiveEvent extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      w: 1920,
      h: 1080,
      BackButton: {
        collision: true,
        type: BackBtn,
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.BACK_BTN), 80, 80),
        x: 45,
        y: 30,
        zIndex: 100,
        props: {
          parentState: 'BackButton',
        },
      },
      SeriesWrapper: {
        rect: true,
        h: 883,
        w: 1570,
        HeroSection: {
          h: 1080,
          collision: true,
          type: GalleryItem,
        },
      },
      Wrapper: {
        collision: true,
        x: 110,
        y: 800,
        h: 600,
        w: 1765,
        clipping: true,
        Column: {
          collision: true,
          h: 600,
          w: 1700,
          type: VerticalContainer,
        },
      },
    };
  }

  get _BackButton() {
    return this.tag('BackButton');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this._render();
  }

  _render() {
    const currentTime = new Date().getTime(); //in ms
    let listSchedule = this._props.galleryItem.list_schedule;

    let upcomingSchedule = listSchedule.filter((event) => event.end.timestamp * 1000 > currentTime);
    const startTime = upcomingSchedule?.[0]?.start?.timestamp * 1000;
    const endTime = upcomingSchedule?.[0]?.end?.timestamp * 1000;

    this._Column.props = {
      items: [],
      parentState: 'Items',
    };

    const { galleryItem, fallbackImage } = this._props;

    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        fallbackImage,
        height: 883,
        yPos: 100,
        parentState: 'HeroSection',
        startTime,
        endTime,
        badgeText: galleryItem.badgeText,
      },
    });

    //Hide Button
    if (currentTime >= startTime && currentTime <= endTime) {
      this._HeroSection.patch({
        props: {
          enabled: true,
        },
        Info: {
          GalleryButton: {
            type: Button,
            flexItem: {
              marginTop: 10,
            },
            props: {
              buttonLabel: t(TRANSLATIONS.WATCH_NOW)?.toUpperCase(),
              buttonIcon: Utils.asset(IMG_PATH.PLAY_BTN),
              width: 400,
              height: 78,
              enabled: true,
            },
            visible: true,
          },
        },
      });
    } else {
      this._HeroSection.patch({
        props: {
          enabled: false,
        },
        Info: {
          GalleryButton: {
            type: Button,
            flexItem: {
              marginTop: 10,
            },
            props: {
              width: 400,
              buttonLabel: t(TRANSLATIONS.COMING_SOON)?.toUpperCase(),
              enabled: false,
              height: 78,
            },
          },
        },
      });
    }
  }

  $updateEvent() {
    this._render();
  }

  async _active() {
    if (!this._props.cmpShown) {
      await CMPService.initialFetch();
      const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;
      const currentTimeInMS = Math.floor(Date.now() / 1000);

      if (expireTimeInMS === 0 || currentTimeInMS > expireTimeInMS) {
        Router.navigate(
          ROUTES.CMP,
          { movieId: this._props.galleryItem.id, url: ROUTES.EVENT_DETAILS },
          false
        );
      }
    }

    const { galleryItem } = this._props;

    eventTrackPayload(EVENT_NAMES.VIEW_STREAM, galleryItem.id);
  }

  _getFocused() {
    return this._HeroSection;
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

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _handleBack(e) {
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

  static _states() {
    return [
      class BackButton extends this {
        _getFocused() {
          this._SeriesWrapper.patch({
            y: 0,
          });
          return this._BackButton;
        }

        _handleDown() {
          this._setState('HeroSection');
        }

        _handleRight() {
          this._setState('HeroSection');
        }
      },
      class HeroSection extends this {
        _getFocused() {
          this.patch({
            BackButton: {
              y: 30,
            },
            SeriesWrapper: {
              y: 0,
            },
          });
          return this._HeroSection;
        }

        _handleUp() {
          this._setState('BackButton');
        }

        _handleDown() {
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
          this._Wrapper.patch({
            y: 800,
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
                h: 1080,
              },
              Wrapper: {
                y: 600,
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
