import Lightning from '@lightningjs/sdk/src/Lightning';
import { getClosestElementIndex } from '../../utils/focus';
import { CARD_SIZES, CARD_TYPES, ROUTES } from '../../constants/globalConstants';
import { didomiVisible } from '../../App';
import { Router } from '@lightningjs/sdk';

export default class VerticalContainer extends Lightning.Component {
  _props = {
    items: [],
    carryRowPosition: true,
    enableScroll: true,
  };
  _focusedIndex = -1;
  _scrollPosition = 0;

  static _template() {
    return {
      Items: {
        w: (w) => w,
        zIndex: 2,
        flex: {
          direction: 'column',
        },
        visible: true,
      },
    };
  }

  get Items() {
    return this.tag('Items');
  }

  get _focusedIndex() {
    return this._focusedIndex;
  }

  set _focusedIndex(val) {
    this._focusedIndex = val;
  }

  /**
   * @param {{ items: any[]; carryRowPosition: boolean; }} props
   */
  set props(props) {
    let { items, railTitle, seasonIndex, episodeIndex, ...rest } = props;
    this._props = { ...this._props, ...rest };

    if (railTitle && railTitle !== '') {
      const { h } = rest;
      this.patch({
        h: h + 95,
        Title: {
          x: 9,
          y: 10,
          h: 55,
          text: {
            text: railTitle,
            fontFace: 'Montserrat-Bold',
            fontSize: 32,
            lineHeight: 39,
          },
        },
      });
    } else {
      this.patch({
        Title: undefined,
        ...(this._props.h && { h: this._props.h }),
      });
    }

    if (items !== this._props.items) {
      items &&
        items[0]?.type?.name === 'HorizontalContainer' &&
        (items = items.map((item) => {
          return {
            ...item,
            props: {
              ...item.props,
              parentState: this._props.parentState,
            },
          };
        }));
      this._props = { ...this._props, items };

      this._focusedIndex = -1;
      this.Items.y = 0;
      this.Items.visible = true;

      this.Items.childList.clear();
      if (items?.length > 0) {
        this.Items.childList.a(items);

        this.stage.update();
      }

      this._focusedIndex = items && items.length > 0 ? 0 : -1;
      this._scrollPosition = 0;
    }

    if ((!items || !items.length) && this.ref !== 'EPGData') {
      this.patch({
        h: 95,
        Items: { h: 0, visible: false },
      });
    }

    if (seasonIndex) {
      this._focusedIndex = 0;
      if (episodeIndex && episodeIndex !== -1)
        this.Items.children[this._focusedIndex]._focusedIndex = episodeIndex;
    }

    if (props.hasSelectedLanguage && props.customLanguageIndex !== undefined) {
      this._focusedIndex = props.customLanguageIndex
    }
  }

  _getFocused() {
    this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
    return this.Items?.children?.[this._focusedIndex];
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  handleDownEPG = this.throttle(() => {
    const { items } = this._props;

    if (this._focusedIndex < items.length - 1) {
      this._handleCarryFocus(this._focusedIndex, this._focusedIndex + 1);
      this._reCalibrateScroll(this._focusedIndex, this._focusedIndex + 1);
      this._focusedIndex += 1;
      this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
    } else {
      return false;
    }
    return true;
  }, 250);

  _handleScroll(event) {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    if (this.hasFocus()) {
      if (event.deltaY > 0) {
        const { items } = this._props;
        if (items && items[0].channelId) {
          return this.handleDownEPG();
        } else {
          return this.handleDown();
        }
      } else if (event.deltaY < 0) {
        if (this._focusedIndex === 0) {
          this.fireAncestors('$setStateOnScroll', 'Hero');
        } else {
          return this.handleUp();
        }
      }
    }
  }

  _handleBack() {
    const heroRoutes = [ROUTES.HOME, `${ROUTES.VOD}/:vodType`]
    if (heroRoutes.includes(Router.getActiveRoute())) {
      this._focusedIndex = 0;
      this._scrollPosition = 0;
      this.Items.y = this._scrollPosition
      this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
    }

    return false
  }

  _handleDown() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    const { items } = this._props;
    if (items && items[0].channelId) {
      return this.handleDownEPG();
    } else {
      return this.handleDown();
    }
  }

