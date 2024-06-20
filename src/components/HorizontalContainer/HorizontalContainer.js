import Lightning from '@lightningjs/sdk/src/Lightning';
import { clamp } from '../../utils/index';
export default class HorizontalContainer extends Lightning.Component {
  _props = {
    items: [],
  };
  _focusedIndex = -1;
  _scrollPosition = 0;

  static _template() {
    return {
      flex: { direction: 'column', wrap: true },
      Title: {
        h: 55,
        text: {
          fontFamily: 'Inter',
          fontStyle: 'normal bold',
          fontSize: 32,
          lineHeight: 39,
        },
      },
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

  _setFocusedIndex(newIndex) {
    this._focusedIndex = clamp(newIndex, 0, this._props.items.length - 1);
  }

  /**
   * @param {{ items: any[]; }} props
   */
  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
    const { railTitle } = rest;
    if (railTitle == '' || railTitle === undefined) {
      this.Items.patch({
        y: 0,
      });
      this.patch({
        Title: undefined,
      });
    } else {
      this.patch({
        h: this.h + 50,
      });
      this.Items.patch({
        // y: 80,
      });
      this.Title.patch({
        y: 10,
        text: {
          text: railTitle,
        },
      });
    }

    if (items !== this._props.items) {
      this._props.items = items;

      this._focusedIndex = -1;
      this._scrollPosition = 0;
      this.Items.x = 0;

      this.Items.childList.clear();
      if (items.length > 0) {
        this.Items.childList.a(items);
        this.stage.update();
      }

      this._focusedIndex = items.length > 0 ? 0 : -1;
      this._scrollPosition = 0;
    }
  }

  _reCalibrateScroll() {
    this.stage.update();

    const currentFocus = this.Items.children[this._focusedIndex];

    if (!currentFocus) return;

    const containerFinalWidth = this.finalW;
    const elementX = currentFocus.finalX;
    const elementW = currentFocus.finalW;

    if (elementX < -this._scrollPosition) {
      this._scrollPosition = -elementX;
    } else if (elementX + elementW > containerFinalWidth - this._scrollPosition) {
      this._scrollPosition = -(elementX + elementW - containerFinalWidth);
    }

    this.Items.patch({ x: this._scrollPosition });
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

  _handleRight() {
    const { items } = this._props;
    if (this._focusedIndex < items.length - 1) {
      this._focusedIndex += 1;
      this._reCalibrateScroll();
      this.fireAncestors('$horizontalContainerIndexChange', this._focusedIndex);
    } else {
      return false;
    }
    return true;
  }

  _handleLeft() {
    if (this._focusedIndex > 0) {
      this._focusedIndex -= 1;
      this._reCalibrateScroll();
      this.fireAncestors('$horizontalContainerIndexChange', this._focusedIndex);
    } else {
      return false;
    }
    return true;
  }
}
