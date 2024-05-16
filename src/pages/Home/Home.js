import { Lightning, Router, Utils } from '@lightningjs/sdk';
import Gallery from '../../components/Gallery/Gallery';

export default class Home extends Lightning.Component {
  _props = {
    sliderData: null,
    railData: [],
  };
  static _template() {
    return {
      Content: {
        Background: {
          w: 1920,
          h: 2080,
          src: Utils.asset('images/background.jpg'),
        },
        GallerySection: {
          x: 0,
          y: 0,
          w: 1920,
          h: 800,
          type: Gallery,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { sliderData, railData } = this._props;
    this._GallerySection.patch({
      props: {
        sliderData,
      },
    });
  }

  get _GallerySection() {
    return this.tag('GallerySection');
  }

  _enable() {
    this._setState('GallerySection');
  }

  static _states() {
    return [
      class GallerySection extends this {
        _getFocused() {
          return this._GallerySection;
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },
    ];
  }
}
