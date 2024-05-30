// Home.js
import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { Column } from '@lightningjs/ui-components';
import VODRow from '../../components/VODRow/VODRow';
import Gallery from '../../components/Gallery/Gallery';
import PosterRailItem from '../../components/RailItems/PosterRailItem';
import { imageSizes } from '../../api/models/utils';

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
        },
      },
    };
  }

  get _Content() {
    return this.tag('Content');
  }

  get _GallerySection() {
    return this.tag('GallerySection');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  /**
   * @param {{ sliderData: GalleryItem | null; railData: SimpleRailItem[]; }} props
   */
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
            return {
              type: PosterRailItem,
              props: {
                itemTitle: movie.title,
                imageSrc: movie.getPortraitPoster(imageSizes.S).src,
              },
            };
          })
          : undefined;

        return row.items
          ? {
            type: VODRow,
            title: row.sectionTitle ?? '',
            h: 600,
            items: rowItems,
            style: {
              itemSpacing: 24,
            },
          }
          : null;
      })
      .filter(Boolean);
    this._Column.items = items;
  }

  _firstActive() {
    this.setState('GallerySection');
  }

  static _states() {
    return [
      class GallerySection extends this {
        _getFocused() {
          return this._GallerySection;
        }

        $enter() {
          this.fireAncestors('$hideNavbar', true);
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('Items');
          this._Content.patch({
            y: -305,
          });
          this._Wrapper.patch({
            y: 500,
          });
        }
      },

      class Items extends this {
        _getFocused() {
          const focusedItem = this._Column;
          if (focusedItem._selectedIndex === 0) {
            this.fireAncestors('$hideNavbar', false);
            this._Column.patch({
              y: 30,
            });
            this._Content.patch({
              y: -400,
            });
            this._Wrapper.patch({
              y: 500,
            });
          }
          if (focusedItem._selectedIndex === 1) {
            this.fireAncestors('$hideNavbar', false);
            this._Content.patch({
              y: -900,
            });
            this._Wrapper.patch({
              y: 0,
              h: 1920,
            });
            this._Column.patch({
              y: 200,
            });
          }

          return this._Column;
        }

        _handleUp() {
          this._setState('GallerySection');

          this._Content.patch({
            y: 0,
          });
          this._Wrapper.patch({
            y: 900,
          });
        }
      },
    ];
  }
}
