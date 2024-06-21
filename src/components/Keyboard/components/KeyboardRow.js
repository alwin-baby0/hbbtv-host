import { Row } from '@lightningjs/ui-components';

export class KeyboardRow extends Row {
  static _template() {
    return {};
  }

  _attach() {
    super._attach && super._attach();
    this.patch({
      Items: {
        x: this.x,
        y: this.y,
      },
    });
  }
}
