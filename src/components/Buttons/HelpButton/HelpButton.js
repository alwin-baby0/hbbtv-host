import { Colors, Lightning } from '@lightningjs/sdk';
import { Column } from '@lightningjs/ui-components';
import colors from '../../../../reskin/colors.json';
import { SettingsService } from '../../../Services';

export default class PageItem extends Lightning.Component {
  static _template() {
    return {
      Column: {
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

  set pageInfoData(val) {
    this._pageInfoData = val;
  }

  set pageIndex(val) {
    this._pageIndex = val;
  }

  _enable() {
    this._Column.patch({
      text: { text: this._pageInfoData.title },
      color: Colors(colors.white).get(),
    });
    this.tag('Column').patch({
      color: Colors(colors.background).get(),
    });
    let newPage;
    newPage = SettingsService.getSinglePage(1);
    this.fireAncestors('$changeDescription', newPage, 1);
  }

  _active() {
    this.fireAncestors('$setFocus', 0);
  }

  _handleEnter() {
    let newPage;
    newPage = SettingsService.getSinglePage(this._pageInfoData.id);

    let pageId = this._pageInfoData.id;
    this.fireAncestors('$changeDescription', newPage, pageId);
    this.fireAncestors('$setFocus', this._pageIndex);
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

  _init() { }

  _getFocused() { }

  static _states() {
    return [];
  }
}
