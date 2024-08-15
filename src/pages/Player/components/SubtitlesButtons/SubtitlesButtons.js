import { Colors, Lightning, Router } from '@lightningjs/sdk';
import lng from '@lightningjs/core';

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
    const { items, ...rest } = props;
    this._props = { ...this._props, ...rest };
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
    this.tag('Column').patch({
      texture: null,
    });
  }

  _enable() {
    const { languageInfo } = this._props;
    this.tag('Column').patch({
      texture: null,
    });

    this.tag('Column.Text').patch({
      text: languageInfo.name,
    });
  }

  _firstActive() {
    this.fireAncestors('$setInitial');
  }

  _handleBack() {
    this.fireAncestors('$setFocusOnItem', false);
  }

  _handleEnter() {
    if (this._selected) {
      return;
    } else {
      const { index } = this._props;
      this.fireAncestors('$updateSubtitle', index - 1);
      this.fireAncestors('$setFocus', index);
    }
  }

  _focus() {
    this.tag('Column').patch({
      texture: lng.Tools.getRoundRect(505, 60, 0, 2, Colors('#C40000').get(), false),
    });
  }

  _unfocus() {
    if (this._selected) {
      this.tag('Column').patch({
        texture: Lightning.Tools.getRoundRect(505, 60, 0, 2, Colors('#ffffff').get(), false),
      });
    } else {
      this.tag('Column').patch({
        texture: null,
      });
    }
  }

  // New method to get the index based on channelId
  _getIndexForChannelId(channelId) {
    let selectedSubtitles = JSON.parse(localStorage.getItem('selectedSubtitlesForChannel')) || [];
    const selectedSubtitle = selectedSubtitles.find((item) => item.channelId === channelId);
    return selectedSubtitle ? selectedSubtitle.index : null;
  }
}
