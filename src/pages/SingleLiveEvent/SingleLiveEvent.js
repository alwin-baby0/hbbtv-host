import { Lightning, Utils } from '@lightningjs/sdk';

import GalleryItem from '../../components/GalleryItem/GalleryItem';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import Button from '../../components/Button/Button';
import { eventTrackPayload } from '../../utils/device';
import { t } from '../../Services';

export default class SingleLiveEvent extends Lightning.Component {
  _props = {};
  static _template() {
    return {
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

  set props(props) {
    // Assuming dateRange[0] is the start date and dateRange[1] is the end date
    const startDate = new Date(props.galleryItem.dateRange[0]);
    const endDate = new Date(props.galleryItem.dateRange[1]);
    const currentDate = new Date();

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

  _active() {
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

  static _states() {
    return [
      class HeroSection extends this {
        _getFocused() {
          this._SeriesWrapper.patch({
            y: 0,
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
