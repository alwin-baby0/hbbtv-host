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
          461,
          100,
          15,
          2,
          Colors('#000000').alpha(0).get(),
          false
        ),
        zIndex: 100,
        Column: {
          collision: true,
          flex: { direction: 'row', alignItems: 'center', justifyContent: 'center' },
          w: 450,
          h: 90,
          color: Colors(colors.white).alpha(0).get(),
          rect: true,
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 15 },
          Text: {
            w: 450,
            y: 4,
            text: {
              textAlign: 'center',
              fontFace: 'Montserrat-Bold',
              fontSize: 27,
              lineHeight: 32,
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
      Text: {
        text: { text: this._pageInfoData.title },
        color: Colors(colors.white).get(),
      },
    });

    this.fireAncestors('$changeDescription', 0);
  }

  _active() {
    this.fireAncestors('$setFocus', 0);
  }

  _handleEnter() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    this.fireAncestors('$changeDescription', this._pageIndex);
    this.fireAncestors('$setFocus', this._pageIndex);
  }

  _selectButton() {
    this._selected = true;
    this._Column.patch({
      Text: {
        color: Colors(this._focused ? colors.white : colors.focus).get(),
      },
    });
  }

  _unselectButton() {
    this._selected = false;
    this._Column.patch({
      Text: {
        color: Colors(colors.white).get(),
      },
    });
  }

  _focus() {
    this._Column.patch({
      color: Colors(colors.focus).get(),
      Text: {
        color: Colors(colors.white).get(),
      },
    });

    this._FocusBorder.patch({
      texture: Lightning.Tools.getRoundRect(461, 100, 15, 2, Colors(colors.focus).get(), false),
    });
    this._focused = true;
  }

  _unfocus() {
    this._Column.patch({
      color: Colors(colors.unfocusedHelpButton).alpha(0).get(),
      Text: {
        color: Colors(this._selected ? colors.focus : colors.white).get(),
      },
    });

    this._FocusBorder.patch({
      texture: Lightning.Tools.getRoundRect(
        461,
        100,
        15,
        2,
        Colors(colors.focus).alpha(0).get(),
        false
      ),
    });
  }

  _handleHover() {
    this._focus();
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
  }

  _handleClick() {
    this.fireAncestors('$changeDescription', this._pageIndex);
    this.fireAncestors('$setFocus', this._pageIndex);
  }
}
