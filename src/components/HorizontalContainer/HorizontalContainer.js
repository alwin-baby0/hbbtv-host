import Lightning from '@lightningjs/sdk/src/Lightning';
import { clamp } from '../../utils/index';
import { CARD_SIZES, CARD_TYPES, RAIL_TYPES } from '../../constants/globalConstants';

// EPG grid scale (500px per hour), where the now line is placed, and the margin within which it
// counts as visible. Same values as in EPGContainer.
const EPG_PX_PER_MINUTE = 8.33;
const EPG_NOW_X = 750;
const EPG_NOW_MARGIN = 50;

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

    if (items[0].type.name === 'HeroRailItem') {
      this._props.w = (CARD_SIZES.HERO?.width + 20) * this._props.items.length;

      this.patch({
        w: this._props.w,
      });
      this._props.railWidth = 1760;
    }

    if (this._props.page && this._props.seasonId) {
      this._props.w = (CARD_SIZES.LANDSCAPE?.width + 20) * this._props.items.length;

      this.patch({
        w: this._props.w,
      });
      this._props.railWidth = 1760;
    }

    setTimeout(() => this.stage.update(), 200);
  }

  _setFocusedIndex(newIndex) {
    this._focusedIndex = clamp(newIndex, 0, this._props.items.length - 1);
    this._reCalibrateScroll();
    this.fireAncestors(
      '$horizontalContainerIndexChange',
      this._focusedIndex,
      this._scrollPosition,
      this._props.page && this._props.page + 1,
      this._props.seasonId && this._props.seasonId,
      this._props.seriesId && this._props.seriesId
    );
    this._focusedIndex === this.Items.children.length - 1 && this._props.page++;
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
      this.patch({
        ...rest,
        h: this._props.cardType !== CARD_TYPES.EPG_CARD_ITEM ? rest.h + 50 : rest.h,
        Items: { h: rest.h },
      });
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

      // Live EPG program wider than the rail: the normal logic below would align its start or end
      // with the rail edge, pushing the now line off screen. Keep the scroll while "now" is visible,
      // otherwise put "now" where EPGContainer.setInitialOffset puts it.
      // (A live card that fits uses the normal logic: showing the whole card shows "now" too.)
      // Both outcomes are stable, so repeated calls (e.g. Lightning's own _focus) change nothing.
      if (this._props.cardType === CARD_TYPES.EPG_CARD_ITEM && elementW > railWidth) {
        const { startTime, endTime } = currentFocus._props || {};
        const now = Date.now();
        if (startTime <= now && now <= endTime) {
          // The first item in a row is shifted by a (negative) flex paddingLeft
          const cardLeft = elementX + (currentFocus.flex?._paddingLeft || 0) + this._scrollPosition;
          const nowOnScreen = cardLeft + ((now - startTime) / 60000) * EPG_PX_PER_MINUTE;
          if (nowOnScreen < EPG_NOW_MARGIN || nowOnScreen > railWidth - EPG_NOW_MARGIN) {
            this._scrollPosition += EPG_NOW_X - nowOnScreen;
            this.Items.smooth = { x: this._scrollPosition };
          }
          return;
        }
      }

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

      // this.Items.setSmooth('x', this._scrollPosition, {
      //   // delay: 0.025,
      //   duration: 0.3,
      //   timingFunction: 'cubic-bezier(0.25, 0.25, 0.25, 0.25)',
      // })
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
    if (window.Didomi && window.didomiVisible) {
      return true;
    }

    const { items } = this._props;
    if (this._focusedIndex < items.length - 1) {
      this.Items.children[this._focusedIndex]._unfocus();
      this._focusedIndex += 1;
      this.Items.children[this._focusedIndex]?._focus();
      this._reCalibrateScroll();
      this.fireAncestors(
        '$horizontalContainerIndexChange',
        this._focusedIndex,
        this._scrollPosition,
        this._props.page && this._props.page + 1,
        this._props.seasonId && this._props.seasonId
      );
      this._focusedIndex === this.Items.children.length - 1 && this._props.page++;
    } else {
      return false;
    }
    return true;
  }

  _handleLeft() {
    if (window.Didomi && window.didomiVisible) {
      return true;
    }

    if (this._focusedIndex > 0) {
      this.Items.children[this._focusedIndex]?._unfocus();
      this._focusedIndex -= 1;
      this.Items.children[this._focusedIndex]?._focus();
      this._reCalibrateScroll();
      this.fireAncestors(
        '$horizontalContainerIndexChange',
        this._focusedIndex,
        this._scrollPosition,
        this._props.page && this._props.page + 1,
        this._props.seasonId && this._props.seasonId
      );
      this._focusedIndex === this.Items.children.length - 1 && this._props.page++;
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
