import Lightning from '@lightningjs/sdk/src/Lightning';
import { Column } from '@lightningjs/ui-components';
import { KeyboardRow } from './KeyboardRow';
import Key from './Key';
import { Colors } from '@lightningjs/sdk';
import { keyboardKeys } from './keyboardKeys';

export default class KeyboardSearch extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      rect: true,
      color: Colors('#000000').alpha(0.1).get(),
      collision: true,
      flex: { direction: 'column', alignItems: 'center' },

      Keyboard: {
        y: 580,
        w: 1000,
        h: 500,
        rect: true,
        color: Colors('#000000').alpha(0.9).get(),
        collision: true,
        type: Column,
        plinko: true,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        style: {
          itemSpacing: 0,
        },
        neverScroll: true,
      },
    };
  }

  _active() {
    const items = keyboardKeys.map((keys, rowIndex) => ({
      type: KeyboardRow,
      w: 1000,
      h: 100,
      collision: true,
      rowIndex: rowIndex,

      style: {
        itemSpacing: 10,
      },
      flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
      items: keys.map((key, index) => ({
        type: Key,
        data: key,
        collision: true,
        index,
        rowIndex: rowIndex,
      })),
    }));

    this._Keyboard.patch({
      w: 1000,
      h: 500,
      items: items,
    });
  }

  set limit(val) {
    this._limit = val;
  }

  get _Keyboard() {
    return this.tag('Keyboard');
  }

  _getFocused() {
    return this._Keyboard;
  }

  $setFocusKey({ row, index }) {
    this._Keyboard.selectedIndex = row;
    this._Keyboard.items[row].selectedIndex = index;
  }

  _handleHover() {
    this.fireAncestors('$setFocusKeyboard');
    return false;
  }

  _handleScroll() {
    return false;
  }
}
