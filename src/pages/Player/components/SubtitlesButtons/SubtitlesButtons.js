import { Colors, Lightning } from '@lightningjs/sdk';
import { LOCAL_STORAGE_KEYS } from '../../../../constants/globalConstants';

export default class SubtitlesButtons extends Lightning.Component {
  _props = {
    languageInfo: {},
  };

  constructor(props) {
    super(props);
    this._selected = false;
  }

  static _template() {
    return {
      Column: {
        collision: true,
        flex: { direction: 'row', alignItems: 'center' },
        w: 505,
        h: 60,
        x: 50,
        y: 190,
        rect: true,
        Text: {
          x: 30,
          h: 30,
          text: {
            fontSize: 24,
            fontFace: 'Montserrat-Medium',
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  get _Column() {
    return this.tag('Column');
  }

  _selectButton() {
    this._selected = true;
    this._Column.patch({
      color: Colors('#ffffff').get(),
    });
  }

  _unselectButton() {
    this._selected = false;
    this._Column.patch({
      texture: null,
    });
  }

  _enable() {
    const { languageInfo } = this._props;
    this._Column.patch({
      texture: null,
      Text: {
        text: languageInfo.name,
      },
    });
  }

  _firstActive() {
    this.fireAncestors('$setInitial');
  }

  _handleEnter() {
    const { index } = this._props;
    this.fireAncestors('$updateSubtitle', index);
    if (this._selected) {
      return;
    } else {
      this.fireAncestors('$setFocus', index);
    }
  }

  _focus() {
    this._Column.patch({
      texture: Lightning.Tools.getRoundRect(505, 60, 0, 2, Colors('#C40000').get(), false),
    });
  }

  _unfocus() {
    if (this._selected) {
      this._Column.patch({
        texture: Lightning.Tools.getRoundRect(505, 60, 0, 2, Colors('#ffffff').get(), false),
      });
    } else {
      this._Column.patch({
        texture: null,
      });
    }
  }

  _handleHover() {
    this._focus();
  }

  _handleUnhover() {
    this._unfocus();
  }

  _handleClick() {
    this._handleEnter();
  }

  // New method to get the index based on channelId
  _getIndexForChannelId(channelId) {
    let selectedSubtitles =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_SUBTITLES_CHANNEL)) || [];
    const selectedSubtitle = selectedSubtitles.find((item) => item.channelId === channelId);
    return selectedSubtitle ? selectedSubtitle.index : null;
  }
}
