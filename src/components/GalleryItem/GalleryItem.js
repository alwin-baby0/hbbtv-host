import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { imageSizes } from '../../Models/utils';
import Button from '../Button/Button';
import { DetailService, t } from '../../Services';
import { capitalizeFirstLetter } from '../../utils';
import { IMG_PATH, ROUTES, TRANSLATIONS, VIDEO_TYPES } from '../../constants/globalConstants';
export default class GalleryItem extends Lightning.Component {
  _props = {
    enabled: true,
  };
  static _template() {
    return {
      w: 1920,
      h: 1080,
      BackgroundImage: {
        w: 1920,
        h: 1080,
      },
      GradientOverlay: {
        zIndex: 1,
        w: 1920,
        h: 1080,
      },
      Info: {
        zIndex: 2,
        x: 100,
        y: 200,
        w: 1000,
        h: 500,
        flex: { direction: 'column' },
        Badge: {
          h: 100,
          flex: {
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          flexItem: {
            marginBottom: 70,
            minHeight: 40,
          },
          texture: Lightning.Tools.getRoundRect(
            200,
            100,
            6,
            2,
            Colors(colors.white).get(),
            true,
            Colors('#4a4a49').get()
          ),
          Text: {
            flexItem: {
              alignSelf: 'center',
            },
            text: {
              text: 'Home',
              fontSize: 24,
              fontFace: 'Montserrat-Regular',
              textColor: Colors(colors.white).get(),
            },
          },
        },
        Date: {
          w: 698,
          h: 30,
          text: {
            fontSize: 32,
            fontFace: 'Montserrat-Regular',
            textColor: Colors('#A61619').get(),
          },
        },
        Title: {
          w: 750,
          h: 80,
          text: {
            fontFace: 'Montserrat-Bold',
            fontSize: 48,
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
          w: 900,
          h: 350,
          flexItem: {
            marginTop: 10,
            marginBottom: 5,
          },
          text: {
            textColor: Colors(colors.sliderDescription).get(),
            wordWrapWidth: 850,
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
            buttonLabel: t(TRANSLATIONS.WATCH_NOW),
            buttonIcon: Utils.asset(IMG_PATH.PLAY_BTN),
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
      enabled,
      firstEpisodeVideoId,
      firstEpisodeUrl,
      firstEpisodeTitle,
      fallbackImage,
      isDeeplinkEpisode,
      seriesId,
      ssai,
      badgeText,
    } = this._props;

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
      } else return Utils.asset(IMG_PATH.GRADIENT);
    };

    this.patch({
      BackgroundImage: {
        src: bgImageSrc(),
      },
      GradientOverlay: {
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.GRADIENT_SVG), 1920, 1080),
      },
      Info: {
        Badge: {
          Text: {
            text: {
              text: capitalizeFirstLetter(badgeText),
            },
          },
        },
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
              Router.navigate(ROUTES.PLAYER, {
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
                Router.navigate(ROUTES.PLAYER, {
                  videoUrl: result[0]?.content?.src ?? firstEpisodeUrl,
                  episodeTitle: firstEpisodeTitle,
                  videoId: firstEpisodeVideoId,
                  duration: duration,
                  videoType: VIDEO_TYPES.SERIES,
                  seriesID: seriesId,
                  ssai: result[0].extensions?.ssai ?? ssai,
                });
              }
            );
          };

          btnIcon = Utils.asset(IMG_PATH.PLAY_BTN);
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
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );

    switch (buttonName) {
      case 'GalleryButton':
        this._setState('GalleryButton');
        this._ContinueWatching._unfocus();
        this._FavoriteButton._unfocus();
        break;
      case 'ContinueWatching':
        this._setState('ContinueWatching');
        this._GalleryButton._unfocus();
        this._FavoriteButton._unfocus();
        break;
      case 'FavoriteButton':
        this._setState('FavoriteButton');
        this._ContinueWatching._unfocus();
        this._GalleryButton._unfocus();
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
