import { Lightning, VideoPlayer } from '@lightningjs/sdk';
import GalleryItem from '../GalleryItem/GalleryItem';
import HorizontalContainer from '../HorizontalContainer/HorizontalContainer';
import { IMAGE_SIZES } from '../../constants/globalConstants';
import { railItemConstructor } from '../../pages/utils/railItems';
import { loader, unloader } from '../Player/HLS';
import { didomiVisible } from '../../App';

export default class Gallery extends Lightning.Component {
  _sliderIndex = 0;
  _props = {
    sliderData: [],
    parentState: null,
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
        collision: true,
        props: {
          y: 820 - 265,
          x: 75,
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
    const { sliderData, parentState } = this._props;

    this._Info.patch({
      GalleryButton: undefined,
      Summary: undefined,
      TopSection: { SummSub: undefined },
      Metadata: {
        visible: false,
      },
    });

    const parsedItems = railItemConstructor(sliderData.items, 'HeroRails', {});

    this._Bullets.patch({
      props: {
        items: parsedItems,
        parentState,
      },
    });
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Info() {
    return this.tag('HeroSection.Info');
  }

  get _Bullets() {
    return this.tag('Bullets');
  }

  _enable() {
    VideoPlayer.position(0, 380);
    VideoPlayer.size(1540, 883);
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
    const { sliderData, bgY } = this._props;
    this._sliderIndex = index;
    this._HeroSection.patch({
      props: {
        badgeText: sliderData.items[index].badgeText,
        galleryItem: sliderData.items[index],
        infoY: 160,
        bgY: bgY,
        badgeY: -50,
      },
    });

    this._HeroSection._BackgroundImage.visible = false;

    this._HeroSection._BackgroundImage.patch({
      visible: true,
      w: 1570,
      h: 883,
      src: sliderData.items[index].getLandscapePoster(IMAGE_SIZES.S)?.src,
    });
  }

  _unfocus() {
    super._inactive();
    this.$changeGalleryItem(this._sliderIndex);
  }

  _getFocused() {
    return this._Bullets;
  }

  _handleScroll(event) {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    if (event.deltaY > 0) {
      this.fireAncestors('$setStateOnScroll', this._props.scrollDownState);
    }
  }
}
