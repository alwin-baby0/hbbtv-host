import { EPGService } from '../../Services';
import { getClosestElementIndexEPG } from '../../utils/focus';
import VerticalContainer from '../VerticalContainer/VerticalContainer';

export default class EPGContainer extends VerticalContainer {
  static _template() {
    return {
      collision: true,
      ...super._template(),
    };
  }

  setInitialOffset(start = 0, end = this.Items.children.length) {
    const initialOffset =
      ((EPGService.startTime - new Date().getTime()) / (1000 * 60)) * 8.33 + 750;

    for (let i = start; i < end; i++) {
      this.Items.children[i]._setScrollPosition(initialOffset);
    }

    if (!start) this.fireAncestors('$slideTimeSlot', initialOffset);
  }

  $horizontalContainerIndexChange(focusedIndex, x) {
    this.Items.children.forEach((child) => child._setScrollPosition(x));
    this.fireAncestors('$horizontalContainerIndexChange', focusedIndex, x);
    this.fireAncestors('$slideTimeSlot', x);
  }

  _getLiveIndex(row) {
    const now = Date.now();
    return row.Items.children.findIndex(
      (item) => item._props && now >= item._props.startTime && now <= item._props.endTime
    );
  }

  _handleCarryFocus(oldIndex, newIndex) {
    const nextRow = this.Items.children[newIndex];

    // Whenever a row is reached with Up/Down: scroll the grid back to "now" (now line in the middle)
    // and focus that row's live program
    if (nextRow?.Items) {
      const liveIndex = this._getLiveIndex(nextRow);
      if (liveIndex >= 0) {
        this.setInitialOffset();
        nextRow._setFocusedIndex(liveIndex);
        return;
      }
    }

    super._handleCarryFocus(oldIndex, newIndex, getClosestElementIndexEPG);
  }
}
