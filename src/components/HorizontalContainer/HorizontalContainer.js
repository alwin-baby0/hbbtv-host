import Lightning from '@lightningjs/sdk/src/Lightning';
import { clamp } from '../../utils/index';
import { CARD_TYPES, RAIL_TYPES } from '../../constants/globalConstants';

export default class HorizontalContainer extends Lightning.Component {
  _props = {
    items: [],
    paddingLeft: 0,
    disableScroll: false,
    parentState: null,
    wrap: false,
  };
  _focusedIndex = -1;
  _scrollPosition = 0;

  static _template() {
    return {
      flex: { direction: 'column' },
      Title: {},
      Items: {
        y: 0,
        flex: {
          direction: 'row',
        },
      },
    };
  }

  get Items() {
    return this.tag('Items');
  }

  get Title() {
    return this.tag('Title');
  }

  get _focusedIndex() {
    return this._focusedIndex;
  }

  set _focusedIndex(val) {
    this._focusedIndex = val;
  }

  $horizontalPosterIndexChange(val) {
    this.Items.children[this._focusedIndex]?._unfocus();
    this._setFocusedIndex(val);
  }

  _appendItems(items) {
    items?.forEach((item) => {
      this._props.items.push(item);
      this.Items.childList.a(item);
    });
    this.stage.update();
  }

  _setFocusedIndex(newIndex) {
    this._focusedIndex = clamp(newIndex, 0, this._props.items.length - 1);
    this._reCalibrateScroll();
    this.fireAncestors('$horizontalContainerIndexChange', this._focusedIndex, this._scrollPosition);
  }

  set props(props) {
    const { items, railTitle, ...rest } = props;
    this._props = { ...this._props, ...rest };

    const { cardType, targetIndex, wrap } = rest;

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
        Items: {
          y: 0,
        },
      });
    } else {
      this.patch({ ...rest, h: rest.h + 50, Items: { h: rest.h } });
    }

    this.patch({
      flex: { wrap: wrap },
      w: this._props.w,
    });

    if (items !== this._props.items) {
      this._props.items = items;

      this.Items.x = 0;

      this.Items.childList.clear();
      if (items?.length > 0) {
        this.Items.childList.a(items);
      }

      if (targetIndex) {
        this._setFocusedIndex(targetIndex);
      } else {
        this._focusedIndex = items?.length > 0 ? 0 : -1;
      }

      if (cardType === CARD_TYPES.EPG_CARD_ITEM) {
        this.Items.children[0].patch({
          flex: {
            paddingLeft: this._props.paddingLeft,
          },
        });

        this._scrollPosition = this._props.paddingLeft + this.w || 0;
      }
    }
    this.stage.update();
  }

  _setScrollPosition(x) {
    this._scrollPosition = x;
    this.Items.smooth = { x: this._scrollPosition };
  }

  _reCalibrateScroll() {
    if (!this._props.disableScroll) {
      this.stage.update();

      const currentFocus = this.Items.children[this._focusedIndex];

      if (!currentFocus) return;

      let isChildLive = false;
      if (
        this.Items.children[this._focusedIndex]._props.extensions &&
        this.Items.children[this._focusedIndex]._props.extensions.end_time
      ) {
        const currentTime = new Date();
        const startTime = new Date(
          this.Items.children[this._focusedIndex]._props.extensions.start_time
        );
        const endTime = new Date(
          this.Items.children[this._focusedIndex]._props.extensions.end_time
        );
        isChildLive = startTime < currentTime && currentTime < endTime;
      }

      const railWidth = this._props.railWidth ? this._props.railWidth : this.finalW;
      const elementX = currentFocus.finalX;
      const elementW = currentFocus.finalW;

      if (isChildLive && elementW > railWidth) {
        return;
      } else if (elementX < -this._scrollPosition) {
        // paddingOffset is used to offset first item in each
        // column from the start of the container in EPG-s
        const paddingOffset = currentFocus.flex?._paddingLeft
          ? currentFocus.flex?._paddingLeft
          : this._focusedIndex !== 0
          ? -50
          : -10;
        this._scrollPosition = -elementX - paddingOffset;
      } else if (elementX + elementW > railWidth - this._scrollPosition) {
        this._scrollPosition = -(elementX + elementW - railWidth + 20);
      }

      this.Items.smooth = { x: this._scrollPosition };
    }
  }

  _getFocused() {
    this.patch({
      collision: true,
    });
    return this.Items?.children?.[this._focusedIndex];
  }

  setCollision(collision) {
    if (this._props.railType === RAIL_TYPES.EPGS) return;

    this.patch({
      collision,
    });
  }

  _handleDown() {
    return false;
  }

  _handleUp() {
    return false;
  }

  _handleRight() {
    const { items } = this._props;
    if (this._focusedIndex < items.length - 1) {
      this.Items.children[this._focusedIndex]._unfocus();
      this._focusedIndex += 1;
      this.Items.children[this._focusedIndex]?._focus();
      this._reCalibrateScroll();
      this.fireAncestors(
        '$horizontalContainerIndexChange',
        this._focusedIndex,
        this._scrollPosition
      );
    } else {
      return false;
    }
    return true;
  }

  _handleLeft() {
    if (this._focusedIndex > 0) {
      this.Items.children[this._focusedIndex]?._unfocus();
      this._focusedIndex -= 1;
      this.Items.children[this._focusedIndex]?._focus();
      this._reCalibrateScroll();
      this.fireAncestors(
        '$horizontalContainerIndexChange',
        this._focusedIndex,
        this._scrollPosition
      );
    } else {
      return false;
    }
    return true;
  }

  $handleItemHover(index) {
    if (this._focusedIndex !== index) {
      this.Items.children[this._focusedIndex]?._unfocus();
      this._focusedIndex = index;
    }
    this._reCalibrateScroll();
    this.parent.parent.type &&
    (this.parent.parent.type.name === 'VerticalContainer' ||
      this.parent.parent.type.name === 'EPGContainer')
      ? this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this))
      : this.fireAncestors(
          '$handleStateHover',
          this.parent.children.indexOf(this),
          this._props.parentState
        );
  }

  _focus() {
    const { items } = this._props;
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      this.Items.children[this._focusedIndex]?._focus();
    }
    this._reCalibrateScroll();
  }

  _unfocus() {
    const { items } = this._props;
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      this.Items.children[this._focusedIndex]?._unfocus();
    }
  }
}
