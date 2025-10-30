import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import { imageSizes } from '../../Models/utils';
import Button from '../Button/Button';
import { DetailService, t } from '../../Services';
import { IMG_PATH, TRANSLATIONS } from '../../constants/globalConstants';
export default class GalleryItem extends Lightning.Component {
  _props = {
    enabled: true,
  };
  static _template() {
    return {
      w: 1920,
      BackgroundImage: {
        w: 1920,
        h: 1080,
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
        SummSub: {
          flex: { direction: 'row' },
          flexItem: {
            marginBottom: 20,
          },
          Summary: {
            w: 200,
            h: 29,
            text: {
              fontSize: 24,
              lineHeight: 30,
              fontFace: 'Montserrat-SemiBold',
            },
          },
          Subtitle: {
            w: 400,
            h: 29,
            text: {
              fontSize: 24,
              lineHeight: 30,
            },
          },
        },
        Title: {
          w: 900,
          wordWrapWidth: 900,
          text: {
            text: '',
            fontSize: 59,
            lineHeight: 34,
            fontFace: 'Montserrat-SemiBold',
          },
        },
        Description: {
          flexItem: {
            marginTop: 10,
            marginBottom: 5,
          },
          w: 900,
          h: 150,
          text: {
            // textColor: Colors(colors.sliderDescription).get(),
            wordWrapWidth: 900,
            fontFace: 'Montserrat-Regular',
            fontSize: 25,
            lineHeight: 31,
            maxLines: 4,
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
          x: 445,
          y: -88,
          h: 70,
          flex: { direction: 'row' },
          FavoriteButton: {
            collision: true,
            alpha: 0,
            type: Button,
            flexItem: {
              marginTop: 10,
            },
          },
          ContinueWatching: {
            collision: true,
            alpha: 0,
            type: Button,
            flexItem: {
              marginTop: 10,
              marginLeft: 15,
            },
          },
        },
        Metadata: {
          flex: { direction: 'column' },
          AgeRating: {
            w: 700,
            y: 0,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 150,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            TextValue: {
              w: 700,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-Regular',
              },
            },
          },
          Genre: {
            w: 700,
            y: -60,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 90,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            TextValue: {
              w: 700,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-Regular',
              },
            },
          },
          Cast: {
            w: 700,
            y: -120,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 90,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            TextValue: {
              w: 700,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-Regular',
              },
            },
          },
          Director: {
            w: 700,
            y: -180,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 100,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            TextValue: {
              w: 700,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-Regular',
              },
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

    const {
      title,
      summary,
      description,
      buttonLabel,
      url,
      duration,
      videoType,
      venue,
      subtitle,
      director,
      cast,
      genre,
      rating,
    } = galleryItem;

    const titleLength = title.length;

    const splitDirector = director.split(':');
    const splitCast = cast.split(':');

    const tcastTitle = t(TRANSLATIONS.CAST) + ':';
    const tDirTitle = t(TRANSLATIONS.DIRECTOR) + ':';
    const tDirText = splitDirector[1];
    const castText = splitCast[1];

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
      this._Subtitle?.patch({
        text: {
          text: 'US • 2011 • FSK12 • IMDb: 7.1',
        },
      });

      this._Info.patch({
        Metadata: {
          AgeRating: {
            Title: {
              text: {
                text: 'Age Rating:',
              },
            },
            TextValue: {
              text: {
                text: rating,
              },
            },
          },
          Genre: {
            Title: {
              text: {
                text: 'Genre:',
              },
            },
            TextValue: {
              text: {
                text: genre,
              },
            },
          },
          Director: {
            Title: {
              text: {
                text: tDirTitle,
              },
            },
            TextValue: {
              text: {
                text: tDirText,
              },
            },
            // visible: splitDirector[1] ? true : false,
          },
          Cast: {
            Title: {
              text: {
                text: tcastTitle,
              },
            },
            TextValue: {
              text: {
                text: castText,
              },
            },
            // visible: splitCast[1] ? true : false,
          },
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
      } else if (galleryItem.getLandscapePoster(imageSizes.XL)?.src) {
        src = galleryItem.getLandscapePoster(imageSizes.XL)?.src;
        return src;
      } else if (fallbackImage) {
        return fallbackImage;
      } else return Utils.asset(IMG_PATH.GRADIENT);
    };

    this.patch({
      BackgroundImage: {
        w: 1920,
        h: 1080,
        // x: 700,
        src: bgImageSrc(),
      },
      GradientOverlay: {
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.GRADIENT_SVG), 1920, height),
      },
      Info: {
        Title: {
          h: titleLength > 28 ? 130 : 90,
          text: {
            lineHeight: titleLength > 28 ? 58 : 34,
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

          btnIcon = Utils.asset(IMG_PATH.PLAY_BTN);
        }

        // Patch the button with the correct props, including the conditionally set callback
        this._GalleryButton.patch({
          props: {
            buttonLabel: buttonLabel,
            callback: callback,
            buttonIcon: btnIcon,
            // parentState: 'GalleryButton',
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

  get _Subtitle() {
    return this.tag('Subtitle');
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

  get _SummSub() {
    return this.tag('SummSub');
  }

  get _AgeRating() {
    return this.tag('AgeRating');
  }
  get _Genre() {
    return this.tag('Genre');
  }

  get _Director() {
    return this.tag('Director');
  }
  get _Cast() {
    return this.tag('Cast');
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
        _handleRight() {
          if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else return false;
        }
      },
      class ContinueWatching extends this {
        _getFocused() {
          return this._ContinueWatching;
        }

        _handleLeft() {
          this._setState('FavoriteButton');
        }

        _handleRight() {
          return false;
        }

        _handleDown() {
          return false;
        }
      },
      class FavoriteButton extends this {
        _getFocused() {
          return this._FavoriteButton;
        }
        _handleLeft() {
          this._setState('GalleryButton');
        }
        _handleRight() {
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
