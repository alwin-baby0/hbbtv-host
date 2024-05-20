// VODRow
import { Row } from '@lightningjs/ui-components';
export default class VODRow extends Row {
  static _template() {
    return {
      ...super._template(),
      Title: {
        text: {
          x: 0,
          y: 0,
          fontSize: 30,
        },
        zIndex: 5,
      },
    };
  }
  _attach() {
    super._attach && super._attach();
    this.patch({
      Items: {
        y: 80,
        x: 20,
      },
    });
  }
  set data(val) {
    console.log('data data', val.title);
    return (this._data = val);
  }
  set title(val) {
    this.Title.text = val;
  }
  get title() {
    return this.Title.text.text;
  }
  get Title() {
    return this.tag('Title');
  }
}
