// HorizontalContainer.js
import Lightning from '@lightningjs/sdk/src/Lightning';
import { clamp } from '../../utils/index';

export default class HorizontalContainer extends Lightning.Component {
  _props = {
    items: [],
    paddingLeft: 0,
    disableScroll: false,
  };
  _focusedIndex = -1;
  _scrollPosition = 0;

  static _template() {
    return {
      flex: { direction: 'column', wrap: true },
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

    const { cardType, targetIndex } = rest;

    if (railTitle && railTitle !== '') {
      const { h } = rest;
      this.Items.patch({
        y: 0,
      });
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
      this.patch({ ...rest });
      this.Items.patch({ h: rest.h });
    }

    this.patch({
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
      // todo: change to paddingLeft
      if (cardType === 'EPG_CARD_ITEM') {
        this.Items.children[0].patch({
          flex: {
            paddingLeft: this._props.paddingLeft,
          },
        });

        //todo: check
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

      const containerFinalWidth = this.finalW;
      const elementX = currentFocus.finalX;
      const elementW = currentFocus.finalW;

      if (elementX < -this._scrollPosition) {
        // paddingOffset is used to offset first item in each
        // column from the start of the container in EPG-s
        const paddingOffset = currentFocus.flex?._paddingLeft ?? -10;
        this._scrollPosition = -elementX - paddingOffset;
      } else if (elementX + elementW > containerFinalWidth - this._scrollPosition) {
        this._scrollPosition = -(elementX + elementW - containerFinalWidth);
      }

      this.Items.smooth = { x: this._scrollPosition };
    }
  }

  _getFocused() {
    return this.Items?.children?.[this._focusedIndex];
  }

  _handleDown() {
    return false;
  }

  _handleUp() {
    return false;
  }

  _handleHover() {
    let verticalState;

    const parentContainer = this.parent.parent.ref;
    const indexForVC = this.parent.children.indexOf(this);
    const constructorName = this.Items.children[this._focusedIndex]?.constructor.name;

    if (constructorName === 'PosterRailItem' && parentContainer === 'VODSection') {
      //case for search page
      verticalState = 'VODSection';
    }
    if (constructorName === 'PosterRailItem' && parentContainer !== 'VODSection') {
      verticalState = 'VodContainer';
    }
    if (constructorName === 'SportsEventsRailItem') {
      verticalState = 'VodContentContainer';
    }
    if (constructorName === 'LandscapeRailItem') {
      verticalState = 'Items';
    }
    if (constructorName === 'EPGRailItems') {
      verticalState = 'EPGS';
    }

    this.fireAncestors('$horizontalContainerPosterIndexChange', indexForVC, verticalState);
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

  _focus() {
    const { items } = this._props;
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      this.Items.children[this._focusedIndex]?._focus();
    }
  }

  _unfocus() {
    const { items } = this._props;
    if (this._focusedIndex >= 0 && this._focusedIndex < items.length) {
      this.Items.children[this._focusedIndex]?._unfocus();
    }
  }
}
