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
        y: 110,
        w: 700,
        h: 460,
        flex: { direction: 'column' },
        Date: {
          w: 698,
          h: 30,
          text: {
            fontSize: 18,
            fontFace: 'Montserrat-Regular',
            textColor: Colors('#A61619').get(),
          },
        },
        Title: {
          w: 440,
          h: 40,
          text: {
            fontFace: 'Montserrat-Bold',
            fontSize: 32,
          },
        },
        Summary: {
          flexItem: {
            marginTop: 10,
          },
          text: {
            textColor: Colors(colors.focus).get(),
            fontFace: 'Montserrat-Medium',
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
            family: 'Montserrat-Regular',
            fontSize: 18,
            lineHeight: 31,
            maxLines: 8,
          },
        },
        Venue: {
          w: 698,
          h: 31,
          text: {
            wordWrapWidth: 650,
            family: 'Montserrat-Regular',
            color: Colors('#BDBDBD').get(),
            fontSize: 18,
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
    const { galleryItem, height } = this._props;
    const { title, summary, description, buttonLabel, url, duration, videoType, venue } =
      galleryItem;

    if (videoType !== 'application/x-mpegURL') {
      this._Info.patch({
        Date: undefined,
        Venue: undefined,
      });
      galleryItem.summary &&
        this._Summary?.patch({
          text: {
            text: summary,
          },
        });
    } else {
      this._Info.patch({
        Summary: undefined,
      });
      this.tag('Info.Date').patch({
        text: {
          text: summary,
        },
      });
      this.tag('Info.Venue').patch({
        text: {
          text: venue,
        },
      });
    }

    this._BackgroundImage.patch({
      w: 1220,
      h: height,
      x: 700,
      // src: galleryItem.getLandscapePoster(imageSizes.XL)?.src,
      src:
        galleryItem.getLandscapePoster(imageSizes.XL)?.src !== null
          ? galleryItem.getLandscapePoster(imageSizes.XL)?.src
          : // : Utils.asset('images/gradient.png'),
            Utils.asset('images/gradient.png'),
    });

    this._GradientOverlay.patch({
      texture: lng.Tools.getSvgTexture(Utils.asset('icons/home/gradient.svg'), 1920, height),
    });

    this._Title.patch({
      text: {
        text: title,
      },
    });

    this._Description.patch({
      text: {
        text: description,
      },
    });

    this._GalleryButton &&
      this._GalleryButton.patch({
        props: {
          buttonLabel: buttonLabel,
          callback: () => {
            Router.navigate('player', {
              videoUrl: url,
              duration: duration,
              // videoType: buttonLabel,
              videoType: videoType,
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

  get _Summary() {
    return this.tag('Summary');
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
