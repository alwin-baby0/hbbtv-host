import Lightning from '@lightningjs/sdk/src/Lightning';
import { Column } from '@lightningjs/ui-components';
import { KeyboardRow } from './KeyboardRow';
import Key from './Key';
import { Colors } from '@lightningjs/sdk';
import { keyboardKeys } from './keyboardKeys';

export default class KeyboardSearch extends Lightning.Component {
  static _template() {
    return {
      w: 500,
      h: 500,
      collision: true,
      Keyboard: {
        x: -140,
        w: 1000,
        h: 500,
        rect: true,
        color: Colors('#000000').alpha(0).get(),
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
      w: 700,
      h: 70,
      collision: true,
      rowIndex: rowIndex,
      style: {
        itemSpacing: rowIndex !== 0 ? 10 : 20,
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
      w: 700,
      h: 500,
      items: items,
    });
  }

  set props(props) {
    this._props = { ...this._props, ...props };
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
    this.fireAncestors(
      '$handleStateHover',
      this.parent.children.indexOf(this),
      this._props.parentState
    );
    return false;
  }

  _handleScroll() {
    return false;
  }
}
