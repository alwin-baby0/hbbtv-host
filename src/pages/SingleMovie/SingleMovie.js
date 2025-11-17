import { Lightning, Router, Utils, Colors } from '@lightningjs/sdk';
import Button from '../../components/Button/Button';
import { CMPService, DetailService, t, UserService } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload } from '../../utils/device';
import {
  EVENT_NAMES,
  IMG_PATH,
  LOCAL_STORAGE_KEYS,
  ROUTES,
  TRANSLATIONS,
  IMAGE_SIZES,
} from '../../constants/globalConstants';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import colors from '../../../reskin/colors.json';
import { capitalizeFirstLetter } from '../../utils';

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
          w: 1920,
          zIndex: 2,
        },
        Image: {
          w: 1570,
          h: 1080,
          y: 0,
          x: 350,
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
        Card: {
          zIndex: 2,
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
            Summary: {
              w: 160,
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
        },
        CardInfo: {
          zIndex: 2,
          x: 90,
          y: 250,
          flex: { direction: 'column' },
          AboutMovie: {
            w: 700,
            h: 720,
            flex: { direction: 'column' },
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
              w: 900,
              y: 24,
              text: {
                fontSize: 25,
                lineHeight: 31,
                maxLines: 4,
                wordWrapWidth: 900,
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
              y: 42,
            },
            Metadata: {
              flex: { direction: 'column' },
              y: 210,
              AgeRating: {
                w: 700,
                h: 30,
                flex: { direction: 'row', alignItems: 'center' },
                Title: {
                  w: 150,
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
                  w: 90,
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
                  w: 90,
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
                  w: 100,
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
        },
      },
    };
  }

  get _AgeRating() {
    return this.tag('AgeRating');
  }
  get _Genre() {
    return this.tag('Genre');
  }
  get _Summary() {
    return this.tag('Summary');
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
  get _Cast() {
    return this.tag('Cast');
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

  _buildButtonConfiguration(movie, movieTrailerUrl, last_position) {
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
        icon: movie.is_favorite ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE,
        buttonName: 'FAVORITE',
        buttonLabel: '',
        width: 100,
        height: 78,
      });
    }

    return filteredButtons;
  }

  _arrangeButtonsInRowsDependingOnLanguage(buttons) {
    const languageCode = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);
    const itemsPerRow = 3;

    const rows = [];
    for (let i = 0; i < buttons.length; i += itemsPerRow) {
      rows.push({ items: buttons.slice(i, i + itemsPerRow) });
    }

    return rows;
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { movie, movieId, movieTrailerId, movieTrailerUrl } = this._props;
    const {
      title,
      description,
      duration,
      director,
      genre,
      summary,
      subtitle,
      cast,
      last_position,
      rating,
    } = movie;

    const titleLength = title.length;

    const splitDirector = director && director.split(':');
    const splitCast = cast && cast.split(':');

    const tAgeR = t(TRANSLATIONS.AGE_RATING) || 'Age Rating';
    const tGenre = t(TRANSLATIONS.GENRE) || 'Genre';
    const tCastTitle = t(TRANSLATIONS.CAST) + ':';
    const tDirTitle = t(TRANSLATIONS.DIRECTOR) + ':';
    const castText = splitCast && splitCast[1];
    const dirText = splitDirector && splitDirector[1];

    const badgeText = t(TRANSLATIONS.MOVIES);

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
                  text: capitalizeFirstLetter(badgeText),
                },
              },
            },
            Summary: {
              text: {
                text: summary,
              },
            },
            Subtitle: {
              text: {
                text: subtitle,
              },
            },
          },
        },
        CardInfo: {
          AboutMovie: {
            Title: {
              h: titleLength > 26 ? 130 : 90,
              text: {
                lineHeight: titleLength > 26 ? 58 : 34,
                text: title,
              },
            },
            Description: {
              text: {
                text: description,
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
          },
        },
      },
    });

    // Build button configuration based on movie data and user state
    const buttonConfigs = this._buildButtonConfiguration(movie, movieTrailerUrl, last_position);

    const rows = this._arrangeButtonsInRowsDependingOnLanguage(buttonConfigs);

    this._Buttons.props = {
      parentState: 'Buttons',
      items: rows.map((row) => ({
        type: HorizontalContainer,
        collision: true,
        props: {
          parentState: 'Buttons',
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
                  DetailService.getAdCues(movieId, undefined, movie[item.stream]).then(
                    ({ data: result }) => {
                      Router.navigate(ROUTES.PLAYER, {
                        videoUrl: result[0]?.content?.src ?? movie[item.stream],
                        duration: duration,
                        videoId: movieId,
                        ssai: result[0].extensions?.ssai ?? movie.ssai,
                      });
                    }
                  );
                } else if (item.buttonName === 'TRAILER') {
                  Router.navigate(ROUTES.PLAYER, {
                    videoUrl: movieTrailerUrl,
                    videoId: movieTrailerId,
                  });
                } else if (item.buttonName === 'CONTINUE WATCHING') {
                  Router.navigate(ROUTES.PLAYER, {
                    videoUrl: movie.url,
                    duration: duration,
                    videoId: movieId,
                    continueTime: last_position,
                    ssai: movie.ssai,
                  });
                }
              },
            },
          })),
        },
      })),
    };
  }

  async _active() {
    if (!this._props.cmpShown) {
      await CMPService.initialFetch();
      const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;
      const currentTimeInMS = Math.floor(Date.now() / 1000);

      if (expireTimeInMS === 0 || currentTimeInMS > expireTimeInMS) {
        Router.navigate(
          ROUTES.CMP,
          { movieId: this._props.movieId, url: ROUTES.MOVIE_DETAILS },
          false
        );
      }
    }

    const { movieId } = this._props;

    this._setState('Buttons');

    eventTrackPayload(EVENT_NAMES.VIEW_MOVIE, movieId);

    this.fireAncestors('$unpunchHole');
  }

  _handleBack(e) {
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
      const { movie, movieTrailerUrl } = this._props;
      if (movie.is_favorite) {
        await UserService.removeFromFavorites(movie.id);
      } else {
        await UserService.addToFavorites(movie.id, 'video');
      }
      this._props.movie.is_favorite = !this._props.movie.is_favorite;

      const { is_favorite } = this._props.movie;

      const id = movieTrailerUrl ? 3 : 2; //depending on movieTrailerUrl, we will know on which position is add to fav btn

      this._Buttons.Items.children[0].Items.children[id].patch({
        props: {
          buttonIcon: Utils.asset(
            this._props.movie.is_favorite ? IMG_PATH.FAVORITE_FILL : IMG_PATH.FAVORITE
          ),
          buttonLabel: '',
          width: 100,
          height: 78,
        },
      });
    } catch (e) {
      //skip
      console.log('error', e);
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
          return this._Buttons;
        }

        _handleLeft() {
          this._setState('BackButton');
        }

        _handleUp() {
          this._setState('BackButton');
        }
      },
      class ContinueBtn extends this {
        _getFocused() {
          return this._ContinueButton;
        }

        _handleUp() {
          this._setState('Buttons');
        }

        _handleLeft() {
          this._setState('BackButton');
        }
      },

      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }

        _handleDown() {
          this._setState('Buttons');
        }

        _handleRight() {
          this._setState('Buttons');
        }
      },
    ];
  }
}
