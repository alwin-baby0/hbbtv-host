import { Lightning, Router, Utils } from '@lightningjs/sdk';
import Button from '../../components/Button/Button';
import { imageSizes } from '../../Models/utils';
import { CMPService, DetailService, t } from '../../Services';
import BackBtn from '../../components/BackButton/BackBtn';
import { Column, Row } from '@lightningjs/ui-components';
import { eventTrackPayload } from '../../utils/device';

export default class SingleMovie extends Lightning.Component {
  _props = {};

  static _template() {
    return {
      Content: {
        collision: true,
        w: 1920,
        h: 1080,
        BackButton: {
          collision: true,
          type: BackBtn,
          texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
          x: 45,
          y: 30,
        },
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
            Summary: {
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
          y: 250,
          flex: { direction: 'column' },
          AboutMovie: {
            w: 700,
            h: 720,
            flex: { direction: 'column' },
            Title: {
              w: 700,
              h: 40,
              text: {
                text: '',
                fontSize: 32,
                lineHeight: 34,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            Description: {
              w: 700,
              y: 24,
              text: {
                fontSize: 25,
                lineHeight: 31,
                maxLines: 8,
                wordWrapWidth: 700,
                fontFace: 'Montserrat-Regular',
              },
            },
            Director: {
              w: 700,
              y: 48,
              text: {
                fontSize: 22,
                lineHeight: 31,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            Cast: {
              w: 700,
              y: 50,
              text: {
                fontSize: 22,
                lineHeight: 31,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            Buttons: {
              type: Column,
              collision: true,
              w: 1200,
              style: {
                itemSpacing: 100,
              },
              props: {
                disableScroll: true,
              },
              y: 72,
            },
          },
        },
      },
    };
  }

  get _Category() {
    return this.tag('Category');
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
    } = movie;

    const splitDirector = director.split(':');
    const splitCast = cast.split(':');

    const tdirector = t('director') + ':' + splitDirector[1];
    const tcast = t('cast') + ':' + splitCast[1];

    this.patch({
      Content: {
        Card: {
          Info: {
            Category: {
              text: {
                text: genre,
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
          Image: {
            src: movie.getPortraitPoster(imageSizes.XL)?.src,
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
            Director: {
              text: {
                text: tdirector,
              },
            },
            Cast: {
              text: {
                text: tcast,
              },
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

    if (localStorage.getItem('userData')) {
      filteredButtons.push({
        icon: movie.is_favorite ? 'icons/heart-filled.svg' : 'icons/heart.svg',
        buttonName: 'FAVORITE',
        buttonLabel: t('favorite')?.toUpperCase(),
        width: 335,
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
    for (let i = 0, j = filteredButtons.length; i < j; i += 3) {
      rows.push({ items: filteredButtons.slice(i, i + 3) });
    }

    this._Buttons.items = rows.map((row) => ({
      type: Row,
      collision: true,
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
    }));
  }

  async _active() {
    const router = Router.getHistory().filter((history) => history.hash != 'splash');
    if (!router.length && !this._props.cmpShown) {
      await CMPService.initialFetch();
      const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;
      const currentTimeInMS = Math.floor(Date.now() / 1000);

      if (expireTimeInMS === 0 || currentTimeInMS > expireTimeInMS) {
        Router.navigate('cmp', { movieId: this._props.movieId, url: 'movie-details' }, false);
      }
    }

    const { movieId } = this._props;

    this._setState('Buttons');

    eventTrackPayload('view_movie', movieId);

    this.fireAncestors('$unpunchHole');
  }

  _handleBack(e) {
    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();
    const router = Router.getHistory().filter(
      (history) => history.hash != 'splash' && history.hash != 'cmp'
    );
    if (router.length) {
      Router.setHistory([...router]);
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

      this._Buttons.items[0].items[id].patch({
        props: {
          buttonIcon: Utils.asset(is_favorite ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
          buttonLabel: t('favorite')?.toUpperCase(),
          width: 317,
        },
      });
    } catch (e) {
      //skip
      console.log('error', e);
    }
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
