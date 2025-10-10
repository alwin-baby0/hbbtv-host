import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { imageSizes } from '../../Models/utils';
import Button from '../Button/Button';
import { DetailService, t } from '../../Services';
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
        w: 740,
        flex: { direction: 'column' },
        Date: {
          w: 698,
          h: 30,
          text: {
            fontSize: 24,
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
            fontFace: 'Montserrat-Regular',
            fontSize: 25,
            lineHeight: 31,
            maxLines: 6,
          },
        },
        Venue: {
          w: 698,
          h: 31,
          text: {
            wordWrapWidth: 650,
            fontFace: 'Montserrat-Regular',
            color: Colors('#BDBDBD').get(),
            fontSize: 22,
          },
        },
        GalleryButton: {
          type: Button,
          collision: true,
          flexItem: {
            marginTop: 10,
          },
          props: {
            buttonLabel: t('watch_now'),
            buttonIcon: Utils.asset('icons/home/play.svg'),
          },
        },
        AuthorizedButtons: {
          flex: { direction: 'row' },
          ContinueWatching: {
            collision: true,
            alpha: 0,
            type: Button,
            flexItem: {
              marginTop: 10,
            },
          },
          FavoriteButton: {
            collision: true,
            alpha: 0,
            type: Button,
            flexItem: {
              marginTop: 10,
            },
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const {
      galleryItem,
      height,
      enabled,
      firstEpisodeVideoId,
      firstEpisodeUrl,
      firstEpisodeTitle,
      fallbackImage,
      isDeeplinkEpisode,
      seriesId,
      ssai,
    } = this._props;

    const { id, title, summary, description, buttonLabel, url, duration, videoType, venue } =
      galleryItem;

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
        Date: {
          text: {
            text: summary,
          },
        },
        Venue: {
          text: {
            text: venue,
          },
        },
      });
    }

    const bgImageSrc = () => {
      let src;
      if (isDeeplinkEpisode && galleryItem.getThumbnailImage(imageSizes.XL)?.src) {
        src = galleryItem.getThumbnailImage(imageSizes.XL)?.src;
        return src;
      } else if (galleryItem.getLandscapePoster(imageSizes.S)?.src) {
        src = galleryItem.getLandscapePoster(imageSizes.S)?.src;
        return src;
      } else if (fallbackImage) {
        return fallbackImage;
      } else return Utils.asset('images/gradient.png');
    };

    this.patch({
      BackgroundImage: {
        w: 1220,
        h: height,
        x: 700,
        src: bgImageSrc(),
      },
      GradientOverlay: {
        texture: lng.Tools.getSvgTexture(Utils.asset('icons/home/gradient.svg'), 1920, height),
      },
      Info: {
        Title: {
          text: {
            text: title,
          },
        },
        Description: {
          text: {
            text: description,
          },
        },
      },
    });

    this._GalleryButton &&
      (() => {
        // Define the callback based on the enabled prop
        let callback = () => null;
        let btnIcon = '';

        if (enabled) {
          callback = () => {
            if (isDeeplinkEpisode) {
              Router.navigate('player', {
                videoUrl: url,
                videoId: firstEpisodeVideoId,
                duration: duration,
                episodeTitle: firstEpisodeTitle,
                videoType: 'series',
                seriesID: seriesId,
                ssai: ssai,
              });
              return;
            }
            DetailService.getAdCues(firstEpisodeVideoId, seriesId, firstEpisodeUrl).then(
              ({ data: result }) => {
                Router.navigate('player', {
                  videoUrl: result[0]?.content?.src ?? firstEpisodeUrl,
                  episodeTitle: firstEpisodeTitle,
                  videoId: firstEpisodeVideoId,
                  duration: duration,
                  videoType: 'series',
                  seriesID: seriesId,
                  ssai: result[0].extensions?.ssai ?? ssai,
                });
              }
            );
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

  $setButtonState(buttonName) {
    switch (buttonName) {
      case 'GalleryButton':
        this._setState('GalleryButton');
        break;
      case 'ContinueWatching':
        this._setState('ContinueWatching');
        break;
      case 'FavoriteButton':
        this._setState('FavoriteButton');
        break;
    }
  }

  static _states() {
    return [
      class GalleryButton extends this {
        _getFocused() {
          return this._GalleryButton;
        }
        _handleDown() {
          if (this._FavoriteButton.alpha > 0 && this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else return false;
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
          if (this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else {
            return false;
          }
        }
      },
    ];
  }
}
