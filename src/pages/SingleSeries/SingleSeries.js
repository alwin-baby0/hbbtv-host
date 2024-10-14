import { Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import GalleryItem from '../../Components/GalleryItem/GalleryItem';
import { CMPService } from '../../Services/CMPService';
import BackBtn from '../../components/BackButton/BackBtn';

export default class SingleSeries extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      h: 1080,
      w: 1920,
      BackButton: {
        type: BackBtn,
        texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/backbtn.svg'), 80, 80),
        x: 85,
        y: 20,
        zIndex: 100,
      },
      Background: {
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.jpg'),
      },
      SeriesWrapper: {
        HeroSection: {
          type: GalleryItem,
        },
      },
      Wrapper: {
        x: 110,
        y: 715,
        h: 600,
        w: 1770,
        clipping: true,
        Column: {
          h: 600,
          w: 1770,
          type: VerticalContainer,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { galleryItem, favorited, duration, firstEpisodeVideoId } = this._props;
    const { url, id, lastPlayedId, position } = galleryItem;
    console.log('firstEpisodeVideoId:', firstEpisodeVideoId);
    this._HeroSection.patch({
      props: {
        galleryItem: galleryItem,
        // height: 650,
        height: 620,
        firstEpisodeVideoId: firstEpisodeVideoId,
      },
    });

    this._HeroSection._GalleryButton.patch({
      props: {
        width: 400,
        buttonLabel: 'WATCH FIRST EPISODE',
      },
    });

    if (localStorage.getItem('userData')) {
      this._HeroSection._ContinueWatching.patch({
        alpha: 1,
        props: {
          buttonIcon: Utils.asset('icons/home/play.svg'),
          buttonLabel: 'CONTINUE WATCHING',
          width: 400,
          callback: () => {
            Router.navigate('player', {
              videoUrl: url,
              duration: duration,
              videoType: 'series',
              seriesID: id,
              videoId: lastPlayedId,
              continueTime: position,
            });
          },
        },
      });
      this._HeroSection._FavoriteButton.patch({
        alpha: 1,
        props: {
          buttonIcon: Utils.asset(favorited ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
          buttonLabel: 'FAVORITE',
          width: 255,
          callback: () => {
            this.addToFavorite();
          },
        },
      });
    }
  }

  async addToFavorite() {
    /* console.log(this);
    const { id } = this._props.galleryItem;
    await CMPService.addToFavorites(id, 'video');
    const favoriteees = await CMPService.getFavorites();
    console.log(favoriteees); */

    try {
      const { favorited } = this._props;
      const { id } = this._props.galleryItem;
      if (favorited) {
        await CMPService.removeFromFavorites(id);
      } else {
        await CMPService.addToFavorites(id, 'series');
      }

      this._props.favorited = !this._props.favorited;

      const { favorited: newFavorited } = this._props;

      this._HeroSection._FavoriteButton.patch({
        props: {
          buttonIcon: Utils.asset(newFavorited ? 'icons/heart-filled.svg' : 'icons/heart.svg'),
          buttonLabel: 'FAVORITE',
          width: 255,
        },
      });
    } catch (e) {
      //skip
      console.log('error', e);
    }
  }

  _active() {
    this._setState('HeroSection');
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _SeriesWrapper() {
    return this.tag('SeriesWrapper');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _BackButton() {
    return this.tag('BackButton');
  }

  _init() {}

  _getFocused() {}

  static _states() {
    return [
      class HeroSection extends this {
        _getFocused() {
          this._SeriesWrapper.patch({
            y: 0,
          });
          this._BackButton.patch({
            y: 20,
          });
          return this._HeroSection;
        }

        _handleDown() {
          if (this.tag('Column').Items.children.length > 0) {
            this._setState('Items');
          } else {
            return false;
          }
        }

        _handleUp() {
          this._setState('BackButton');
        }
      },

      class BackButton extends this {
        _getFocused() {
          return this._BackButton;
        }
        _handleDown() {
          this._setState('HeroSection');
        }
      },

      class Items extends this {
        _getFocused() {
          return this._Column;
        }

        $enter() {
          this.$verticalContainerIndexChange();
        }

        $exit() {
          this.tag('Wrapper').patch({
            y: 715,
            h: 600,
          });
        }

        $verticalContainerIndexChange(index) {
          if (index > 0 && index !== undefined) {
            this._SeriesWrapper.patch({
              y: -650,
            });
            this.tag('Wrapper').patch({
              y: 0,
              h: 1080,
            });
            this.tag('Column').patch({
              h: 1080,
            });
          } else {
            this._BackButton.patch({
              y: -180,
            });
            this._SeriesWrapper.patch({
              y: -140,
            });
            this.tag('Wrapper').patch({
              y: 500,
              h: 1080,
            });
            this.tag('Column').patch({
              h: 1080,
            });
          }
        }

        _handleUp() {
          this._setState('HeroSection');
        }
      },
    ];
  }
}
