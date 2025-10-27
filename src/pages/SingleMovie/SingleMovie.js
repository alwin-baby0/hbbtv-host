import { Lightning, Router, Utils } from '@lightningjs/sdk';
import Button from '../../components/Button/Button';
import { imageSizes } from '../../Models/utils';
import { CMPService, DetailService, t } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { eventTrackPayload } from '../../utils/device';
import { EVENT_NAMES, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';

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
          x: 2,
        },
        Image: {
          w: 1920,
          h: 1080,
          y: 0,
          zIndex: 1,
        },
        BackButton: {
          collision: true,
          type: BackBtn,
          texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
          x: 45,
          y: 30,
          props: {
            parentState: 'BackButton',
          },
          zIndex: 2,
        },
        Card: {
          zIndex: 2,
          x: 100,
          y: 120,
          w: 405,
          h: 1080,
          Info: {
            w: 205,
            h: 105,
            flex: { direction: 'row', alignItems: 'center' },
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
              w: 700,
              h: 90,
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
                maxLines: 8,
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
            AgeRating: {
              w: 700,
              y: 160,
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
              y: 100,
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
              y: 40,
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
              text: {
                fontSize: 22,
                lineHeight: 31,
                fontFace: 'Montserrat-Regular',
              },
            },
            Director: {
              w: 700,
              y: 50,
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
              text: {
                fontSize: 22,
                lineHeight: 31,
                fontFace: 'Montserrat-Regular',
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

    const splitDirector = director.split(':');
    const splitCast = cast.split(':');

    const tdirector = t('director') + ':' + splitDirector[1];
    const tcastTitle = t('cast') + ':';
    const tDirTitle = t('director') + ':';
    const tDirText = splitDirector[1];
    const castText = splitCast[1];

    const ageRating = `Age rating: ${rating}`;
    const genreTxt = `Genre: ${genre}`;

    this.patch({
      Content: {
        GradientOverlay: {
          texture: lng.Tools.getSvgTexture(Utils.asset('icons/home/gradient.svg'), 1920, 900),
        },
        Image: {
          src: movie.getLandscapePoster(imageSizes.XL)?.src,
        },
        Card: {
          Info: {
            /* Category: {
              text: {
                text: genre,
              },
            }, */
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
              text: {
                text: title,
              },
            },
            Description: {
              text: {
                text: description,
              },
            },
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
              visible: splitDirector[1] ? true : false,
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
              visible: splitCast[1] ? true : false,
            },
          },
        },
      },
    });

    const buttons = [
      {
        icon: 'icons/home/play.svg',
        buttonName: 'WATCH NOW',
        buttonLabel: t('watch_now')?.toUpperCase(),
        width: 405,
        stream: 'url',
      },
      {
        icon: 'icons/movies/trailer-icon.svg',
        buttonName: 'TRAILER',
        buttonLabel: t('trailer')?.toUpperCase(),
        width: 405,
        stream: 'trailerSrc',
      },
    ];

    const filteredButtons = !movieTrailerUrl
      ? buttons.filter((button) => button.buttonName !== 'TRAILER')
      : buttons;

    if (localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) {
      console.log(movie.is_favorite);
      filteredButtons.push({
        icon: movie.is_favorite ? 'icons/heart-filled.svg' : 'icons/heart.svg',
        buttonName: 'FAVORITE',
        buttonLabel: '',
        width: 100,
      });

      last_position &&
        filteredButtons.push({
          icon: 'icons/home/play.svg',
          buttonName: 'CONTINUE WATCHING',
          buttonLabel: t('continue_watching')?.toUpperCase(),
          width: 405,
        });
    }

    const rows = [];

    const languageCode = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_CODE);

    const itemsInRow = languageCode === 'fr' ? 2 : 3;

    for (let i = 0, j = filteredButtons.length; i < j; i += itemsInRow) {
      rows.push({ items: filteredButtons.slice(i, i + itemsInRow) });
    }

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
            flexItem: {
              marginRight: 30,
            },
            props: {
              width: item.width,
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
                      Router.navigate('player', {
                        videoUrl: result[0]?.content?.src ?? movie[item.stream],
                        duration: duration,
                        videoId: movieId,
                        ssai: result[0].extensions?.ssai ?? movie.ssai,
                      });
                    }
                  );
                } else if (item.buttonName === 'TRAILER') {
                  Router.navigate('player', {
                    videoUrl: movieTrailerUrl,
                    videoId: movieTrailerId,
                  });
                } else if (item.buttonName === 'CONTINUE WATCHING') {
                  Router.navigate('player', {
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
        Router.navigate('cmp', { movieId: this._props.movieId, url: 'movie-details' }, false);
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
      (history) => history.hash != 'splash' && history.hash != 'cmp'
    );

    if (routerHistory.length) {
      Router.back();
    } else {
      Router.navigate('home');
    }
  }

  async addToFavorite() {
    try {
      const { movie, movieTrailerUrl } = this._props;
      if (movie.is_favorite) {
        await CMPService.removeFromFavorites(movie.id);
      } else {
        await CMPService.addToFavorites(movie.id, 'video');
      }
      this._props.movie.is_favorite = !this._props.movie.is_favorite;

      const { is_favorite } = this._props.movie;

      const id = movieTrailerUrl ? 2 : 1; //depending on movieTrailerUrl, we will know on which position is add to fav btn
      console.log(id);
      console.log(this._Buttons.Items);
      this._Buttons.Items.children[0].Items.children[id].patch({
        props: {
          buttonIcon: Utils.asset(
            this._props.movie.is_favorite ? 'icons/heart-filled.svg' : 'icons/heart.svg'
          ),
          buttonLabel: '',
          width: 100,
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
