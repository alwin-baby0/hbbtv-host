import { Colors, Lightning, Router, Utils, VideoPlayer } from '@lightningjs/sdk';
import { IMG_PATH, VIDEO_TYPES, ROUTES } from '../../constants/globalConstants';

const TEXT_PADDING = 25;
const LIVE_ICON_RIGHT = 140 + 20; // Icon x + w

let measureCtx = null;
// Full (untruncated) text width; Lightning's finalW is already cut by wordWrapWidth/maxLines
const measureTextWidth = (text, fontSize, fontFace) => {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  measureCtx.font = `${fontSize}px ${fontFace}`;
  return measureCtx.measureText(text || '').width;
};

export default class EPGRailItems extends Lightning.Component {
  _props = {
    isActive: false,
    lastClickedItemId: 0,
  };

  selectEPGTimeout = null;

  static _template() {
    return {
      collision: true,
      flexItem: { marginLeft: 0, marginRight: 0 },
      Wrapper: {
        h: 95,
        TitleText: {
          clipping: true,
          flex: { direction: 'column', justifyContent: 'center' },
          Text: {
            h: 22,
            text: '',
          },
          Time: {
            h: 20,
            text: {
              text: '',
              fontSize: 18,
            },
          },
        },
      },
    };
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _selectButton(id, lastId) {
    this._props.lastClickedItemId = id;

    if (id !== lastId) {
      this.fireAncestors('$updateChannel', this._props);
    }
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    this._props.lastId = props.id;

    const currentTime = new Date();
    const startTime = new Date(props.startTime);
    const endTime = new Date(props.endTime);

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    const durationInMinutes = endTime - startTime;

    const width = (durationInMinutes / 60000) * (500 / 60);

    this._epgWidth = width - 5;
    this._displayWidth = this._epgWidth;
    this._requiredWidth = null;

    this._Wrapper.patch({
      TitleText: {
        Text: {
          flexItem: { marginTop: 20 },
          text: {
            text: this._props.title,
            maxLines: 1,
            fontSize: 20,
            fontFace: 'Montserrat-SemiBold',
          },
        },
        Time: {
          flexItem: { marginTop: 5 },
          text: {
            text: `${formattedStartTime} - ${formattedEndTime}`,
            fontFace: 'Montserrat-Light',
          },
        },
      },
    });
    this._applyWidth(this._epgWidth);

    if (currentTime >= startTime && currentTime <= endTime) {
      this._props.isActive = true;
      this._Wrapper.patch({
        Icon: {
          x: 140,
          y: 49,
          w: 20,
          h: 20,
          texture: Lightning.Tools.getSvgTexture(Utils.asset(IMG_PATH.PLAY_BTN_LIVE), 20, 20),
        },
        texture: Lightning.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#353849').get(),
          true,
          Colors('#353849').get()
        ),
      });
    } else {
      this._props.isActive = false;
      this._Wrapper.patch({
        Icon: undefined,
        texture: Lightning.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#252835').get(),
          true,
          Colors('#252835').get()
        ),
      });
    }
  }

  // Sets the visible card width and the text layout that depends on it.
  // Only the Wrapper changes; the item's own w (its slot in the grid) stays the same.
  _applyWidth(width) {
    const hasPadding = width > 150;
    const wordWrapWidth =
      width === this._epgWidth && width > 200 ? width - 20 : width - TEXT_PADDING * 2;

    this._Wrapper.patch({
      w: width,
      TitleText: {
        w: width,
        Text: {
          flexItem: { marginLeft: hasPadding ? TEXT_PADDING : 0 },
          text: { wordWrapWidth },
        },
        Time: {
          flexItem: { marginLeft: hasPadding ? TEXT_PADDING : 0 },
        },
      },
    });
  }

  // Width needed to show the full title, time and (for live programs) the play icon.
  // Cached per program; reset when props change.
  _getRequiredWidth() {
    if (this._requiredWidth == null) {
      const titleWidth = measureTextWidth(this._props.title, 20, 'Montserrat-SemiBold');
      const timeWidth = measureTextWidth(this.tag('Time').text.text, 18, 'Montserrat-Light');
      const textWidth = Math.ceil(Math.max(titleWidth, timeWidth)) + TEXT_PADDING * 2;
      this._requiredWidth = this._props.isActive
        ? Math.max(textWidth, LIVE_ICON_RIGHT + TEXT_PADDING)
        : textWidth;
    }
    return this._requiredWidth;
  }

  // Grow to the left when the card's right edge is in the right half of the visible rail,
  // as long as the grown card still fits on the left side.
  _applyGrowDirection() {
    const row = this.parent && this.parent.parent;
    if (!row || typeof row._scrollPosition !== 'number') return;

    const railWidth = (row._props && row._props.railWidth) || row.finalW;
    const rightEdge = this.finalX + row._scrollPosition + this._epgWidth;
    const growLeft = rightEdge > railWidth / 2 && rightEdge - this._displayWidth >= 0;

    this._Wrapper.x = growLeft ? this._epgWidth - this._displayWidth : 0;
  }

  _focus() {
    // Too narrow to read the full text: grow the visible card while focused.
    // zIndex keeps it on top of the next programs it overlaps.
    const requiredWidth = this._getRequiredWidth();
    const isTooNarrow = this._epgWidth < requiredWidth;
    this._displayWidth = isTooNarrow ? requiredWidth : this._epgWidth;
    this._applyWidth(this._displayWidth);

    // The row updates its scroll right after focusing the item, so pick the grow direction
    // in a microtask (after that scroll, before the next frame). The token skips stale callbacks.
    const focusToken = (this._focusToken = (this._focusToken || 0) + 1);
    if (isTooNarrow) {
      Promise.resolve().then(() => {
        if (focusToken === this._focusToken) this._applyGrowDirection();
      });
    }

    this._Wrapper.patch({
      zIndex: 200,
      texture: Lightning.Tools.getRoundRect(
        this._displayWidth,
        95,
        8,
        4,
        Colors('#A61619').get(),
        true,
        Colors('#A61619').get()
      ),
    });

    this.selectEPGTimeout = setTimeout(() => {
      this.selectEPG();
    }, 500);
  }

  _unfocus() {
    if (this.selectEPGTimeout) {
      clearTimeout(this.selectEPGTimeout);
      this.selectEPGTimeout = null;
    }

    this._lastClickedItemId = null;
    this._focusToken = (this._focusToken || 0) + 1;
    this._displayWidth = this._epgWidth;
    this._applyWidth(this._epgWidth);
    this._Wrapper.x = 0;
    this._props.isActive !== true
      ? this._Wrapper.patch({
        zIndex: 1,
        texture: Lightning.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#252835').get(),
          true,
          Colors('#252835').get()
        ),
      })
      : this._Wrapper.patch({
        zIndex: 1,
        texture: Lightning.Tools.getRoundRect(
          this._epgWidth,
          95,
          8,
          4,
          Colors('#353849').get(),
          true,
          Colors('#353849').get()
        ),
      });
  }

  selectEPG() {
    const currentItemId = this._props.id; // Assume each item has a unique ID in props

    // Save the current ID as lastId before calling $selectedEPG
    const lastId = this._props.lastId || null; // Retrieve lastId if it exists, otherwise null

    if (this._props.isActive) {
      this.fireAncestors('$selectedEPG', currentItemId, lastId);
    }

    // Update the lastClickedItemId with the current one
    this._props.lastClickedItemId = currentItemId;
    this._props.lastId = currentItemId; // Save the current ID as the last ID
  }

  _handleEnter() {
    if (window.Didomi && window.didomiVisible) {
      return true;
    }
    if (!this._props.src) return true
    if (this.selectEPGTimeout) {
      clearTimeout(this.selectEPGTimeout);
      this.selectEPGTimeout = null;
    }

    VideoPlayer.close();

    const hash = Router.getActiveHash()
    setTimeout(() => {
      this.fireAncestors('$unpunchHole');
      if (hash === Router.getActiveHash()) {
        Router.navigate(ROUTES.PLAYER, {
          videoUrl: this._props.src,
          duration: 0,
          videoType: VIDEO_TYPES.STREAM_NOW,
          shouldSaveProgress: false,
        });
      }
    }, 500);
  }

  _handleHover() {
    const { index } = this._props;

    this.fireAncestors('$handleItemHover', index);
    this._focus();
  }

  _handleClick() {
    this._handleEnter();
  }
}
