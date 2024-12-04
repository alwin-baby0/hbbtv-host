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
        w: (w) => w,
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
    this._focusedIndex = val;
  }

  $memberButtonIndexChange(val) {
    this.Items.children[this._focusedIndex]._unfocus();
    this._focusedIndex = val;
  }

  $horizontalContainerPosterIndexChange(val, verticalState) {
    console.log('horski val', val);
    console.log('horski', this.Items.children[this._focusedIndex]);
    //this._focusedIndex = verticalState === 'VodContentContainer' ? 0 : val; //check later  | the idea is that if by default foc ind is -1 to set it to 0 or more
    this._focusedIndex = val;
    console.log('fokusirani indeeex', this._focusedIndex);
    console.log('vertikalni stejt', verticalState);
    //this._focusedIndex = val;
    this.fireAncestors('$verticalContainerIndexChange', val);
    this.fireAncestors('$updateVerticalState', verticalState);
    this._reCalibrateScroll(this._focusedIndex, val); //this fixes the problem when hovering first row from below
    //this._handleCarryFocus(this._focusedIndex, val);
  }

  handleFocusedIndex(val) {
    //dzoni fja
    this._handleCarryFocus(this._focusedIndex, val);
    this._reCalibrateScroll(this._focusedIndex, val);
    this._focusedIndex = val;
    this.fireAncestors('$verticalContainerIndexChange', val);
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
  }, 50);

  _handleClick() {
    console.log('cliick');
  }

  /* _handleHover() {
    console.log('hoverovano');
  } */

  _handleScroll(event) {
    if (this.hasFocus()) {
      if (event.deltaY > 0) {
        const { items } = this._props;
        if (items && items[0].channelId) {
          return this.handleDownEPG();
        } else {
          return this.handleDown();
        }
      } else if (event.deltaY < 0) {
        return this.handleUp();
      }
      console.log('skrolovanje');
    }
  }

  _handleDown() {
    const { items } = this._props;
    if (items && items[0].channelId) {
      return this.handleDownEPG();
    } else {
      return this.handleDown();
    }
  }

  handleDown() {
    if (this._focusedIndex < this.Items.children.length - 1) {
      console.log('log button down vert', this.Items.children[this._focusedIndex]);
      console.log('log button svi child', this.Items.children);
      if (this.Items.children[this._focusedIndex + 1]._props?.cardType === 'BANNER') {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex + 2);
        this._reCalibrateScroll(this._focusedIndex, this._focusedIndex + 2);
        this._focusedIndex += 2;
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
      } else {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex + 1);
        this._reCalibrateScroll(this._focusedIndex, this._focusedIndex + 1);
        this._focusedIndex += 1;
        this.fireAncestors('$verticalContainerIndexChange', this._focusedIndex);
      }
    } else {
      return false;
    }
    return true;
  }

  handleUp() {
    if (this._focusedIndex > 0) {
      if (this.Items.children[this._focusedIndex - 1]._props?.cardType === 'BANNER') {
        this._handleCarryFocus(this._focusedIndex, this._focusedIndex - 2);
        this._reCalibrateScroll(this._focusedIndex, this._focusedIndex - 2);
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
    return this.handleUp();
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
      const multiplier = oldIndex - newIndex;
      this._scrollPosition += multiplier * prevFocus.finalH;
      this.Items.patch({
        y: Math.min(this.finalH / 2 - currentFocus.finalH / 2 + this._scrollPosition, 0),
      });
    }
  }

  /**
   * carry the focus to next container
   * @param {number} oldIndex
   * @param {number} newIndex
   */
  _handleCarryFocus(oldIndex, newIndex) {
    if (this._props.carryRowPosition && this.Items.children.length > 1) {
      const nextContainer = this.Items.children[newIndex];
      if (nextContainer.Items) {
        const previousContainer = this.Items.children[oldIndex];
        const previouslyFocusedItem =
          previousContainer.Items.children[previousContainer._focusedIndex];

        console.log('prevcont', previousContainer);
        console.log('prevcontitem', previouslyFocusedItem);

        nextContainer._setFocusedIndex(
          getClosestElementIndex(nextContainer, previouslyFocusedItem)
        );
      }
    }
  }
}
