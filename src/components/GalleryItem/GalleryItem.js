import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import Button from '../Button/Button';
import { DetailService } from '../../Services';
import { capitalizeFirstLetter } from '../../utils';
import {
  IMG_PATH,
  ROUTES,
  TRANSLATIONS,
  VIDEO_TYPES,
  IMAGE_SIZES,
} from '../../constants/globalConstants';
import { didomiVisible } from '../../App';
import { t } from '../../utils';

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
  remainingUntilStart = 0;

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
        x: 200,
      },
      Spinner: {
        w: 120,
        h: 120,
        texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.SPINNER), 120, 120),
        x: 960,
        y: 400,
        mount: 0.5,
        rotation: 0,
        zIndex: 3,
      },
      Info: {
        zIndex: 3,
        x: 110,
        h: 550,
        flex: { direction: 'column', justifyContent: 'center' },
        TopSection: {
          flex: { direction: 'row', alignItems: 'center' },
          flexItem: {
            marginBottom: 25,
          },
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
            flexItem: {
              marginRight: 40,
            },
          },
          Date: {
            visible: false,
            w: 330,
            h: 50,
            color: Colors('#cf1c1e').get(),
            rect: true,
            shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
            flex: { direction: ' row', alignItems: 'center' },
            Text: {
              h: 30,
              y: 9,
              text: {
                text: 'babuuuuu',
                fontSize: 24,
                fontFace: 'Montserrat-Semibold',
                textColor: Colors('#FFFFFF').get(),
                textAlign: 'center',
                maxLines: 1,
              },
            },
            flexItem: {
              marginRight: 40,
            },
          },
          SummSub: {
            flex: { direction: 'row', alignItems: 'center' },
            Summary: {
              text: {
                fontSize: 24,
                fontFace: 'Montserrat-Regular',
              },
            },
            Subtitle: {
              text: {
                fontSize: 24,
              },
              flexItem: {
                marginLeft: 10,
              },
            },
          }
        },
        Countdown: {
          visible: false,
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          flexItem: {
            marginTop: 15,
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
            fontSize: 48,
            fontFace: 'Montserrat-SemiBold',
            maxLines: 2,
          },
        },
        Description: {
          flexItem: {
            marginTop: 10,
            marginBottom: 5,
          },
          w: 1100,
          text: {
            wordWrapWidth: 1100,
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
        TrailerButton: {
          type: Button,
          collision: true,
          x: 485,
          y: -88,
          props: {
            width: 250,
            height: 78,
          },
          flexItem: {
            marginTop: 10,
          },
          visible: false,
        },
        AuthorizedButtons: {
          x: 715,
          y: -176,
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
          AgeRating: {
            w: 700,
            h: 30,
            flex: { direction: 'row', alignItems: 'center' },
            Title: {
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
              w: 750,
              h: 90,
              flexItem: { marginLeft: 10 },
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
              w: 750,
              h: 90,
              flexItem: { marginLeft: 10 },
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
              flexItem: { marginLeft: 10 },
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
              flexItem: { marginLeft: 10 },
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
    this._Info.visible = true;
    this._Spinner.visible = false;
    this._props = { ...this._props, ...props };
    const {
      galleryItem,
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
      endTime,
      infoY,
      bgY,
      badgeY,
      episodeTitle,
      seasonTitle,
    } = this._props;

    const {
      title,
      summary,
      buttonLabel,
      url,
      duration,
      videoType,
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
      streamUrl,
      trailerUrl,
    } = galleryItem;

    const imdbScoreLabeled = imdbScore ? `IMDB ${imdbScore}` : '';
    let factLine;

    if (videoType !== 'event') {
      const factItems = [durationString, year, country, imdbScoreLabeled]
      const filteredFactItems = []
      for (const item of factItems) {
        if (item) filteredFactItems.push(item)
      }
      factLine = filteredFactItems.join(' | ');
    } else {
      factLine =
        eventDate && eventTime
          ? [eventDate, eventTime].join(' | ')
          : eventDate
            ? eventDate
            : eventTime
              ? eventTime
              : '';
    }

    const tAgeR = t(TRANSLATIONS.AGE_RATING) + ':';
    const tGenre = t(TRANSLATIONS.GENRE) + ':';
    const tCastTitle = t(TRANSLATIONS.CAST) + ':';
    const tDirTitle = t(TRANSLATIONS.DIRECTOR) + ':';
    const castText = cast ? cast.join(', ') : '';
    const dirText = director
      ? Array.isArray(director)
        ? director.join(', ')
        : director
      : undefined;
    const genreText = genre ? (Array.isArray(genre) ? genre.join(', ') : genre) : undefined;

    if (videoType === 'event') {
      const targetTimestamp = startTime;
      const endTimestamp = endTime;
      const eventEndsIn = endTimestamp - Date.now();
      this.remainingUntilStart = targetTimestamp - Date.now();
      const shouldCallUpdateInitially = this.remainingUntilStart > 0;

      const totalSeconds = Math.max(0, Math.floor(this.remainingUntilStart / 1000));

      this._days = Math.floor(totalSeconds / (24 * 60 * 60));
      this._hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
      this._minutes = Math.floor((totalSeconds % 3600) / 60);
      this._seconds = totalSeconds % 60;

      if (!this._countDownInterval) {
        this._countDownInterval = setInterval(() => {
          this.remainingUntilStart -= 1000;
          if (this.remainingUntilStart <= 0) {
            this.remainingUntilStart = 0;
            clearInterval(this._countDownInterval);
            this._countDownInterval = null;
            if (shouldCallUpdateInitially) {
              this.fireAncestors('$updateEvent', 'remaining = 0');
            }
          }
          this.updateUI();
        }, 1000);
      }

      if (this._endAlarm) {
        clearTimeout(this._endAlarm);
        this._endAlarm = null;
      }
      if (eventEndsIn > 0 && !this._endAlarm) {
        this._endAlarm = setTimeout(() => {
          this._endAlarm = null;
          this.fireAncestors('$updateEvent', 'event ended');
        }, eventEndsIn);
      }
    }

    this._Info.patch({
      TopSection: {
        Badge: {
          visible: true,
        }
      },
    });

    if (videoType !== 'event') {
      this._Summary?.patch({
        text: {
          text: factLine,
        },
      });
      this._Info.patch({
        Venue: undefined,
        Countdown: undefined,
        TopSection: {
          Date: undefined,
          Badge: {
            Text: {
              text: {
                text: capitalizeFirstLetter(badgeText) || capitalizeFirstLetter(TRANSLATIONS.SERIES),
              },
            },
          }
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
                text: genreText,
              },
            },
            visible: genre?.length,
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
            visible: dirText,
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
            visible: cast?.length,
          },
        },
      });
    } else {
      this._Info.patch({
        TopSection: {
          SummSub: undefined,
          Badge: {
            Text: {
              text: {
                text: capitalizeFirstLetter(TRANSLATIONS.SPORTS),
              },
            },
          },
          Date: {
            visible: factLine ? true : false,
            Text: {
              text: {
                text: factLine,
              },
            },
          }
        },
      });
      setTimeout(() => {
        //this patch is delayed on purpose, without it countdown is not properly displayed
        this._Info.patch({
          Countdown: {
            visible: this.remainingUntilStart > 0,
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
            text: episodeTitle || seasonTitle || title,
            fontSize: bgY !== 0 ? 50 : 50,
            wordWrapWidth: bgY !== 0 ? 800 : 800,
          },
        },
        Description: {
          text: {
            text: summary,
            wordWrapWidth: bgY !== 0 ? 850 : 850, //500 is for hero only
          },
        },
      },
    });

    this._TrailerButton &&
      (() => {
        if (trailerUrl) {
          const callback = () => {
            Router.navigate(ROUTES.PLAYER, {
              videoUrl: trailerUrl,
              shouldSaveProgress: false,
            });
          };

          const btnIcon = Utils.asset(IMG_PATH.PLAY_BTN);

          this._TrailerButton.patch({
            props: {
              buttonLabel: t(TRANSLATIONS.TRAILER)?.toUpperCase(),
              callback: callback,
              buttonIcon: btnIcon,
            },
            visible: true,
          });
        } else {
          this._AuthorizedButtons.patch({
            y: -88,
            x: 445,
          });
        }
      })();

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
            if (streamUrl) {
              Router.navigate(ROUTES.PLAYER, {
                videoUrl: streamUrl,
                shouldSaveProgress: false,
              });
              return;
            }

            this._Info.visible = false;
            this._Spinner.visible = true;
            this._Spinner
              .animation({
                duration: 2, // animation duration in seconds
                repeat: -1, // repeat indefinitely
                actions: [
                  { p: 'rotation', v: { 0: 0, 1: 10 * Math.PI } }, // rotate 360 degrees
                ],
              })
              .start();

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
    const totalSeconds = Math.max(0, Math.floor(this.remainingUntilStart / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    this._Info.patch({
      Countdown: {
        visible: totalSeconds > 0,
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

  get _Info() {
    return this.tag('Info');
  }

  get _Spinner() {
    return this.tag('Spinner');
  }

  get _Summary() {
    return this.tag('Summary');
  }

  get _GalleryButton() {
    return this.tag('GalleryButton');
  }

  get _TrailerButton() {
    return this.tag('TrailerButton');
  }

  get _AuthorizedButtons() {
    return this.tag('AuthorizedButtons');
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
        this._TrailerButton.unfocus();
        this._ContinueWatching._unfocus();
        this._FavoriteButton._unfocus();
        break;
      case 'TrailerButton':
        this._setState('TrailerButton');
        this._GalleryButton._unfocus();
        this._ContinueWatching._unfocus();
        this._FavoriteButton._unfocus();
        break;
      case 'ContinueWatching':
        this._setState('ContinueWatching');
        this._TrailerButton.unfocus();
        this._GalleryButton._unfocus();
        this._FavoriteButton._unfocus();
        break;
      case 'FavoriteButton':
        this._setState('FavoriteButton');
        this._TrailerButton.unfocus();
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
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (this._TrailerButton.visible) {
            this._setState('TrailerButton');
          } else if (this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else {
            return false;
          }
        }
      },

      class TrailerButton extends this {
        _getFocused() {
          return this._TrailerButton;
        }

        _handleRight() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else {
            return false;
          }
        }

        _handleLeft() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          this._setState('GalleryButton');
        }
      },
      class ContinueWatching extends this {
        _getFocused() {
          return this._ContinueWatching;
        }

        _handleRight() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (this._FavoriteButton.alpha > 0) {
            this._setState('FavoriteButton');
          } else return false;
        }

        _handleLeft() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (this._TrailerButton.visible) {
            this._setState('TrailerButton');
          } else {
            this._setState('GalleryButton');
          }
        }

        _handleDown() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          return false;
        }
      },
      class FavoriteButton extends this {
        _getFocused() {
          return this._FavoriteButton;
        }
        _handleRight() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          return false;
        }
        _handleLeft() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (this._ContinueWatching.alpha > 0) {
            this._setState('ContinueWatching');
          } else if (this._TrailerButton.visible) {
            this._setState('TrailerButton');
          } else {
            this._setState('GalleryButton');
          }
        }
      },
    ];
  }
}
