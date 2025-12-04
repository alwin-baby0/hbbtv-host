import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import Button from '../Button/Button';
import { DetailService, t } from '../../Services';
import { capitalizeFirstLetter } from '../../utils';
import {
  IMG_PATH,
  ROUTES,
  TRANSLATIONS,
  VIDEO_TYPES,
  IMAGE_SIZES,
} from '../../constants/globalConstants';
export default class GalleryItem extends Lightning.Component {
  _props = {
    enabled: true,
    infoY: 110,
    bgY: 0,
    badgeY: 0,
  };

  _countDownInterval = null;
  _days = 0;
  _hours = 0;
  _minutes = 0;
  _seconds = 0;
  remaining = 0;

  static _template() {
    return {
      w: 1920,
      BackgroundImage: {
        y: 0,
        x: 350,
        w: 1570,
        h: 883,
      },
      GradientOverlay: {
        zIndex: 1,
        y: 0,
        w: 1920,
      },
      Info: {
        zIndex: 2,
        x: 110,
        y: 310,
        w: 740,
        flex: { direction: 'column' },
        Badge: {
          visible: false,
          rect: true,
          texture: Lightning.Tools.getRoundRect(
            200,
            55,
            10,
            2,
            Colors(colors.white).get(),
            true,
            Colors('#4a4a49').get()
          ),
          h: 55,
          flex: {
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          flexItem: {
            marginRight: 40,
          },
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
          visible: false,
          w: 750,
          h: 40,
          y: -47,
          x: 230,
          color: Colors('#cf1c1e').get(),
          rect: true,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
          Text: {
            h: 30,
            w: 750,
            y: 5,
            text: {
              fontSize: 24,
              fontFace: 'Montserrat-Semibold',
              textColor: Colors('#FFFFFF').get(),
              textAlign: 'center',
              maxLines: 1,
            },
          },
        },
        SummSub: {
          x: 230,
          y: -43,
          flex: { direction: 'row', alignItems: 'center' },
          flexItem: {
            marginBottom: 20,
          },
          Summary: {
            w: 165,
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
            flexItem: {
              marginLeft: 10,
            },
          },
        },
        Countdown: {
          visible: false,
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          flexItem: {
            marginBottom: 25,
          },
          texture: Lightning.Tools.getRoundRect(800, 100, 10, 2, '#FFFFFF', false, false),
          h: 100,
          w: 800,
          Start: {
            w: 200,
            x: 50,
            text: {
              text: 'Start in:',
              fontSize: 24,
              fontFace: 'Montserrat-Semibold',
            },
          },
          Days: {
            w: 230,
            flex: { direction: 'row' },
            Number: {
              text: {
                text: '7',
                fontFace: 'Montserrat-Bold',
                fontSize: 44,
              },
            },
            Label: {
              y: 19,
              text: {
                text: 'Days',
                fontSize: 24,
              },
            },
          },
          Hours: {
            w: 230,
            flex: { direction: 'row' },
            Number: {
              text: {
                text: '8',
                fontSize: 44,
                fontFace: 'Montserrat-Bold',
              },
            },
            Label: {
              y: 19,
              text: {
                text: 'Hours',
                fontSize: 24,
              },
            },
          },
          Mins: {
            w: 230,
            flex: { direction: 'row' },
            Number: {
              text: {
                text: '13',
                fontSize: 44,
                fontFace: 'Montserrat-Bold',
              },
            },
            Label: {
              y: 19,
              text: {
                text: 'Min',
                fontSize: 24,
              },
            },
          },
          Sec: {
            w: 230,
            flex: { direction: 'row' },
            Number: {
              text: {
                text: '4',
                fontSize: 44,
                fontFace: 'Montserrat-Bold',
              },
            },
            Label: {
              y: 19,
              text: {
                text: 'Sec',
                fontSize: 24,
              },
            },
          },
        },
        Title: {
          w: 900,
          wordWrapWidth: 900,
          text: {
            text: '',
            fontSize: 59,
            fontFace: 'Montserrat-SemiBold',
            maxLines: 2,
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
            wordWrapWidth: 500,
            fontFace: 'Montserrat-Regular',
            fontSize: 25,
            lineHeight: 31,
            maxLines: 4,
            maxLinesSuffix: '...',
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
        },
        AuthorizedButtons: {
          x: 445,
          y: -88,
          h: 70,
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
        Metadata: {
          flex: { direction: 'column' },
          y: 20,
          AgeRating: {
            w: 700,
            h: 30,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 180,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
                textColor: Colors(colors.metadata).get(),
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
                textColor: Colors(colors.metadata).get(),
              },
            },
          },
          Genre: {
            w: 700,
            h: 30,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 180,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
                textColor: Colors(colors.metadata).get(),
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
                textColor: Colors(colors.metadata).get(),
              },
            },
          },
          Cast: {
            w: 700,
            h: 30,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 180,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
                textColor: Colors(colors.metadata).get(),
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
                wordWrapWidth: 650,
                maxLines: 1,
                textColor: Colors(colors.metadata).get(),
              },
            },
          },
          Director: {
            w: 700,
            h: 30,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
              w: 180,
              h: 90,
              text: {
                text: '',
                fontSize: 22,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
                textColor: Colors(colors.metadata).get(),
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
                textColor: Colors(colors.metadata).get(),
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
      firstEpisodeEpisodeNumber,
      firstEpisodeSeasonNumber,
      fallbackImage,
      isDeeplinkEpisode,
      seriesId,
      ssai,
      badgeText,
      startTime,
      infoY,
      bgY,
      badgeY,
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
      durationString,
      year,
      country,
      imdbScore,
      eventDate,
      eventTime,
    } = galleryItem;

    console.log('asdf LABEL: ', buttonLabel);

    const titleLength = title.length;

    const imdbScoreLabeled = `IMDB ${imdbScore}`;
    let factLine;

    if (videoType !== 'event') {
      factLine = '';
    } else {
      factLine = eventDate && eventTime ? [eventDate, eventTime].join(' | ') : '';
    }

    const splitDirector = director ? director.split(':') : '';
    const splitCast = cast ? cast.split(':') : '';

    const tAgeR = t(TRANSLATIONS.AGE_RATING) + ':';
    const tGenre = t(TRANSLATIONS.GENRE) + ':';
    const tCastTitle = t(TRANSLATIONS.CAST) + ':';
    const tDirTitle = t(TRANSLATIONS.DIRECTOR) + ':';
    const castText = splitCast && splitCast[1];
    const dirText = splitDirector && splitDirector[1];

    if (videoType === 'event') {
      const targetTimestamp = startTime;
      this.remaining = targetTimestamp - Date.now();

      const totalSeconds = Math.max(0, Math.floor(this.remaining / 1000));

      this._days = Math.floor(totalSeconds / (24 * 60 * 60));
      this._hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
      this._minutes = Math.floor((totalSeconds % 3600) / 60);
      this._seconds = totalSeconds % 60;

      if (!this._countDownInterval) {
        this._countDownInterval = setInterval(() => {
          this.remaining -= 1000;
          if (this.remaining <= 0) {
            this.remaining = 0;
            clearInterval(this._countDownInterval);
          }
          this.updateUI();
        }, 1000);
      }
    }

    this._Info.patch({
      y: infoY,
      Badge: {
        y: badgeY,
        visible: true,
      },
    });

    if (videoType !== 'event') {
      galleryItem.summary &&
        this._Summary?.patch({
          text: {
            text: factLine,
          },
        });
      galleryItem.subtitle &&
        this._Subtitle?.patch({
          text: {
            text: subtitle,
          },
        });

      this._Info.patch({
        Date: undefined,
        Venue: undefined,
        Countdown: undefined,
        Badge: {
          Text: {
            text: {
              text: capitalizeFirstLetter(badgeText) || capitalizeFirstLetter(TRANSLATIONS.SERIES),
            },
          },
        },
        Metadata: {
          AgeRating: {
            Title: {
              text: {
                text: tAgeR,
              },
            },
            TextValue: {
              text: {
                text: rating,
              },
            },
            visible: rating,
          },
          Genre: {
            Title: {
              text: {
                text: tGenre,
              },
            },
            TextValue: {
              text: {
                text: genre,
              },
            },
            visible: genre,
          },
          Director: {
            Title: {
              text: {
                text: tDirTitle,
              },
            },
            TextValue: {
              text: {
                text: dirText,
              },
            },
            visible: splitDirector[1] ? true : false,
          },
          Cast: {
            Title: {
              text: {
                text: tCastTitle,
              },
            },
            TextValue: {
              text: {
                text: castText,
              },
            },
            visible: splitCast[1] ? true : false,
          },
        },
      });
    } else {
      this._Info.patch({
        SummSub: undefined,
        Badge: {
          Text: {
            text: {
              text: capitalizeFirstLetter(TRANSLATIONS.SPORTS),
            },
          },
        },
        Date: {
          visible: true,
          Text: {
            text: {
              text: factLine,
            },
          },
        },
        Countdown: {
          visible: this.remaining > 0,
          Days: {
            Number: {
              text: {
                text: this._days,
              },
            },
          },
          Hours: {
            Number: {
              text: {
                text: this._hours,
              },
            },
          },
          Mins: {
            Number: {
              text: {
                text: this._minutes,
              },
            },
          },
          Sec: {
            Number: {
              text: {
                text: this._seconds,
              },
            },
          },
        },
      });
    }

    const bgImageSrc = () => {
      let src;
      if (isDeeplinkEpisode && galleryItem.getThumbnailImage(IMAGE_SIZES.XL)?.src) {
        src = galleryItem.getThumbnailImage(IMAGE_SIZES.XL)?.src;
        return src;
      } else if (galleryItem.getLandscapePoster(IMAGE_SIZES.XL)?.src) {
        src = galleryItem.getLandscapePoster(IMAGE_SIZES.XL)?.src;
        return src;
      } else if (fallbackImage) {
        return fallbackImage;
      } else return Utils.asset(IMG_PATH.GRADIENT_SVG);
    };

    this.patch({
      BackgroundImage: {
        w: 1570,
        h: 883,
        src: bgImageSrc(),
        y: bgY,
      },
      GradientOverlay: {
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.GRADIENT_SVG), 1920, 1082),
        y: bgY,
      },
      Info: {
        Title: {
          text: {
            text: title,
          },
        },
        Description: {
          text: {
            text: summary,
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
                  videoUrl: result?.entry[0]?.files?.url ?? firstEpisodeUrl,
                  episodeTitle: firstEpisodeTitle,
                  videoId: firstEpisodeVideoId,
                  episodeNumber: firstEpisodeEpisodeNumber,
                  seasonNumber: firstEpisodeSeasonNumber,
                  duration: duration,
                  videoType: VIDEO_TYPES.SERIES,
                  seriesID: seriesId,
                  ssai: result?.entry[0]?.extensions?.ssai ?? ssai,
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

  updateUI() {
    const totalSeconds = Math.max(0, Math.floor(this.remaining / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    this._Info.patch({
      Countdown: {
        Days: {
          Number: {
            text: {
              text: days,
            },
          },
        },
        Hours: {
          Number: {
            text: {
              text: hours,
            },
          },
        },
        Mins: {
          Number: {
            text: {
              text: minutes,
            },
          },
        },
        Sec: {
          Number: {
            text: {
              text: seconds,
            },
          },
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

  _active() {
    setTimeout(this._setState('GalleryButton'));
  }

  _firstActive() {
    setTimeout(this._setState('GalleryButton'));
  }

  _disable() {
    this._props.enabled = true;
  }

  _inactive() {
    clearInterval(this._countDownInterval);
    this._countDownInterval = null;
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
          if (this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else {
            return false;
          }
        }
      },
      class ContinueWatching extends this {
        _getFocused() {
          return this._ContinueWatching;
        }

        _handleRight() {
          if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else return false;
        }

        _handleLeft() {
          this._setState('GalleryButton');
        }

        _handleDown() {
          return false;
        }
      },
      class FavoriteButton extends this {
        _getFocused() {
          return this._FavoriteButton;
        }
        _handleRight() {
          return false;
        }
        _handleLeft() {
          if (this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else {
            this._setState('GalleryButton');
          }
        }
      },
    ];
  }
}
