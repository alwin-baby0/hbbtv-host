import { Colors, Lightning } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class PageItem extends Lightning.Component {
  static _template() {
    return {
      FocusBorder: {
        flex: {
          direction: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        texture: Lightning.Tools.getRoundRect(
          401,
          74,
          15,
          2,
          Colors('#000000').alpha(0).get(),
          false
        ),
        zIndex: 100,
        Column: {
          collision: true,
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          w: 390,
          h: 62,
          color: Colors(colors.white).alpha(0).get(),
          rect: true,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 15 },
          Text: {
            w: 360,
            h: 45,
            text: {
              textAlign: 'center',
              fontFace: 'Montserrat-Bold',
              fontSize: 33,
              lineHeight: 30,
              letterSpacing: 1.2,
            },
          },
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  get _FocusBorder() {
    return this.tag('FocusBorder');
  }

  set pageInfoData(val) {
    this._pageInfoData = val;
  }

  set pageIndex(val) {
    this._pageIndex = val;
  }

  _enable() {
    this._Column.patch({
      color: Colors(colors.background).alpha(0).get(),
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
      color: Colors(colors.background).alpha(0).get(),
    });
  }

  _focus() {
    this._Column.patch({
      color: Colors(colors.focus).get(),
    });

    this._FocusBorder.patch({
      texture: lng.Tools.getRoundRect(401, 74, 15, 2, Colors(colors.focus).get(), false),
    });
  }

  _unfocus() {
    if (this._selected) {
      this._Column.patch({
        color: Colors(colors.focusedHelpButton).get(),
      });
    } else {
      this._Column.patch({
        color: Colors(colors.unfocusedHelpButton).alpha(0).get(),
      });
    }

    this._FocusBorder.patch({
      texture: lng.Tools.getRoundRect(
        401,
        74,
        15,
        2,
        Colors(colors.background).alpha(0).get(),
        false
      ),
    });
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
