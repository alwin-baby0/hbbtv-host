import Lightning from '@lightningjs/sdk/src/Lightning';
import { getClosestElementIndex } from '../../utils/focus';

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
        flex: {
          direction: 'column',
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

  set _focusedIndex(val) {
    return (this._focusedIndex = val);
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
      this.Items.y = 0;

      this.Items.childList.clear();
      if (items?.length > 0) {
        this.Items.childList.a(items);

        this.stage.update();
      }

      this._focusedIndex = items && items.length > 0 ? 0 : -1;
      this._scrollPosition = 0;
    }
  }

  _reCalibrateScroll() {
    const { enableScroll } = this._props;
    if (!enableScroll) return;
    this.stage.update();

    const currentFocus = this.Items.children[this._focusedIndex];

    if (!currentFocus) return;

    if (this._focusedIndex === 0) {
      this.Items.patch({ y: 0 });
    } else {
      this.Items.patch({
        y: -this._focusedIndex * currentFocus.finalH + this.finalH / 2 - currentFocus.finalH / 2,
      });
    }
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

  _appendItems(items) {
    items?.forEach((item) => {
      this._props.items.push(item);
      this.Items.childList.a(item);
    });

    this.stage.update();
  }

  $horizontalContainerIndexChange(newIndex) {
    if (this._props.carryRowPosition && this.Items.children.length > 1) {
      this.Items.children.forEach((child) => {
        const focusedContainer = this.Items.children[this._focusedIndex];
        const focusedItem = focusedContainer.Items.children[focusedContainer._focusedIndex];
        if (focusedItem) {
          child._setFocusedIndex(getClosestElementIndex(child, focusedItem));
        } else {
          child._setFocusedIndex(newIndex);
        }
      });
    }
    this.fireAncestors('$horizontalContainerIndexChange', newIndex);
  }
}
