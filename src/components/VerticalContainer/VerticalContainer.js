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

  _getFocused() {
    return this.Items?.children?.[this._focusedIndex];
  }

  _handleDown() {
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
  }

  _handleUp() {
    if (this._focusedIndex > 0) {
      this._handleCarryFocus(this._focusedIndex, this._focusedIndex - 1);
      this._reCalibrateScroll(this._focusedIndex, this._focusedIndex - 1);
      this._focusedIndex -= 1;
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

  /**
   * move items container to the side if there are more items off the screen
   * @param {number} oldIndex
   * @param {number} newIndex
   */
  _reCalibrateScroll(oldIndex, newIndex) {
    const { enableScroll } = this._props;
    if (!enableScroll) return;

    this.stage.update();

    const currentFocus = this.Items.children[newIndex];
    const prevFocus = this.Items.children[oldIndex];

    if (!currentFocus) return;

    if (newIndex === 0) {
      this._scrollPosition = 0;
      this.Items.patch({ y: 0 });
    } else {
      const multiplier = oldIndex > newIndex ? 1 : -1;
      this._scrollPosition += multiplier * prevFocus.finalH;
      this.Items.patch({ y: this.finalH / 2 - currentFocus.finalH / 2 + this._scrollPosition });
    }
  }

  /**
   * carry the focus to next container
   * @param {number} oldIndex
   * @param {number} newIndex
   */
  _handleCarryFocus(oldIndex, newIndex) {
    if (this._props.carryRowPosition && this.Items.children.length > 1) {
      const previousContainer = this.Items.children[oldIndex];
      const previouslyFocusedItem = previousContainer.Items.children[previousContainer._focusedIndex];
      const nextContainer = this.Items.children[newIndex];
      nextContainer._setFocusedIndex(getClosestElementIndex(nextContainer, previouslyFocusedItem));
    }
  }
}
