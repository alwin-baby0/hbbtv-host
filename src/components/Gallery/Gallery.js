import { Lightning, Colors } from '@lightningjs/sdk';
import { Row } from '@lightningjs/ui-components';
import colors from '../../../reskin/colors.json';
import GalleryItem from '../GalleryItem/GalleryItem';
import Bullet from '../Bullet/Bullet';
import HomeRailItem from '../../api/home/HomeRailItem';

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
      HeroSection: {
        type: GalleryItem,
      },
      Bullet: {
        type: Row,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        y: 820,
        w: 1920,
        h: 20,
      },
    };
  }

  _preloadSliderDataImages(sliderData) {
    sliderData.items.forEach((item) => {
      item.preloadImages(HomeRailItem.extraLarge);
    });
  }

  set props(props) {
    this._sliderIndex = 0;
    this._props = { ...this._props, ...props };
    const { sliderData } = this._props;
    this._preloadSliderDataImages(sliderData);

    const bulletItem = sliderData.items.map((_item, index) => {
      return {
        type: Bullet,
        w: 20,
        h: 20,
        index,
      };
    });

    this._Bullet.patch({
      items: bulletItem,
    });
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Bullet() {
    return this.tag('Bullet');
  }

  _active() {
    this._nextVideo();
  }

  _nextVideo() {
    const { sliderData } = this._props;

    this._Bullet.items.forEach((item, index) => {
      const color =
        index === this._sliderIndex
          ? Colors(colors.focusedBullet).get()
          : Colors(colors.unfocusedBullet).get();
      item._Icon.patch({
        color: color,
      });
    });

    this._HeroSection.patch({
      props: {
        galleryItem: sliderData.items[this._sliderIndex],
        height: 800,
        yPos: 215,
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
    return this._HeroSection;
  }
}
