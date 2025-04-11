import VerticalContainer from '../VerticalContainer/VerticalContainer';
import { EPGService } from '../../Services';

export default class EPGContainer extends VerticalContainer {
  static _template() {
    return {
      collision: true,
      ...super._template(),
    };
  }

  setInitialOffset() {
    const initialOffset =
      ((EPGService.startTime - new Date().getTime()) / (1000 * 60)) * 8.33 + 750;
    this.Items.children.forEach((child) => child._setScrollPosition(initialOffset));
    this.fireAncestors('$slideTimeSlot', initialOffset);
  }

  $horizontalContainerIndexChange(focusedIndex, x) {
    this.Items.children.forEach((child) => child._setScrollPosition(x));
    this.fireAncestors('$horizontalContainerIndexChange', focusedIndex, x);
    this.fireAncestors('$slideTimeSlot', x);
  }
}
