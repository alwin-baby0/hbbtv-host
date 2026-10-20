import { EPGService } from '../../Services';
import { getClosestElementIndexEPG } from '../../utils/focus';
import VerticalContainer from '../VerticalContainer/VerticalContainer';

// EPG grid scale (500px per hour) and where setInitialOffset puts the now line.
// Same values as in HorizontalContainer.
const EPG_PX_PER_MINUTE = 8.33;
const EPG_NOW_X = 750;

export default class EPGContainer extends VerticalContainer {
  static _template() {
    return {
      collision: true,
      ...super._template(),
    };
  }

  setInitialOffset(start = 0, end = this.Items.children.length) {
    const initialOffset =
      ((EPGService.startTime - new Date().getTime()) / (1000 * 60)) * EPG_PX_PER_MINUTE + EPG_NOW_X;

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

  // Live program index of a row. Starts from the index stored when the row was built
  // (props.targetIndex) and steps past programs that have ended since, so it's usually O(1).
  _getLiveIndex(row) {
    const items = row.Items.children;
    let index = row._props && row._props.targetIndex;
    if (typeof index !== 'number' || index < 0) return -1;

    const now = Date.now();
    while (index < items.length && items[index]._props.endTime < now) index++;
    const item = items[index];
    if (!item || item._props.startTime > now) return -1;

    row._props.targetIndex = index;
    return index;
  }

  // Lands on a row's live program (Up/Down, or entering the EPG). The row's scroll correction keeps
  // the live card and the now line in view; all rows are only scrolled when that correction moves.
  focusLiveProgram(row = this.Items.children[this._focusedIndex]) {
    if (!row || !row.Items) return false;
    const liveIndex = this._getLiveIndex(row);
    if (liveIndex < 0) return false;

    row._focusedIndex = liveIndex;
    // Run the row's scroll correction once here and sync all rows if it moved. Its result is stable,
    // so the later _focus() calls on the row (VerticalContainer's and Lightning's) change nothing.
    const scrollBefore = row._scrollPosition;
    row._reCalibrateScroll();
    if (row._scrollPosition !== scrollBefore) {
      this.$horizontalContainerIndexChange(liveIndex, row._scrollPosition);
    }
    return true;
  }

  _handleCarryFocus(oldIndex, newIndex) {
    if (this.focusLiveProgram(this.Items.children[newIndex])) return;
    super._handleCarryFocus(oldIndex, newIndex, getClosestElementIndexEPG);
  }
}
