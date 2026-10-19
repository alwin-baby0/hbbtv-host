import { EPGService } from '../../Services';
import { getClosestElementIndexEPG } from '../../utils/focus';
import VerticalContainer from '../VerticalContainer/VerticalContainer';

// EPG grid scale (500px per hour), where setInitialOffset puts the now line, and the margin
// within which the now line counts as visible
const EPG_PX_PER_MINUTE = 8.33;
const EPG_NOW_X = 750;
const EPG_NOW_MARGIN = 50;

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

  // Rows share one horizontal scroll, so the now line is at the same x in every row
  _isNowVisible(row) {
    const nowX = ((Date.now() - EPGService.startTime) / (1000 * 60)) * EPG_PX_PER_MINUTE;
    const railWidth = (row._props && row._props.railWidth) || row.finalW;
    const visibleX = nowX + row._scrollPosition;
    return visibleX >= EPG_NOW_MARGIN && visibleX <= railWidth - EPG_NOW_MARGIN;
  }

  // Lands on a row's live program. Only scrolls the grid (all rows) when the now line is off screen;
  // otherwise just moves the row's focus index, without touching other rows.
  focusLiveProgram(row = this.Items.children[this._focusedIndex]) {
    if (!row || !row.Items) return false;
    const liveIndex = this._getLiveIndex(row);
    if (liveIndex < 0) return false;

    if (!this._isNowVisible(row)) this.setInitialOffset();
    row._focusedIndex = liveIndex;
    return true;
  }

  _handleCarryFocus(oldIndex, newIndex) {
    if (this.focusLiveProgram(this.Items.children[newIndex])) return;
    super._handleCarryFocus(oldIndex, newIndex, getClosestElementIndexEPG);
  }
}
