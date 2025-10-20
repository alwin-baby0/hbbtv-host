import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class PageItem extends Lightning.Component {
  static _template() {
    return {
      Column: {
        collision: true,
        flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
        w: 240,
        h: 65,
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
          },
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  set pageInfoData(val) {
    this._pageInfoData = val;
  }

  set pageIndex(val) {
    this._pageIndex = val;
  }

  _enable() {
    this._Column.patch({
      color: Colors(colors.background).get(),
      Text: {
        text: { text: this._pageInfoData.title },
        color: Colors(colors.white).get(),
      },
    });

    this.fireAncestors('$changeDescription', 1);
  }

  _active() {
    this.fireAncestors('$setFocus', 0);
  }

  _handleEnter() {
    let pageId = this._pageInfoData.id;
    this.fireAncestors('$changeDescription', pageId);
    this.fireAncestors('$setFocus', this._pageIndex);
  }

  _selectButton() {
    this._selected = true;
    this._Column.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unselectButton() {
    this._selected = false;
    this._Column.patch({
      color: Colors(colors.background).get(),
    });
  }

  _focus() {
    this._Column.patch({
      color: Colors(colors.focus).get(),
    });
  }

  _unfocus() {
    if (this._selected) {
      this._Column.patch({
        color: Colors(colors.focusedHelpButton).get(),
      });
    } else {
      this._Column.patch({
        color: Colors(colors.unfocusedHelpButton).get(),
      });
    }
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
  }

  _handleClick() {
    let pageId = this._pageInfoData.id;
    this.fireAncestors('$changeDescription', pageId);
    this.fireAncestors('$setFocus', this._pageIndex);
  }
}
