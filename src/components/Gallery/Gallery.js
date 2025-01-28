import { Lightning, Colors, VideoPlayer } from '@lightningjs/sdk';
import { Row } from '@lightningjs/ui-components';
import colors from '../../../reskin/colors.json';
import GalleryItem from '../GalleryItem/GalleryItem';
import Bullet from '../Bullet/Bullet';
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

    // const bulletItem = sliderData.items.map((_item, index) => {
    //   return {
    //     type: Bullet,
    //     w: 20,
    //     h: 20,
    //     index,
    //   };
    // });

    // this.$nextVideo();

    // this._nextVideo();
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Bullets() {
    return this.tag('Bullets');
  }

  _enable() {
    // Postavljamo VideoPlayer
    // VideoPlayer.position(-15, 700);
    VideoPlayer.position(-3, 700);
    VideoPlayer.size(1220, 690);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
  }

  /* _disable() {
    VideoPlayer.loader(null);
    VideoPlayer.unloader(null);
    VideoPlayer.clear();
  } */

  /* _unfocus() {
    this._HeroSection._BackgroundImage.visible = true;
    VideoPlayer.loader(null);
    VideoPlayer.unloader(null);
    VideoPlayer.clear();
  } */

  $playTrailer(trailer) {
    this._HeroSection._BackgroundImage.visible = false;
    VideoPlayer.loop(true);

    VideoPlayer.open(trailer.trailer);
    VideoPlayer.play();
  }

  $stopVideo() {
    VideoPlayer.clear();
  }

  $nextVideo() {
    const { sliderData } = this._props;
    this._HeroSection.patch({
      props: {
        galleryItem: sliderData.items[this._Bullets._focusedIndex],
        // height: 815,
        height: 690,
        yPos: 215,
      },
    });

    this._HeroSection._BackgroundImage.patch({
      visible: true,
      w: 1220,
      // h: 815 - 115,
      h: 690,
      x: 700,
      src: sliderData.items[this._Bullets._focusedIndex].getLandscapePoster(imageSizes.XL)?.src,
    });
  }

  _getFocused() {
    return this._Bullets;
  }
}
