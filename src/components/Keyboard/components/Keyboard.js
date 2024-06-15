import Lightning from '@lightningjs/sdk/src/Lightning';
import { Column } from '@lightningjs/ui-components';
import { KeyboardRow } from './KeyboardRow';
import Key from './Key';
import { Colors } from '@lightningjs/sdk';
import { keyboardSearch } from './keyboardKeys';

export default class Keyboard extends Lightning.Component {
  static _template() {
    return {
      w: 400,
      h: 300,
      rect: true,
      color: Colors('#000000').alpha(0.9).get(),
      Keyboard: {
        collision: true,
        type: Column,
        plinko: true,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        style: {
          itemSpacing: 0,
        },
        neverScroll: true,
        // w: this.w,
        // h: this.h,
      },
    };
  }

  _active() {
    const items = keyboardSearch.map((keys, rowIndex) => ({
      type: KeyboardRow,
      h: 100,
      w: 400,
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
        // w: 100,
        // h: 70,
        // title:
      })),
    }));

    this.tag('Keyboard').patch({
      w: 400,
      h: 300,
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
    // console.log(index, 'INDEX');
    // console.log(row, 'ROW');
    // console.log(this._Keyboard);
    this._Keyboard.selectedIndex = row;
    this._Keyboard.items[row].selectedIndex = index;
  }

  /* _handleHover() {
    console.log('HOVERED');
    this.fireAncestors('$setFocusKeyboard');
    return false;
  } */

  $onSoftKey({ key }) {
    // console.log(key);
    const inputTag = this.parent._InputField.tag('Input');

    // console.log(inputTag.listening);

    if (!inputTag.listening) return;
    // console.log('upao je dole');
    switch (key) {
      case 'space':
        inputTag.text = ' ';
        break;
      case 'delete':
      case 'backspace':
        inputTag.backspace();
        break;
      case 'clear':
        inputTag.clear();
        break;
      case 'Done':
        this.fireAncestors('$pressedDone');
        break;
      default:
        // console.log('default je');
        if (inputTag.value.length < this._limit) {
          // console.log('default je');
          inputTag.insert(key);
        }
    }
    this.parent._InputField._changePlaceholder();
  }
}
