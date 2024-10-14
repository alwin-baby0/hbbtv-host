import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { imageSizes } from '../../Models/utils';
import Button from '../Button/Button';
export default class GalleryItem extends Lightning.Component {
  _props = {
    enabled: true,
  };
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
        // h: 460,
        // h: 600,
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
          w: 750,
          h: 40,
          text: {
            fontFace: 'Montserrat-Bold',
            fontSize: 32,
            maxLines: 1,
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
            fontSize: 23,
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
        AuthorizedButtons: {
          flex: { direction: 'row' },
          ContinueWatching: {
            alpha: 0,
            type: Button,
            flexItem: {
              marginTop: 20,
            },
          },
          FavoriteButton: {
            alpha: 0,
            type: Button,
            flexItem: {
              marginTop: 20,
              marginLeft: 10,
            },
          },
        },
      },
    };
  }
  set props(props) {
    this._props = { ...this._props, ...props };
    // console.log(this._props);
    const { galleryItem, height, enabled, firstEpisodeVideoId } = this._props;
    // console.log(enabled);
    const { title, summary, description, buttonLabel, url, duration, videoType, venue } =
      galleryItem;
    console.log('galleryItem:', props);
    this._Info.patch({
      h: height,
    });
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
      (() => {
        // Define the callback based on the enabled prop
        let callback = () => null;
        let btnIcon = '';

        if (enabled) {
          callback = () => {
            Router.navigate('player', {
              videoUrl: url,
              duration: duration,
              videoType: videoType,
              videoId: firstEpisodeVideoId ? firstEpisodeVideoId : null,
            });
          };

          btnIcon = Utils.asset('icons/home/play.svg');
        }

        // Patch the button with the correct props, including the conditionally set callback
        this._GalleryButton.patch({
          props: {
            buttonLabel: buttonLabel,
            callback: callback,
            buttonIcon: btnIcon,
          },
        });
      })();
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
  get _ContinueWatching() {
    return this.tag('AuthorizedButtons.ContinueWatching');
  }
  get _FavoriteButton() {
    return this.tag('AuthorizedButtons.FavoriteButton');
  }
  get _BackgroundImage() {
    return this.tag('BackgroundImage');
  }
  _firstActive() {
    this._setState('GalleryButton');
  }

  _disable() {
    this._props.enabled = true;
  }

  static _states() {
    return [
      class GalleryButton extends this {
        _getFocused() {
          return this._GalleryButton;
        }
        _handleDown() {
          if (this._FavoriteButton.alpha > 0) this._setState('ContinueWatching');
          else return false;
        }
      },
      class ContinueWatching extends this {
        _getFocused() {
          return this._ContinueWatching;
        }

        _handleUp() {
          this._setState('GalleryButton');
        }

        _handleRight() {
          if (this._ContinueWatching.alpha > 0) this._setState('FavoriteButton');
          else return false;
        }

        // _handleDown() {
        //   if (this._ContinueWatching.alpha > 0) this._setState('FavoriteButton');
        //   else return false;
        // }
        _handleDown() {
          return false;
        }
      },
      class FavoriteButton extends this {
        _getFocused() {
          return this._FavoriteButton;
        }
        _handleUp() {
          this._setState('GalleryButton');
        }
        _handleLeft() {
          this._setState('ContinueWatching');
        }
      },
    ];
  }
}
