import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { constructRails } from '../utils';
import { HomePageService } from '../../api/services';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import Gallery from '../../components/Gallery/Gallery';

export default class Home extends Lightning.Component {
  _props = {
    sliderData: null,
    railData: [],
  };
  static _template() {
    return {
      Background: {
        w: 1920,
        h: 2080,
        src: Utils.asset('images/background.jpg'),
      },
      HeroSection: {
        x: 0,
        y: 0,
        w: 1920,
        h: 800,
        type: Gallery,
      },
      Wrapper: {
        x: 80,
        y: 900,
        h: 1080,
        w: 1760,
        Column: {
          h: 1080,
          w: 1760,
          type: VerticalContainer,
        },
      },
    };
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _active() {
    if (this._getState() === 'Items') {
      setTimeout(() => {
        this.fireAncestors('$setNavbarVisibility', false);
      });
    }
  }

  /**
   * @param {{ sliderData: GalleryItem | null; railData: SimpleRailItem[]; }} props
   */
  set props(props) {
    this._props = { ...this._props, ...props };
    const { sliderData, railData } = this._props;

    const rails = constructRails(railData);
    this._Column.props = { items: rails };

    if (sliderData) {
      this._HeroSection.patch({
        visible: true,
        props: {
          sliderData,
        },
      });
    }

    this._HeroSection._HeroSection._GalleryButton.patch({
      props: {
        buttonLabel: 'WATCH NOW',
      },
    });
  }

  _firstActive() {
    this._setState('Hero');
  }

  static _states() {
    return [
      class Hero extends this {
        _getFocused() {
          return this._HeroSection;
        }

        $enter() {
          this.fireAncestors('$setNavbarVisibility', true);
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('Items');
        }
      },

      class Items extends this {
        $enter() {
          this.fireAncestors('$setNavbarVisibility', false);
          this._HeroSection.patch({
            y: -305,
          });
          this._Wrapper.patch({
            y: 500,
          });
        }

        $exit() {
          this.fireAncestors('$setNavbarVisibility', true);
          this._HeroSection.patch({
            y: 0,
          });
          this._Wrapper.patch({
            y: 900,
          });
        }

        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          this._setState('Hero');
        }

        async $verticalContainerIndexChange(index) {
          if (index > 0) {
            this._HeroSection.patch({
              visible: false,
            });
            this._Wrapper.patch({
              y: 0,
            });
          } else {
            this._HeroSection.patch({
              visible: true,
              y: -305,
            });
            this._Wrapper.patch({
              y: 500,
            });
          }

          if (
            HomePageService.hasMore &&
            !HomePageService.isLoading &&
            HomePageService.stripesFetched - 2 === index
          ) {
            const newStripes = await HomePageService.fetchMoreStripes();
            const rails = constructRails(newStripes);
            this._Column._appendItems(rails);
          }
        }
      },
    ];
  }
}
