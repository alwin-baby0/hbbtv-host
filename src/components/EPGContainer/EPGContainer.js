import VerticalContainer from '../verticalContainer/VerticalContainer';
import { EPGService } from '../../Services';
import { getClosestElementIndexEPG } from '../../utils/focus';

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
      this.Items.children[i]._setScrollPosition(initialOffset)
    }

    if (!start) this.fireAncestors('$slideTimeSlot', initialOffset);
  }

  $horizontalContainerIndexChange(focusedIndex, x) {
    this.Items.children.forEach((child) => child._setScrollPosition(x));
    this.fireAncestors('$horizontalContainerIndexChange', focusedIndex, x);
    this.fireAncestors('$slideTimeSlot', x);
  }

  _handleCarryFocus(oldIndex, newIndex) {
    super._handleCarryFocus(oldIndex, newIndex, getClosestElementIndexEPG);
  }
}
