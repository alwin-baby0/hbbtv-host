import { Lightning, Router } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import VodContentContainer from '../../components/VodContentContainer/VodContentContainer';
import Gallery from '../../components/Gallery/Gallery';
import { constructRails } from '../utils';
import { eventTrackPayload } from '../../utils/device';
import {
  EVENT_NAMES,
  ROUTES,
  VOD_PREVIEW_TYPES,
  CONTENT_TYPE,
  IMAGE_SIZES,
} from '../../constants/globalConstants';
import { SearchService, VodService } from '../../Services';
import PosterRailItem from '../../components/RailItems/PosterRailItem';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';

const states = ['VodContentContainer', 'VodContainer'];

export default class VodPreview extends Lightning.Component {
  constructor(context) {
    super(context);
    this.changeContent = this.changeContent.bind(this);
  }

  _props = {
    vodType: undefined,
    fetchMoreStripes: async () => null,
    fetchMoreHeroStripes: async () => null,
  };

  static _template() {
    return {
      collision: true,
      HeroSection: {
        x: 0,
        y: 150,
        w: 1920,
        h: 650,
        collision: true,
        type: Gallery,
      },
      VodContentContainer: {
        type: VodContentContainer,
        zIndex: 2,
      },
      VodContainer: {
        zIndex: 2,
        x: 90,
        y: 980,
        w: 1740,
        h: 670,
        clipping: true,
        Column: {
          y: 980,
          h: 795,
          w: 1740,
          collision: true,
          type: VerticalContainer,
        },
      },
    };
  }

  _active() {
    window.addEventListener('changeContent', (event) => {
      this.changeContent(event.detail.category, event.detail.type);
    });
  }

