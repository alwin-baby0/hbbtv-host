import Lightning from "@lightningjs/sdk/src/Lightning";

export default class VerticalContainer extends Lightning.Component {
  _props = {
    items: [],
    carryRowPosition: true,
  }
  _focusedIndex = -1;
  _scrollPosition = 0;

  static _template() {
    return {
      Items: {
        flex: {
          direction: "column",
        }
      }
    }
  }

  get Items() {
    return this.tag('Items');
  }

  get _focusedIndex() {
    return this._focusedIndex;
  }

  /**
   * @param {{ items: any[]; carryRowPosition: boolean; }} props
   */
  set props(props) {
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };

    if (items !== this._props.items) {
      this._props = { ...this._props, items };

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

    this.Items.patch({ y: -this._focusedIndex * currentFocus.finalH })
  }

  _getFocused() {
    return this.Items?.children?.[this._focusedIndex];
  }

  _handleDown() {
    const { items } = this._props;
    if (this._focusedIndex < items.length - 1) {
      this._focusedIndex += 1;
      this._reCalibrateScroll();
      this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
    } else {
      return false;
    }
    return true;
  }

  _handleUp() {
    if (this._focusedIndex > 0) {
      this._focusedIndex -= 1;
      this._reCalibrateScroll();
      this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
    } else {
      return false;
    }
    return true;
  }

  _handleRight() {
    return false;
  }

  _handleLeft() {
    return false;
  }

  $horizontalContainerIndexChange(newIndex) {
    if (this._props.carryRowPosition) {
      this.Items.children.forEach(child => child._focusedIndex = newIndex);
    }
    this.fireAncestors('$horizontalContainerIndexChange', newIndex);
  }
}
