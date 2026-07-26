import { Lightning, Registry, Router } from '@lightningjs/sdk';
import { constructRails } from '../utils';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import Gallery from '../../components/Gallery/Gallery';
import { HomePageService } from '../../Services';
import { railItemConstructor } from '../utils/railItems';
import { ROUTES, RAIL_TYPES, LOCAL_STORAGE_KEYS } from '../../constants/globalConstants';
import { hideElements, hideElementsAndCheckCmp } from '../../utils';

export default class Home extends Lightning.Component {
  _props = {
    sliderData: null,
    railData: [],
  };
  static _template() {
    return {
      Background: {},
      HeroSection: {
        x: 0,
        w: 1920,
        h: 650,
        collision: true,
        type: Gallery,
      },
      Wrapper: {
        x: 80,
        y: 980,
        h: 1080,
        w: 1700,
        Column: {
          h: 1080,
          w: 1700,
          collision: true,
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

    Router.setHistory([]);
  }

  /**
   * @param {{ sliderData: GalleryItem | null; railData: SimpleRailItem[]; }} props
   */
  set props(props) {
    this._props = { ...this._props, ...props };
    const { sliderData, railData } = this._props;

    const rails = constructRails(railData, ROUTES.HOME);
    this._Column.props = { items: rails, parentState: 'Items', page: ROUTES.HOME };

    if (sliderData) {
      this._HeroSection.patch({
        visible: true,
        props: {
          sliderData,
          parentState: 'Hero',
          scrollDownState: 'Items',
          bgY: -150,
        },
      });
    } else {
      this._setState('Items');
      this.patch({
        HeroSection: undefined,
      });
    }
  }

  _disable() {
    this.fireAncestors('$unpunchHole');
  }

  _firstEnable() {
    const languageSwitched = localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE_SWITCHED);
    if (languageSwitched) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LANGUAGE_SWITCHED);
      hideElements()
    } else {
      hideElementsAndCheckCmp()
    }

    Router.setHistory([]);
  }

  _firstActive() {
    this._setState('Hero');
  }

  _handleBack(e) {
    if (window.Didomi && window.didomiVisible) {
      return true;
    }

    if (Router.isNavigating()) {
      return;
    }
    e.preventDefault();

    this.fireAncestors('$appClose');
  }

  _handleHover() {
    if (!Router.isNavigating()) {
      Router.focusPage();
    }
  }

  $setStateOnScroll(nextState) {
    this._setState(nextState);
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
      class Hero extends this {
        _getFocused() {
          this.fireAncestors('$setNavbarVisibility', true);
          return this._HeroSection;
        }

        $enter() {
          this.fireAncestors('$setNavbarVisibility', true);

          this._Wrapper.patch({
            Column: {
              y: 0,
            },
          });
          this._Wrapper.setSmooth('y', 980)

          this._HeroSection.patch({
            y: 150,
          });
        }

        _handleBack(e) {
          if (window.Didomi && window.didomiVisible) {
            return true;
          }

          if (Router.isNavigating()) {
            return;
          }
          e.preventDefault();
          this.fireAncestors('$appClose');
        }

        _handleUp() {
          if (window.Didomi && window.didomiVisible) {
            return true;
          }

          if (!Router.isNavigating()) {
            Router.focusWidget(ROUTES.MENU_WIDGET);
          }
        }

        _handleDown() {
          if (window.Didomi && window.didomiVisible) {
            return true;
          }

          this._setState('Items');
        }

        async $horizontalContainerIndexChange(index) {
          if (this._HeroSection._Bullets.Items.children.length - 1 === index) {
            const newRails = await HomePageService.fetchMoreItemsForHeroSection();
            if (newRails && newRails?.items?.length > 0) {
              const parsedItems = railItemConstructor(newRails.items, RAIL_TYPES.HERO, {});
              this._HeroSection._Bullets._appendItems(parsedItems);
            }
          }
        }
      },

      class Items extends this {
        $enter() {
          this.fireAncestors('$setNavbarVisibility', false);

          this.patch({
            HeroSection: {
              y: -980,
            },
            Wrapper: {
              Column: {
                y: 20,
              },
            },
          });

          this._Wrapper.setSmooth('y', 0)

          this._HeroSection.patch({
            props: {
              bgY: 0,
            },
          });
        }

        $exit() {
          this.fireAncestors('$setNavbarVisibility', true);
          this.patch({
            HeroSection: {
              y: 0,
            },
            Wrapper: {
              y: 900,
              Column: {
                y: 0,
              },
            },
          });

          this._HeroSection.patch({
            props: {
              bgY: -150,
            },
          });
        }

        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          if (window.Didomi && window.didomiVisible) {
            return true;
          }

          this._setState('Hero');
        }

        _handleBack(e) {
          if (window.Didomi && window.didomiVisible) {
            return true;
          }

          if (Router.isNavigating()) {
            return;
          }
          e.preventDefault();
          this._setState('Hero');
        }

        async $verticalContainerIndexChange(index) {
          if (index > 0) {
            this.patch({
              HeroSection: {
                visible: false,
              },
              Wrapper: {
                y: 0,
                Column: {
                  y: 20,
                },
              },
            });
          } else {
            this.patch({
              HeroSection: {
                visible: true,
                y: 1080,
              },
              Wrapper: {
                y: 0,
                Column: {
                  y: 20,
                },
              },
            });
          }

          if (
            HomePageService.hasMore &&
            !HomePageService.loading &&
            index >= this._Column.Items.children.length - 2
          ) {
            const newStripes = await HomePageService.fetchMoreStripes();
            if (!newStripes) {
              return;
            }
            const rails = constructRails(newStripes, ROUTES.HOME);
            this._Column._appendItems(rails);
          }
        }
      },
    ];
  }
}
