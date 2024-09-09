import { Lightning, Colors, Utils } from '@lightningjs/sdk';
import { Key as BaseKey } from '@lightningjs/ui';
import colors from '../../../../../reskin/colors.json';
export class Key extends BaseKey {
  static _template() {
    return {
      Button: {
        rect: true,
        w: 235,
        h: 75,
        color: Colors('#292929').get(),
        texture: lng.Tools.getRoundRect(235, 75, 12, 3, false),
        Wrapper: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          Label: {
            alpha: 0.8,
            color: Colors('white').get(),
            mountX: 0.5,
            x: (w) => w / 2,
            mountY: 0.42,
            y: (h) => h / 2,
            text: { fontFace: 'Regular', fontSize: 32 },
          },
        },
        ButtonBorder: {},
      },
    };
  }
  get _ButtonBorder() {
    return this.tag('ButtonBorder');
  }
  _firstEnable() {
    this._ButtonBorder.patch({
      w: 235,
      h: 75,
      texture: Lightning.Tools.getRoundRect(240, 80, 12, 3, Colors(colors.unfocus).get(), false),
    });
  }
  set data(obj) {
    this._data = obj;
    this._update();
  }
  get data() {
    return this._data;
  }
  _update() {
    if (!this.active) {
      return;
    }
    const { label } = this._data;
    this.patch({
      Label: {
        mountX: 0.5,
        x: (w) => w - 55,
        mountY: 0.5,
        y: (h) => h / 2,
        flex: { justifyContent: 'center', alignItems: 'center' },
        text: { text: label, fontSize: 32 },
      },
    });
  }
  _firstActive() {
    this._update();
  }
  _focus() {
    super._focus();
    this._ButtonBorder.patch({
      texture: Lightning.Tools.getRoundRect(240, 80, 12, 3, Colors(colors.focus).get(), false),
    });
  }
  _unfocus() {
    super._unfocus();
    this._ButtonBorder.patch({
      texture: Lightning.Tools.getRoundRect(235, 75, 12, 3, Colors(colors.unfocus).get(), false),
    });
  }
}
