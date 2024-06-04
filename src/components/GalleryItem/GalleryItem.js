import { Colors, Lightning, Utils } from '@lightningjs/sdk';
import Button from '../Button/Button';
import colors from '../../../reskin/colors.json';
import HomeRailItem from '../../api/home/HomeRailItem';

export default class GalleryItem extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      w: 1920,
      BackgroundImage: {
        w: 1420,
      },
      GradientOverlay: {
        zIndex: 1,
        w: 1920,
      },
      Info: {
        zIndex: 2,
        x: 110,
        w: 700,
        h: 415,
        flex: { direction: 'column' },
        Title: {
          w: 440,
          h: 40,
          text: {
            fontFamily: 'Inter',
            fontStyle: 'normal bold',
            fontSize: 32,
            lineHeight: 40,
          },
        },
        Description: {
          y: 15,
          text: {
            textColor: Colors(colors.sliderDescription).get(),
            wordWrapWidth: 650,
            fontFamily: 'Inter',
            fontStyle: 'normal normal',
            fontSize: 18,
            lineHeight: 31,
            maxLines: 8,
          },
        },
        GalleryButton: {
          type: Button,
          y: 30,
          props: {
            buttonLabel: 'WATCH NOW',
            buttonIcon: Utils.asset('icons/home/play.svg'),
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { galleryItem, height, yPos } = this._props;

    this._BackgroundImage.patch({
      w: 1220,
      h: height,
      x: 700,
      src: galleryItem.getLandscapePoster(HomeRailItem.extraLarge).src,
    });

    this._GradientOverlay.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('icons/home/gradient.svg'), 1920, height),
    });

    this._Info.patch({
      y: yPos,
    });

    this._Title.patch({
      text: {
        text: galleryItem.title,
      },
    });

    this._Description.patch({
      text: {
        text: galleryItem.description,
      },
    });

    this._GalleryButton.patch({
      props: {
        callback: () => {
          // console.log('Navigate ', galleryItem.content.src);
        },
      },
    });
  }

  get _GradientOverlay() {
    return this.tag('GradientOverlay');
  }

  get _Info() {
    return this.tag('Info');
  }

  get _Title() {
    return this.tag('Title');
  }

  get _Description() {
    return this.tag('Description');
  }

  get _GalleryButton() {
    return this.tag('GalleryButton');
  }

  get _BackgroundImage() {
    return this.tag('BackgroundImage');
  }

  _getFocused() {
    return this._GalleryButton;
  }
}
