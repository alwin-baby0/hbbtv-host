import Lightning from '@lightningjs/sdk/src/Lightning';

export default class HorizontalContainer extends Lightning.Component {
  _props = {
    items: [],
  };
  _focusedIndex = -1;
  _scrollPosition = 0;

  static _template() {
    return {
      Items: {
        flex: {
          direction: 'row',
        },
      },
    };
  }

  get Items() {
    return this.tag('Items');
  }

  get _focusedIndex() {
    return this._focusedIndex;
  }

  set _focusedIndex(newIndex) {
    if (newIndex >= 0 && newIndex < this._props.items.length) {
      this._focusedIndex = newIndex;
      this._reCalibrateScroll();
    }
  }

  /**
   * @param {{ items: any[]; }} props
   */
  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };

    if (items !== this._props.items) {
      this._props.items = items;

      this._focusedIndex = -1;
      this._scrollPosition = 0;
      this.Items.x = 0;

      // this.Items.childList.clear();
      if (items.length > 0) {
        // console.log('Adding items to HorizontalContainer:', items); // Log items
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
    // console.log('handle down');
    return false;
  }

  _handleUp() {
    // console.log('handle up');
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