  async changeContent(category, type) {
    if (category.toUpperCase() === 'ALL') {
      VodService.vodType = this._props.vodType;

      await VodService.initialFetch();

      const vodStripes = constructRails(VodService.vodStripes);

      this._Column.props = {
        items: Array.isArray(vodStripes)
          ? vodStripes.reduce((acc, rail) => {
              if (Array.isArray(rail)) {
                acc.push(...rail);
              } else {
                acc.push(rail);
              }
              return acc;
            }, [])
          : vodStripes,
        railTitle: '',
      };
      this._Column.patch({
        h: 795,
      });

      return;
    }

    const ROW_SIZE = 6;
    const { items } = await SearchService.getSearch(category, type);
    this._Column._clear();
    let rows = [];
    let grid;
    if (items.length > 0) {
      for (let i = 0; i < items.length; i += ROW_SIZE) {
        rows.push({ items: items.slice(i, i + ROW_SIZE) });
      }
      grid = rows.map((row) => {
        return {
          type: HorizontalContainer,
          collision: true,
          h: 460,
          w: 1760,
          itemSpacing: 520,
          props: {
            items: row.items.map((item, index) => ({
              type: PosterRailItem,
              collision: true,
              flexItem: {
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                marginBottom: 10,
              },
              props: {
                itemTitle: item.title,
                imageSrc: item.getPortraitPoster(IMAGE_SIZES.S).src,
                callback: () => {
                  Router.navigate(`${searchType}-details/${item.id}`);
                },
                index,
              },
            })),
          },
        };
      });
    }
    this._Column.props = {
      ...(items && items.length
        ? {
            items: grid,
          }
        : { railTitle: `No items found for category: ${category}` }),
      parentState: 'VodContainer',
    };
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _VodContainer() {
    return this.tag('VodContainer');
  }

  get _VodContentContainer() {
    return this.tag('VodContentContainer');
  }

  get _Column() {
    return this.tag('VodContainer.Column');
  }

  set props(props) {
    const { vodType } = props;

    if (vodType === VOD_PREVIEW_TYPES.MOVIES) eventTrackPayload(EVENT_NAMES.BROWSE_MOVIES, 1);
    if (vodType === VOD_PREVIEW_TYPES.SERIES) eventTrackPayload(EVENT_NAMES.BROWSE_SERIES, 2);
    if (vodType === VOD_PREVIEW_TYPES.SPORTS) eventTrackPayload(EVENT_NAMES.BROWSE_SPORTS, 3);

    if (vodType === VOD_PREVIEW_TYPES.SPORTS) {
      this._Column.patch({ y: 100 });
    } else {
      this._Column.patch({ y: 50 });
    }

    if (this._props.vodType !== vodType) {
      this._props = { ...this._props, ...props };
      const { content, items, sliderData } = this._props;

      if (sliderData) {
        this._HeroSection.patch({
          visible: true,
          props: {
            sliderData,
            parentState: 'Hero',
            scrollDownState: 'VodContentContainer',
            bgY: -150,
          },
        });
      } else {
        this.patch({
          HeroSection: undefined,
        });
      }

      this._VodContentContainer.props = { ...content, parentState: 'VodContentContainer' };
      this._Column.props = { items, parentState: 'VodContainer' };

      this._setState('Hero');
    }
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  calculateContentOffset(contentType) {
    switch (contentType) {
      case CONTENT_TYPE.EVENTS:
        return 580;
      case CONTENT_TYPE.CATEGORIES:
        return 200;
      case CONTENT_TYPE.EMPTY:
      default:
        return 80;
    }
  }

  $setStateOnScroll(nextState) {
    this._setState(nextState);
  }

  _handleBack() {
    Router.setHistory([{ hash: ROUTES.HOME, state: null }]);
    Router.back();
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

          this.patch({
            HeroSection: {
              y: 150,
            },
            VodContentContainer: {
              y: 820,
            },
            VodContainer: {
              y: 1080,
              Column: {
                y: 50,
              },
            },
          });
        }

        _handleUp() {
          if (!Router.isNavigating()) {
            Router.focusWidget(ROUTES.MENU_WIDGET);
          }
        }

        _handleDown() {
          this._setState('VodContentContainer');
        }

        async $horizontalContainerIndexChange(index) {
          if (this._HeroSection._Bullets.Items.children.length - 1 === index) {
            const newRails = await this._props.fetchMoreHeroStripes();
            if (newRails && newRails?.items?.length > 0) {
              const parsedItems = railItemConstructor(newRails.items, RAIL_TYPES.HERO, {});
              this._HeroSection._Bullets._appendItems(parsedItems);
            }
          }
        }
      },
      class VodContentContainer extends this {
        _active() {
          this._VodContainer.patch({
            y: this.calculateContentOffset(this._VodContentContainer.contentType),
            h: 1920,
          });
        }

        $enter() {
          this.fireAncestors('$setNavbarVisibility', true);

          if (this._Column.Items.children.length > 0) {
            this._Column.Items.children[this._Column._focusedIndex]._unfocus();
          }
          if (this._VodContentContainer.contentType === CONTENT_TYPE.EMPTY) {
            this._setState('VodContainer');
          }

          this.patch({
            HeroSection: {
              y: -980,
            },
            VodContentContainer: {
              y: 0,
            },
            VodContainer: {
              y: this.calculateContentOffset(this._VodContentContainer.contentType),
              h: 1920,
              Column: {
                y: 50,
              },
            },
          });
        }

        _enable() {
          this.fireAncestors('$setNavbarVisibility', true);
        }

        _handleUp() {
          this._setState('Hero');
        }

        _handleDown() {
          if (this._Column.Items.children.length > 0) {
            this._setState('VodContainer');
          }
        }

        _getFocused() {
          return this._VodContentContainer;
        }
      },
      class VodContainer extends this {
        $enter() {
          this.correctContainerSize();

          this._HeroSection.patch({
            props: {
              bgY: 0,
            },
          });
        }

        $exit() {
          this._HeroSection.patch({
            props: {
              bgY: -150,
            },
          });
        }

        correctContainerSize() {
          if (this._Column._focusedIndex === 0) {
            this.patch({
              VodContentContainer: {
                y: 0,
              },
              VodContainer: {
                y: this.calculateContentOffset(this._VodContentContainer.contentType),
                h: 1920,
              },
            });

            this.fireAncestors('$setNavbarVisibility', true);
          }
          if (this._Column._focusedIndex >= 1) {
            this.patch({
              VodContentContainer: {
                y: -700,
              },
              VodContainer: {
                y: 0,
                h: 1080,
              },
            });

            this.fireAncestors('$setNavbarVisibility', false);
          }
        }

        _enable() {
          this.correctContainerSize();
        }

        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          if (
            this._VodContentContainer.contentType === CONTENT_TYPE.EMPTY &&
            !Router.isNavigating()
          ) {
            Router.focusWidget(ROUTES.MENU_WIDGET);
          } else {
            this._setState('VodContentContainer');
          }
        }

        async $verticalContainerIndexChange(index) {
          const { fetchMoreStripes } = this._props;

          this.correctContainerSize();
          if (fetchMoreStripes) {
            const newStripes = await fetchMoreStripes(index);
            if (newStripes) {
              const rails = constructRails(newStripes).reduce((acc, rail) => {
                acc.push(...rail);
                return acc;
              }, []);
              rails && this._Column._appendItems(rails);
            }
          }
        }
      },
    ];
  }
}
