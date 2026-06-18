import { Lightning, Router, Utils, Colors } from '@lightningjs/sdk';
import Button from '../../components/Button/Button';
import { DetailService, LoggingService, UserService } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload, getDeviceType } from '../../utils/device';
import {
  EVENT_NAMES,
  IMG_PATH,
  LOCAL_STORAGE_KEYS,
  ROUTES,
  TRANSLATIONS,
  IMAGE_SIZES,
  LOG_LEVEL,
} from '../../constants/globalConstants';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import colors from '../../../reskin/colors.json';
import { capitalizeFirstLetter, checkCMP } from '../../utils';
import { Metrics } from '@firebolt-js/sdk';
import { didomiVisible } from '../../App';
import { t } from '../../utils';

const states = ['Buttons', 'ContinueBtn', 'BackButton'];

export default class SingleMovie extends Lightning.Component {
  _props = {};

  static _template() {
    return {
      Content: {
        collision: true,
        w: 1920,
        h: 1080,
        GradientOverlay: {
          x: 200,
          w: 1920,
          zIndex: 2,
        },
        Image: {
          y: 0,
          x: 350,
          w: 1570,
          h: 883,
          zIndex: 1,
        },
        BackButton: {
          collision: true,
          type: BackBtn,
          texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.BACK_BTN), 80, 80),
          x: 45,
          y: 30,
          props: {
            parentState: 'BackButton',
          },
          zIndex: 2,
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
        Card: {
          zIndex: 3,
          x: 90,
          y: 120,
          w: 1000,
          h: 1080,
          Info: {
            w: 1000,
            h: 105,
            flex: { direction: 'row', alignItems: 'center' },
            Badge: {
              rect: true,
              h: 55,
              flex: {
                direction: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
              flexItem: {
                marginRight: 30,
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
            FactLine: {
              w: 550,
              h: 29,
              text: {
                fontSize: 24,
                lineHeight: 30,
                fontFace: 'Montserrat-Regular',
              },
            },
          },
        },
        CardInfo: {
          zIndex: 3,
          x: 90,
          y: 250,
          flex: { direction: 'column' },
          AboutMovie: {
            w: 700,
            h: 720,
            flex: { direction: 'column' },
            Title: {
              w: 900,
              wordWrapWidth: 800,
              text: {
                text: '',
                fontSize: 50,
                fontFace: 'Montserrat-SemiBold',
                maxLines: 2,
              },
            },
            Description: {
              w: 900,
              y: 24,
              text: {
                fontSize: 25,
                lineHeight: 31,
                maxLines: 4,
                wordWrapWidth: 800,
                fontFace: 'Montserrat-Regular',
              },
            },
            Buttons: {
              type: VerticalContainer,
              collision: true,
              w: 1200,
              style: {
                itemSpacing: 100,
              },
              y: 62,
              props: {
                enableScroll: false,
              },
            },
            Metadata: {
              flex: { direction: 'column' },
              y: 130,
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
                    maxLines: 1,
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
        },
        PlaylistWrapper: {
          collision: true,
          x: 110,
          y: 915,
          h: 600,
          w: 1770,
          clipping: true,
          Column: {
            collision: true,
            h: 600,
            w: 1770,
            type: VerticalContainer,
          },
        },
      },
    };
  }

  get _Buttons() {
    return this.tag('Buttons');
  }

  get _ContinueButton() {
    return this.tag('ContinueButton');
  }

  get _BackButton() {
    return this.tag('BackButton');
  }

  get _Column() {
    return this.tag('PlaylistWrapper.Column');
  }

  get _Card() {
    return this.tag('Card');
  }

  get _CardInfo() {
    return this.tag('CardInfo');
  }

  get _Spinner() {
    return this.tag('Spinner');
  }

  _buildButtonConfiguration(movieTrailerUrl, last_position, favorited) {
    const buttons = [
      {
        icon: IMG_PATH.PLAY_BTN,
        buttonName: 'WATCH NOW',
        buttonLabel: t(TRANSLATIONS.WATCH_NOW)?.toUpperCase(),
        width: 405,
        height: 78,
        stream: 'url',
      },
      {
        icon: IMG_PATH.TRAILER_ICON,
        buttonName: 'TRAILER',
        buttonLabel: t(TRANSLATIONS.TRAILER)?.toUpperCase(),
        width: 405,
        height: 78,
        stream: 'trailerSrc',
      },
    ];

    // Filter out trailer button if no trailer URL is available
    const filteredButtons = !movieTrailerUrl
      ? buttons.filter((button) => button.buttonName !== 'TRAILER')
      : buttons;

    // Add user-specific buttons if logged in
    const isUserLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);

    if (isUserLoggedIn) {
      // Add continue watching button if user has progress
      if (last_position) {
        filteredButtons.push({
          icon: IMG_PATH.PLAY_BTN,
          buttonName: 'CONTINUE WATCHING',
          buttonLabel: t(TRANSLATIONS.CONTINUE_WATCHING)?.toUpperCase(),
          width: 405,
          height: 78,
        });
      }

      // Add favorite button
      filteredButtons.push({
        icon: favorited ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE,
        buttonName: 'FAVORITE',
        buttonLabel: '',
        width: 100,
        height: 78,
      });
    }

    return filteredButtons;
  }

  _arrangeButtonsInRowsDependingOnLanguage(buttons) {
    const itemsPerRow = 4;

    const rows = [];
    for (let i = 0; i < buttons.length; i += itemsPerRow) {
      rows.push({ items: buttons.slice(i, i + itemsPerRow) });
    }

    return rows;
  }

  set props(props) {
    this._Spinner.visible = false;
    this._Card.visible = true;
    this._CardInfo.visible = true;
    this._props = { ...this._props, ...props };
    const {
      movie,
      movieId,
      movieTrailerId,
      movieTrailerUrl,
      favorited,
      last_position,
      playlistVODS,
    } = this._props;

    const {
      title,
      duration,
      director,
      genre,
      summary,
      cast,
      rating,
      durationString,
      year,
      country,
      imdbScore,
      videoUrl,
      badgeText,
    } = movie;

    this._Column.props = { items: playlistVODS, parentState: 'PlaylistWrapper' };

    const imdbScoreLabeled = `IMDB ${imdbScore}`;

    const factLine = [durationString, year, country, imdbScoreLabeled].join(' | ');

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

    const badgeTextString = badgeText || capitalizeFirstLetter(t(TRANSLATIONS.MOVIES));

    this.patch({
      Content: {
        GradientOverlay: {
          texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.GRADIENT_SVG), 1920, 1080),
        },
        Image: {
          src: movie.getLandscapePoster(IMAGE_SIZES.XL)?.src,
        },
        Card: {
          Info: {
            Badge: {
              texture: Lightning.Tools.getRoundRect(
                200,
                55,
                10,
                2,
                Colors(colors.white).get(),
                true,
                Colors('#4a4a49').get()
              ),
              Text: {
                text: {
                  text: badgeTextString,
                },
              },
            },
            FactLine: {
              text: {
                text: factLine,
              },
            },
          },
        },
        CardInfo: {
          AboutMovie: {
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
                visible: director,
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
          },
        },
      },
    });

    // Build button configuration based on movie data and user state
    const buttonConfigs = this._buildButtonConfiguration(movieTrailerUrl, last_position, favorited);

    const rows = this._arrangeButtonsInRowsDependingOnLanguage(buttonConfigs);

    this._Buttons.props = {
      parentState: 'Buttons',
      items: rows.map((row) => ({
        type: HorizontalContainer,
        collision: true,
        props: {
          parentState: 'Buttons',
          disableScroll: true,
          items: row.items.map((item, index) => ({
            type: Button,
            collision: true,
            w: item.width,
            h: item.height,
            flexItem: {
              marginRight: 20,
            },
            props: {
              width: item.width,
              height: item.height,
              index,
              buttonLabel: item.buttonLabel,
              buttonIcon: Utils.asset(item.icon),
              position: item.buttonName === 'CONTINUE WATCHING' ? last_position : 0,
              duration: duration,
              callback: () => {
                if (item.buttonName === 'FAVORITE') {
                  this.addToFavorite();
                } else if (item.buttonName === 'WATCH NOW') {
                  this._Card.visible = false;
                  this._CardInfo.visible = false;
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

                  DetailService.getAdCues(movieId, undefined, movie[item.stream]).then(
                    ({ data: result }) => {
                      Router.navigate(ROUTES.PLAYER, {
                        videoUrl: result?.entry[0]?.files.url ?? videoUrl,
                        duration: duration,
                        videoId: movieId,
                        ssai: result?.entry[0]?.extensions?.ssai ?? movie.ssai,
                      });
                    }
                  );
                } else if (item.buttonName === 'TRAILER') {
                  Router.navigate(ROUTES.PLAYER, {
                    videoUrl: movieTrailerUrl,
                    videoId: movieTrailerId,
                  });
                } else if (item.buttonName === 'CONTINUE WATCHING') {
                  this._Card.visible = false;
                  this._CardInfo.visible = false;
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

                  DetailService.getAdCues(movieId, undefined, movie[item.stream]).then(
                    ({ data: result }) => {
                      Router.navigate(ROUTES.PLAYER, {
                        videoUrl: result?.entry[0]?.files.url ?? videoUrl,
                        duration: duration,
                        videoId: movieId,
                        continueTime: last_position,
                        ssai: result?.entry[0]?.extensions?.ssai ?? movie.ssai,
                      });
                    }
                  );
                }
              },
            },
          })),
        },
      })),
    };

    this._setState('Buttons');
  }

  async _active() {
    checkCMP();

    const { movieId } = this._props;

    this._setState('Buttons');

    eventTrackPayload(EVENT_NAMES.VIEW_MOVIE, movieId);

    this.fireAncestors('$unpunchHole');
  }

  _handleBack(e) {
    if (window.Didomi && didomiVisible) {
      return;
    }

    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();

    const routerHistory = Router.getHistory().filter(
      (history) => history.hash != ROUTES.SPLASH && history.hash != ROUTES.CMP
    );

    if (routerHistory.length) {
      Router.back();
    } else {
      Router.navigate(ROUTES.HOME);
    }
  }

  async addToFavorite() {
    try {
      const { movie, favorited } = this._props;
      if (favorited) {
        await UserService.removeFromFavorites(movie.id);
      } else {
        await UserService.addToFavorites(movie.id, 'movie');
      }
      this._props.favorited = !this._props.favorited;

      const id = this._Buttons.Items.children[0].Items.children.length - 1;

      this._Buttons.Items.children[0].Items.children[id].patch({
        props: {
          buttonIcon: Utils.asset(
            this._props.favorited ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE
          ),
          buttonLabel: '',
          width: 100,
          height: 78,
        },
      });
    } catch (e) {
      const deviceType = getDeviceType();
      deviceType === 'metrological' &&
        Metrics.error(
          Metrics.ErrorType.MEDIA,
          '400',
          'Failed to update favorite status of VOD',
          true
        );
      LoggingService.postLog(LOG_LEVEL.ERROR, e?.response?.status, e?.response);
    }
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  static _states() {
    return [
      class Buttons extends this {
        _getFocused() {
          this.patch({
            Content: {
              Image: {
                y: 0,
              },
              BackButton: {
                y: 30,
              },
              Card: {
                y: 120,
              },
              CardInfo: {
                y: 250,
              },
              PlaylistWrapper: {
                y: 915,
              },
            },
          });

          return this._Buttons;
        }

        _handleLeft() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('BackButton');
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('BackButton');
        }

        _handleDown() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('PlaylistWrapper');
        }
      },
      class ContinueBtn extends this {
        _getFocused() {
          return this._ContinueButton;
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('Buttons');
        }

        _handleLeft() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('BackButton');
        }
      },

      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }

        _handleDown() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('Buttons');
        }

        _handleRight() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('Buttons');
        }
      },

      class PlaylistWrapper extends this {
        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return;
          }

          this._setState('Buttons');
        }

        $enter() {
          this.patch({
            Content: {
              Image: {
                y: -340,
              },
              BackButton: {
                y: -180,
              },
              Card: {
                y: -340,
              },
              CardInfo: {
                y: -240,
              },
              PlaylistWrapper: {
                y: 500,
              },
            },
          });
        }

        $exit() {
          this.patch({
            Content: {
              Image: {
                y: 0,
              },
              BackButton: {
                y: 30,
              },
              Card: {
                y: 120,
              },
              CardInfo: {
                y: 250,
              },
              PlaylistWrapper: {
                y: 915,
              },
            },
          });
        }
      },
    ];
  }
}
