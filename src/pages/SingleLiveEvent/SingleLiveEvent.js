import { Lightning, Router, Utils } from '@lightningjs/sdk';
import BackBtn from '../../components/BackButton/BackBtn';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import Button from '../../components/Button/Button';
import { eventTrackPayload } from '../../utils/device';
import { CMPService, t } from '../../Services';

export default class SingleLiveEvent extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      w: 1920,
      h: 1080,
      BackButton: {
        collision: true,
        type: BackBtn,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
        x: 45,
        y: 30,
        zIndex: 100,
      },
      SeriesWrapper: {
        Content: {
          Background: {
            w: 1920,
            h: 2080,
            src: Utils.asset('images/background.jpg'),
          },
          HeroSection: {
            type: GalleryItem,
          },
        },
      },
      Wrapper: {
        x: 110,
        y: 715,
        h: 600,
        w: 1765,
        clipping: true,
        Column: {
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
    // Assuming dateRange[0] is the start date and dateRange[1] is the end date
    // dateRange is in seconds
    const startDate = props.galleryItem.dateRange[0] * 1000;
    const endDate = props.galleryItem.dateRange[1] * 1000;
    const currentDate = new Date().getTime();

    this._Column.props = {
      items: [],
    };

    this._props = { ...this._props, ...props };
    const { galleryItem, fallbackImage } = this._props;

    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        fallbackImage,
        height: 650,
        yPos: 100,
      },
    });

    //Hide Button
    if (currentDate >= startDate && currentDate <= endDate) {
      this._HeroSection.patch({
        Info: {
          GalleryButton: {
            type: Button,
            flexItem: {
              marginTop: 10,
            },
            props: {
              buttonLabel: t('watch_now')?.toUpperCase(),
              buttonIcon: Utils.asset('icons/home/play.svg'),
              width: 400,
            },
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
              buttonLabel: t('coming_soon')?.toUpperCase(),
              enabled: false,
            },
          },
        },
      });
    }
  }

  async _active() {
    if (!this._props.cmpShown) {
      await CMPService.initialFetch();
      const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;
      const currentTimeInMS = Math.floor(Date.now() / 1000);

      if (expireTimeInMS === 0 || currentTimeInMS > expireTimeInMS) {
        Router.navigate(
          'cmp',
          { movieId: this._props.galleryItem.id, url: 'event-details' },
          false
        );
      }
    }

    const { galleryItem } = this._props;

    eventTrackPayload('view_stream', galleryItem.id);
  }

  _getFocused() {
    return this._HeroSection;
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _HeroSectionInfo() {
    return this.tag('HeroSection.Info');
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
      (history) => history.hash != 'splash' && history.hash != 'cmp'
    );

    if (routerHistory.length) {
      Router.back();
    } else {
      Router.navigate('home');
    }

    this._setState('HeroSection');
  }

  static _states() {
    return [
      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }

        _handleDown() {
          this._setState('Items');
        }

        _handleRight() {
          this._setState('HeroSection');
        }
      },
      class HeroSection extends this {
        _getFocused() {
          this._SeriesWrapper.patch({
            y: 0,
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
