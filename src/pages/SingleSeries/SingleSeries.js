import { Lightning, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import GalleryItem from '../../Components/GalleryItem/GalleryItem';

export default class SingleSeries extends Lightning.Component {
  static _template() {
    return {
      h: 1080,
      w: 1920,
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.jpg'),
      },
      SeriesWrapper: {
        HeroSection: {
          type: GalleryItem,
        },
      },
      Wrapper: {
        x: 110,
        y: 715,
        h: 600,
        w: 1700,
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
    const { galleryItem } = props;
    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        height: 650,
      },
    });

    this._HeroSection._GalleryButton.patch({
      props: {
        width: 400,
        buttonLabel: 'WATCH FIRST EPISODE',
      },
    });
  }

  _active() {
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

  _init() { }

  _getFocused() { }

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
          if (this.tag('Column').Items.children.length > 0) {
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
