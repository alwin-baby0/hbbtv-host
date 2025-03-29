import { Lightning, VideoPlayer } from '@lightningjs/sdk';
import GalleryItem from '../GalleryItem/GalleryItem';
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer';
import { imageSizes } from '../../Models/utils';
import { railItemConstructor } from '../../pages/utils/railItems';
import { loader, unloader } from '../Player/HLS';

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
      Bullets: {
        type: HorizontalContainer,
        y: 820 - 115,
        x: 110,
        w: 1760,
        h: 215,
        props: {
          w: 1760,
          h: 215,
        },
      },
    };
  }

  set props(props) {
    this._sliderIndex = 0;
    this._Bullets._focusedIndex = 0;
    this._props = { ...this._props, ...props };
    const { sliderData } = this._props;

    this._HeroSection.tag('Info').patch({
      GalleryButton: undefined,
    });

    this._HeroSection.tag('Info').patch({
      Summary: undefined,
    });

    const parsedItems = railItemConstructor(sliderData.items, 'HeroRails', {});

    this._Bullets.patch({
      props: {
        items: parsedItems,
      },
    });
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Bullets() {
    return this.tag('Bullets');
  }

  _enable() {
    VideoPlayer.position(-3, 700);
    VideoPlayer.size(1220, 690);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
  }

  $playTrailer(url) {
    this._HeroSection._BackgroundImage.visible = false;
    VideoPlayer.loop(true);

    VideoPlayer.open(url);
    VideoPlayer.play();
  }

  $stopVideo() {
    VideoPlayer.clear();
  }

  $changeGalleryItem(index) {
    const { sliderData } = this._props;
    this._sliderIndex = index;
    this._HeroSection.patch({
      props: {
        galleryItem: sliderData.items[index],
        height: 690,
        yPos: 215,
      },
    });

    this._HeroSection._BackgroundImage.patch({
      visible: true,
      w: 1220,
      h: 690,
      x: 700,
      src: sliderData.items[index].getLandscapePoster(imageSizes.XL)?.src,
    });
  }

  _unfocus() {
    super._inactive();
    this.$changeGalleryItem(this._sliderIndex)
  }

  _getFocused() {
    return this._Bullets;
  }
}
