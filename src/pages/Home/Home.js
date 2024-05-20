// Home.js
import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { Column } from '@lightningjs/ui-components';
import HomeRailItem from '../../api/home/HomeRailItem';
import VODRow from '../../components/VODRow/VODRow';
import Gallery from '../../components/Gallery/Gallery';
import PosterRailItem from '../../components/RailItems/PosterRailItem';

export default class Home extends Lightning.Component {
  _props = {
    sliderData: null,
    railData: [],
  };
  static _template() {
    return {
      Content: {
        Background: {
          w: 1920,
          h: 2080,
          src: Utils.asset('images/background.jpg'),
        },
        GallerySection: {
          x: 0,
          y: 0,
          w: 1920,
          h: 800,
          type: Gallery,
        },
      },
      Wrapper: {
        x: 80,
        y: 900,
        h: 600,
        w: 1760,
        clipping: true,
        Column: {
          y: 30,
          type: Column,
          // plinko: true,
          lazyUpCount: 2,
          lazyUpCountBuffer: 1,
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { sliderData, railData } = this._props;
    this._GallerySection.patch({
      props: {
        sliderData,
      },
    });

    const items = railData
      .map((row) => {
        const rowItems = Array.isArray(row.items)
          ? row.items.map((movie) => {
              // console.log('MOVIE ', movie);
              return {
                type: PosterRailItem,
                props: {
                  itemTitle: movie.title,
                  imageSrc: movie.getPortraitPoster(HomeRailItem.small).src,
                },
                w: 270,
                h: 384,
                data: movie,
              };
            })
          : undefined;

        return row.items
          ? {
              type: VODRow,
              title: row.sectionTitle ?? '',
              itemSpacing: 52,
              h: 600,
              items: rowItems,
            }
          : null;
      })
      .filter(Boolean);

    this.tag('Column').items = items;
  }

  get _GallerySection() {
    return this.tag('GallerySection');
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _enable() {
    this._setState('GallerySection');
  }

  static _states() {
    return [
      class GallerySection extends this {
        _getFocused() {
          this.fireAncestors('$hideNavbar', true);
          return this._GallerySection;
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('Items');
          this.tag('Content').patch({
            y: -305,
          });
          this.tag('Wrapper').patch({
            y: 500,
          });
        }
      },

      class Items extends this {
        _getFocused() {
          const focusedItem = this.tag('Column');
          if (focusedItem._selectedIndex === 0) {
            this.fireAncestors('$hideNavbar', false);
            this.tag('Column').patch({
              y: 30,
            });
            this.tag('Content').patch({
              y: -400,
            });
            this.tag('Wrapper').patch({
              y: 500,
            });
          }
          if (focusedItem._selectedIndex === 1) {
            this.fireAncestors('$hideNavbar', false);
            this.tag('Content').patch({
              y: -900,
            });
            this.tag('Wrapper').patch({
              y: 0,
              h: 1920,
            });
            this.tag('Column').patch({
              y: 200,
            });
          }

          return this.tag('Column');
        }

        _handleUp() {
          this._setState('GallerySection');

          this.tag('Content').patch({
            y: 0,
          });
          this.tag('Wrapper').patch({
            y: 900,
          });
        }
      },
    ];
  }
}
