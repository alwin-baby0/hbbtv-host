import { Lightning, Registry, Router, Utils } from '@lightningjs/sdk';
import GalleryItem from '../../components/GalleryItem/GalleryItem';

export default class Home extends Lightning.Component {
  _sliderIndex = 0;
  _sliderTrailers = [];
  _rowVideos = [];
  static _template() {
    return {
      Content: {
        Background: {
          w: 1920,
          h: 2080,
          src: Utils.asset('images/background.jpg'),
        },
        HeroSection: {
          x: 0,
          y: 0,
          w: 1920,
          h: 800,
          Gallery: {
            type: GalleryItem,
          },
        },
      },
    };
  }

  set homePageData(val) {
    return (this._homePageData = val);
  }

  get _Gallery() {
    return this.tag('Gallery');
  }

  _enable() {
    this._setState('WachNowButton');
  }

  _init() {
    this._setState('TrailorButton');
  }

  _active() {
    this._getHomePage();
  }

  _nextVideo() {
    this._Gallery.patch({
      props: {
        galleryItem: this._sliderTrailers[this._sliderIndex],
      },
    });

    Registry.clearTimeout(this._timeoutId);

    this._timeoutId = Registry.setTimeout(() => {
      this._sliderIndex =
        this._sliderIndex < this._sliderTrailers.length - 1 ? this._sliderIndex + 1 : 0;
      this._nextVideo();
    }, 10000);
  }

  _getHomePage() {
    var videosArray = this._homePageData;
    for (var i = 0; i < videosArray.length; i++) {
      if (videosArray[i].title != 'Slider') {
        this._rowVideos.push(videosArray[i]);
      } else {
        var sliderArray = videosArray[i].entry;
        sliderArray.forEach((item) => {
          this._sliderTrailers.push(item);
        });
      }
    }

    this._nextVideo();
  }

  _handleLeft() {
    if (this._homePageData[0].entry.length > 1) {
      console.log('videosArray.length', this._homePageData[0].entry.length);
      Registry.clearTimeout(this._timeoutId);
      this._sliderIndex =
        this._sliderIndex > 0 ? this._sliderIndex - 1 : this._sliderTrailers.length - 1;
      this._nextVideo();
    }
  }

  _handleRight() {
    if (this._homePageData[0].entry.length > 1) {
      console.log('videosArray.length', this._homePageData[0].entry.length);
      Registry.clearTimeout(this._timeoutId);
      this._sliderIndex =
        this._sliderIndex < this._sliderTrailers.length - 1 ? this._sliderIndex + 1 : 0;
      this._nextVideo();
    }
  }

  static _states() {
    return [
      class WachNowButton extends this {
        _getFocused() {
          return this.tag('Gallery.HeroButton');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },
    ];
  }
}
