import { Colors, Language, Lightning, Router, Utils } from '@lightningjs/sdk';
import Button from '../../Components/Button/Button';
import HorizontalContainer from '../../Components/HorizontalContainer/HorizontalContainer';
import { imageSizes } from '../../Models/utils';
import { CMPService } from '../../Services/CMPService';
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
          // y: 350,
          y: 250,
          flex: { direction: 'column' },
          AboutMovie: {
            w: 700,
            // h: 275,
            // h: 460,
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
              // h: 62,
              y: 24,
              text: {
                fontSize: 25,
                lineHeight: 31,
                maxLines: 8,
                wordWrapWidth: 700,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            Director: {
              w: 700,
              // h: 31,
              y: 48,
              text: {
                fontSize: 22,
                lineHeight: 31,
                fontFace: 'Montserrat-SemiBold',
              },
            },
            Cast: {
              w: 700,
              // h: 31,
              y: 50,
              text: {
                text: 'cast',
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
              // h: 78,
              // y: 196,
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

    this._Category.patch({
      text: {
        text: genre,
      },
    });
    this._Summary.patch({
      text: {
        text: summary,
      },
    });
    this._Subtitle.patch({
      text: {
        text: subtitle,
      },
    });
    this._Image.patch({
      src: movie.getPortraitPoster(imageSizes.XL)?.src,
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
    this._Director.patch({
      text: {
        text: director,
      },
    });
    this._Cast.patch({
      text: {
        text: cast,
      },
    });
    /* this._BackButton.patch({
      texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 24, 24),
    }); */

    const buttons = [
      {
        icon: 'icons/home/play.svg',
        buttonLabel: 'WATCH NOW',
        // width: 285,
        width: 405,
        stream: 'url',
      },
      {
        icon: 'icons/movies/trailer-icon.svg',
        buttonLabel: 'TRAILER',
        width: 237,
        stream: 'trailerSrc',
      },
    ];

    const filteredButtons = !movieTrailerUrl
      ? buttons.filter((button) => button.buttonLabel !== 'TRAILER')
      : buttons;

    if (localStorage.getItem('userData')) {
      filteredButtons.push({
        icon: movie.is_favorite ? 'icons/heart-filled.svg' : 'icons/heart.svg',
        buttonLabel: 'FAVORITE',
        width: 255,
      });

      last_position &&
        filteredButtons.push({
          icon: 'icons/home/play.svg',
          buttonLabel: 'CONTINUE WATCHING',
          width: 405,
        });

      // console.log('MOVIEEE', movie);
      /* this.tag('CardInfo.AboutMovie').patch({
        ContinueButton: {
          y: 170,
          type: Button,
          w: 405,
          flexItem: {
            marginRight: 30,
          },
          props: {
            width: 405,
            buttonLabel: 'CONTINUE WATCHING',
            buttonIcon: Utils.asset('icons/home/play.svg'),
            callback: () => {
              console.log('continue:', last_position);
              Router.navigate('player', {
                videoUrl: movie.url,
                duration: duration,
                videoId: movieId,
                continueTime: last_position,
                ssai: movie.ssai,
              });
            },
          },
        },
      }); */
    }

    const mappedButtons = buttons
      .map((button) => {
        const { movie } = this._props;
        const { buttonLabel, icon, width, stream } = button;
        const translatedTitle = Language.translate(buttonLabel);

        if (buttonLabel === 'TRAILER' && !movieTrailerUrl) {
          return null; // Skip this button by returning null if there is no trailer url
        }
        return {
          type: Button,
          w: width,
          flexItem: {
            marginRight: 30,
          },
          props: {
            width: width,
            buttonLabel: translatedTitle,
            buttonIcon: Utils.asset(icon),
            callback: () => {
              if (buttonLabel === 'FAVORITE') {
                this.addToFavorite();
              } else if (buttonLabel === 'WATCH NOW') {
                Router.navigate('player', {
                  videoUrl: movie[stream],
                  duration: duration,
                  videoId: movieId,
                  ssai: movie.ssai,
                });
              } else if (buttonLabel === 'TRAILER') {
                Router.navigate('player', {
                  videoUrl: movieTrailerUrl,
                  videoId: movieTrailerId,
                });
              } else if (buttonLabel === 'CONTINUE WATCHING') {
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
        };
      })
      .filter((button) => button !== null);

    const rows = [];
    console.log(mappedButtons, 'Buttons');
    for (let i = 0, j = filteredButtons.length; i < j; i += 3) {
      rows.push({ items: filteredButtons.slice(i, i + 3) });
    }

    console.log('ROWWW', rows);

    this._Buttons.items = rows.map(
      (row) => (
        console.log(row, 'fired'),
        {
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
              // buttonLabel: translatedTitle,
              buttonLabel: item.buttonLabel,
              buttonIcon: Utils.asset(item.icon),
              callback: () => {
                if (item.buttonLabel === 'FAVORITE') {
                  this.addToFavorite();
                } else if (item.buttonLabel === 'WATCH NOW') {
                  Router.navigate('player', {
                    videoUrl: movie[item.stream],
                    duration: duration,
                    videoId: movieId,
                    ssai: movie.ssai,
                  });
                } else if (item.buttonLabel === 'TRAILER') {
                  Router.navigate('player', {
                    videoUrl: movieTrailerUrl,
                    videoId: movieTrailerId,
                  });
                } else if (item.buttonLabel === 'CONTINUE WATCHING') {
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
        }
      )
    );
  }

  _active() {
    const { movieId } = this._props;

    this._setState('Buttons');

    eventTrackPayload('view_movie', movieId);
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

      console.log(this._Buttons.Items);
      console.log(this._Buttons);

      //this._Buttons.Items.childList._items[id]

      this._Buttons.items[0].items[id].patch({
        props: {
          buttonIcon: Utils.asset(is_favorite ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
          buttonLabel: 'FAVORITE',
          width: 255,
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

        // _handleDown() {
        //   this._setState('ContinueBtn');
        // }

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
