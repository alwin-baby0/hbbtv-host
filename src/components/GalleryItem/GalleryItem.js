import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { imageSizes } from '../../Models/utils';
import Button from '../Button/Button';

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
          },
        },
        EpisodeCount: {
          flexItem: {
            marginTop: 10,
          },
          text: {
            textColor: Colors(colors.focus).get(),
            fontFamily: 'Inter',
            fontStyle: 'normal bold',
            fontSize: 20,
          },
        },
        Description: {
          flexItem: {
            marginTop: 10,
            marginBottom: 5,
          },
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
          flexItem: {
            marginTop: 10,
          },
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
      src: galleryItem.getLandscapePoster(imageSizes.XL)?.src,
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
    galleryItem.episodeCount &&
      this._EpisodeCount.patch({
        text: {
          text: galleryItem.episodeCount,
        },
      });

    this._Description.patch({
      text: {
        text: galleryItem.description,
      },
    });

    this._GalleryButton.patch({
      props: {
        buttonLabel: galleryItem.buttonLabel,
        callback: () => {
          Router.navigate('player', {
            videoUrl: galleryItem.url,
            duration: galleryItem.duration,
            videoType: galleryItem.buttonLabel,
          });
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

  get _EpisodeCount() {
    return this.tag('EpisodeCount');
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
