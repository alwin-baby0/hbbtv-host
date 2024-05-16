import { Lightning, Colors, Utils } from '@lightningjs/sdk';

export default class Bullet extends Lightning.Component {
  static _template() {
    return {
      Icon: {
        x: 50,
        color: Colors('#818181').get(),
        texture: Lightning.Tools.getSvgTexture(Utils.asset('icons/home/bullet.svg'), 20, 20),
      },
    };
  }

  get _Icon() {
    return this.tag('Icon');
  }
}