  handleDown() {
    if (this._focusedIndex < this.Items.children.length - 1) {
      if (this.Items.children[this._focusedIndex + 1]._props?.cardType === CARD_TYPES.BANNER) {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex + 2);
        this._reCalibrateScroll(
          this._focusedIndex,
          this._focusedIndex + 2,
          CARD_SIZES.BANNER.height
        );
        this._focusedIndex += 2;
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
      } else {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex + 1);
        this._reCalibrateScroll(this._focusedIndex, this._focusedIndex + 1);
        this._focusedIndex += 1;
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex, this.ref);
      }
    } else {
      return false;
    }
    return true;
  }

  handleUpEPG = this.throttle(() => {
    const { items } = this._props;

    if (this._focusedIndex > 0) {
      this._handleCarryFocus(this._focusedIndex, this._focusedIndex - 1);
      this._reCalibrateScroll(this._focusedIndex, this._focusedIndex - 1);
      this._focusedIndex -= 1;
      this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
    } else {
      return false;
    }
    return true;
  }, 250);

  handleUp() {
    if (this._focusedIndex > 0) {
      if (this.Items.children[this._focusedIndex - 1]._props?.cardType === CARD_TYPES.BANNER) {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex - 2);
        this._reCalibrateScroll(
          this._focusedIndex,
          this._focusedIndex - 2,
          CARD_SIZES.BANNER.height
        );
        this._focusedIndex -= 2;
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
      } else {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex - 1);
        this._reCalibrateScroll(this._focusedIndex, this._focusedIndex - 1);
        this._focusedIndex -= 1;
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
      }
    } else {
      return false;
    }
    return true;
  }

  _handleUp() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    const { items } = this._props;
    if (items && items[0].channelId) {
      if (this._focusedIndex > 0) return this.handleUpEPG();
      else {
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
        return false;
      }
    } else {
      return this.handleUp();
    }
  }

  _appendItems(items) {
    items?.forEach((item) => {
      this._props.items.push(item);
      this.Items.childList.a(item);
    });

    this.stage.update();
  }

  _removeLastItems(count) {
    const { items } = this._props;

    if (items.length >= count) {
      // Remove last `count` items from _props.items
      this._props.items.splice(-count, count);

      // Remove last `count` items from the visual container
      for (let i = 0; i < count; i++) {
        this.Items.childList.removeAt(this.Items.children.length - 1);
      }

      this.stage.update();
    }
  }

  _clear() {
    this._props.items = [];
    this.Items.childList.clear();
    this._focusedIndex = 0;
    this._scrollPosition = 0;
    this.Items.y = 0;
    this.stage.update();
  }

  _reCalibrateScroll(oldIndex, newIndex) {
    const { enableScroll } = this._props;
    if (!enableScroll) return;

    this.stage.update();

    const currentFocus = this.Items.children[newIndex];

    if (!currentFocus) {
      return;
    }

    const containerHeight = this.finalH;
    const elementY = currentFocus.finalY;
    const elementH = currentFocus.finalH;

    if (elementY < -this._scrollPosition) {
      // paddingOffset is used to offset first item in each
      // column from the start of the container in EPG-s
      const paddingOffset = newIndex !== 0 ? -50 : 0;
      this._scrollPosition = -elementY - paddingOffset;
    } else if (elementY + elementH > containerHeight - this._scrollPosition) {
      const offset =
        this._props.page === ROUTES.HOME ? 120 : this._props.page === ROUTES.LIVE ? 170 : 20;
      this._scrollPosition = -(elementY + elementH - containerHeight + offset);
    }
    this.Items.smooth = { y: this._scrollPosition };

    this.Items.children[oldIndex]?._unfocus();
    this.Items.children[newIndex]?._focus();
  }

  $handleItemHover(index) {
    const oldIndex = this._focusedIndex;
    const newIndex = index;

    if (this.parent.parent.type && this.parent.parent.type.name === 'HorizontalContainer') {
      this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
    }

    if (this._focusedIndex !== index) {
      this.Items.children[this._focusedIndex]?._unfocus();
      this._focusedIndex = index;
    }
    if (index === 0) {
      this._scrollPosition = 0;
      this.Items.patch({ y: 0 });
    }
    this.fireAncestors('$verticalContainerIndexChange', index);
    this._reCalibrateScroll(oldIndex, newIndex);
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );
  }

  /**
   * carry the focus to next container
   * @param {number} oldIndex
   * @param {number} newIndex
   */
  _handleCarryFocus(oldIndex, newIndex, closestElementFunction = getClosestElementIndex) {
    if (this._props.carryRowPosition && this.Items.children.length > 1) {
      const nextContainer = this.Items.children[newIndex];
      if (nextContainer.Items) {
        const previousContainer = this.Items.children[oldIndex];
        const previouslyFocusedItem =
          previousContainer.Items.children[previousContainer._focusedIndex];

        nextContainer._setFocusedIndex(
          closestElementFunction(nextContainer, previouslyFocusedItem)
        );
      }
    }
  }

  _unfocus() {
    if (this._focusedIndex >= 0 && this._focusedIndex < this.Items.children.length) {
      this.Items.children[this._focusedIndex]?._unfocus();
    }
  }
}
