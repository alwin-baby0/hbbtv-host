import { Colors, Lightning } from '@lightningjs/sdk';
import { Column } from '@lightningjs/ui-components';
import colors from '../../../reskin/colors.json';

export default class MemberTabButton extends Lightning.Component {
  static _template() {
    return {
      Column: {
        collision: true,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        w: 240,
        h: 65,
        type: Column,
        color: Colors(colors.white).get(),
        rect: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 6 },
        Text: {
          w: 230,
          h: 25,
          text: {
            textAlign: 'center',
            fontFace: 'Montserrat-Medium',
            fontSize: 20,
            lineHeight: 25,
            letterSpacing: 1.2,
            wordWrapWidth: 200,
            wordWrap: false,
            textOverflow: 'ellipsis',
          },
        },
      },
    };
  }

  get _ColumnWrapper() {
    return this.tag('Column');
  }

  get _Column() {
    return this.tag('Column.Text');
  }

  set tabInfoData(val) {
    return (this._tabInfoData = val);
  }

  set tabIndex(val) {
    return (this._tabIndex = val);
  }

  _enable() {
    this._Column.patch({
      text: { text: this._tabInfoData.title },
      color: Colors(colors.white).get(),
    });
    this.tag('Column').patch({
      color: Colors(colors.background).get(),
    });
  }

  _active() {
    this.fireAncestors('$setFocus', 0);
  }

  _handleEnter() {
    this.fireAncestors('$setFocus', this._tabIndex);

    this.fireAncestors('$changeContent', this._tabIndex);
  }

  _selectButton() {
    this._selected = true;
    this.tag('Column').patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unselectButton() {
    this._selected = false;
    this.tag('Column').patch({
      color: Colors(colors.background).get(),
    });
  }

  _focus() {
    this.tag('Column').patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    if (this._selected) {
      this.tag('Column').patch({
        color: Colors(colors.focusedHelpButton).get(),
      });
    } else {
      this.tag('Column').patch({
        color: Colors(colors.unfocusedHelpButton).get(),
      });
    }
  }

  _handleHover() {
    this.tag('Column').patch({
      color: Colors(colors.focus).get(),
    });

    this.fireAncestors('$setStateOnHover', 'DefaultState');
    this.fireAncestors('$memberButtonIndexChange', this._tabIndex);
  }

  _handleUnhover() {
    if (this._selected) {
      this.tag('Column').patch({
        color: Colors(colors.focusedHelpButton).get(),
      });
    } else {
      this.tag('Column').patch({
        color: Colors(colors.unfocusedHelpButton).get(),
      });
    }
  }

  _handleClick() {
    this.fireAncestors('$setFocus', this._tabIndex);

    this.fireAncestors('$changeContent', this._tabIndex);
  }
}
