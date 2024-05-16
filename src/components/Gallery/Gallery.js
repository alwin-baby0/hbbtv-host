import { Lightning } from '@lightningjs/sdk';
import GalleryItem from '../GalleryItem/GalleryItem';

export default class Gallery extends Lightning.Component {
  _sliderIndex = 0;
  _props = {
    sliderData: [],
  };

  static _template() {
    return {
      x: 0,
      y: 0,
      w: 1920,
      h: 800,
      Gallery: {
        type: GalleryItem,
      },
    };
  }

  set props(props) {
    this._sliderIndex = 0;
    this._props = { ...this._props, ...props };
  }

  get _Gallery() {
    return this.tag('Gallery');
  }

  _active() {
    this._nextVideo();
  }

  _nextVideo() {
    const { sliderData } = this._props;

    this._Gallery.patch({
      props: {
        galleryItem: sliderData.items[this._sliderIndex],
      },
    });
  }

  _handleLeft() {
    const { sliderData } = this._props;

    if (sliderData.items.length > 1) {
      this._sliderIndex =
        this._sliderIndex > 0 ? this._sliderIndex - 1 : sliderData.items.length - 1;
      this._nextVideo();
    }
  }

  _handleRight() {
    const { sliderData } = this._props;

    if (sliderData.items.length > 1) {
      this._sliderIndex =
        this._sliderIndex < sliderData.items.length - 1 ? this._sliderIndex + 1 : 0;
      this._nextVideo();
    }
  }

  _getFocused() {
    return this._Gallery;
  }
}
