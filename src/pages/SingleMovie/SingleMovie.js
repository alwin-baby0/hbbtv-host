import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { Row } from '@lightningjs/ui-components';

import Button from '../../Components/Button/Button';
const buttons = [
  {
    icon: 'icons/home/play.svg',
    buttonLabel: 'WATCH NOW',
    width: 285,
    action: 'videoSrc',
  },
  {
    icon: 'icons/movies/trailer-icon.svg',
    buttonLabel: 'TRAILER',
    width: 237,
    action: 'trailerSrc',
  },
];
export default class SingleMovie extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      Content: {
        w: 1920,
        h: 1080,
        Card: {
          x: 70,
          y: 120,
          w: 405,
          h: 725,
          flex: { direction: 'column' },
          Info: {
            w: 405,
            h: 105,
            flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
            Category: {
              w: 405,
              h: 29,
              text: {
                fontSize: 24,
                lineHeight: 30,
              },
            },
            Duration: {
              w: 405,
              h: 29,
              text: {
                fontSize: 24,
                lineHeight: 30,
              },
            },
            Subtitle: {
              w: 405,
              h: 29,
              text: {
                fontSize: 24,
                lineHeight: 30,
              },
            },
          },
          Image: {
            w: 405,
            h: 598,
            y: 22,
          },
        },
        CardInfo: {
          x: 670,
          y: 350,
          AboutMovie: {
            w: 700,
            h: 275,
            flex: { direction: 'column' },
            Title: {
              w: 445,
              h: 35,
              text: {
                text: 'asd',
                fontSize: 28,
                lineHeight: 34,
              },
            },
            Description: {
              w: 700,
              h: 62,
              y: 24,
              text: {
                fontSize: 22,
                lineHeight: 31,
                maxLines: 2,
                wordWrapWidth: 700,
                fontFamily: 'Inter',
                fontStyle: 'normal bold',
              },
            },
            Director: {
              w: 700,
              h: 31,
              y: 48,
              text: {
                fontSize: 22,
                lineHeight: 31,
                fontFamily: 'Inter',
                fontStyle: 'normal bold',
              },
            },
          },
          Buttons: {
            type: Row,
            w: 545,
            h: 78,
            y: 196,
          },
        },
      },
    };
  }

  get _Category() {
    return this.tag('Category');
  }

  get _Duration() {
    return this.tag('Duration');
  }

  get _Subtitle() {
    return this.tag('Subtitle');
  }

  get _Image() {
    return this.tag('Image');
  }

  get _Title() {
    return this.tag('Title');
  }

  get _Description() {
    return this.tag('Description');
  }

  get _Director() {
    return this.tag('Director');
  }

  get _Buttons() {
    return this.tag('Buttons');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const {
      title,
      description,
      duration,
      director,
      genre,
      summary,
      subtitle,
      portraitPosters,
      videoSrc,
    } = this._props;

    this._Category.patch({
      text: {
        text: genre,
      },
    });

    this._Duration.patch({
      text: {
        text: summary,
      },
    });

    this._Subtitle.patch({
      text: {
        text: subtitle,
      },
    });

    this._Image.patch({
      src: portraitPosters[2].src,
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

    this._Director.patch({
      text: {
        text: director,
      },
    });

    const mappedButtons = buttons.map((button) => {
      const { buttonLabel, icon, width, action } = button;
      const url = action === 'videoSrc' ? videoSrc : action;
      return {
        type: Button,
        w: width,
        props: {
          width: width,
          buttonLabel: buttonLabel,
          buttonIcon: Utils.asset(icon),
          callback: () => {
            Router.navigate('player', {
              videoUrl: url,
              duration: duration,
            });
          },
        },
      };
    });

    this._Buttons.items = mappedButtons;
  }

  _getFocused() {
    return this._Buttons;
  }
}
