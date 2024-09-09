import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import { List } from '@lightningjs/ui';
import { Key } from './components/Key';

export default class Dialog extends Lightning.Component {
  static _template() {
    return {
      zIndex: 9,
      w: 1920,
      h: 1080,
      rect: true,
      color: Colors('#686868').alpha(1).get(),
      Background: {
        x: 610,
        y: 300,
        w: 700,
        h: 480,
        rtt: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 22 },
        Logo: {
          x: 125,
          y: 50,
          // texture: Lightning.Tools.getSvgTexture(Utils.asset(`/images/logo.svg`), 438, 68),
          // w: 438,
          // h: 68,
          // src: Utils.asset('images/splash-screen.png'),
          // src: Utils.asset('/images/error-dialog-logo.png'),
        },
        FastBlur: {
          w: 700,
          h: 480,
          zIndex: 9,
          type: Lightning.components.FastBlurComponent,
          amount: 3,
          content: {
            MirrorContent: { color: Colors('white').darker(0.4).get() },
          },
        },
      },
      Wrapper: {
        x: 610,
        y: 300,
        w: 700,
        h: 480,
        Labels: {
          w: 660,
          x: 350,
          y: 220,
          mountX: 0.5,
          mountY: 1,
          flex: { direction: 'column' },
          Header: {
            mountX: 0.5,
            x: (w) => w / 2,
          },
          Message: {
            mountX: 0.5,
            x: (w) => w / 2,
            y: 50,
            w: 750,
            color: Colors('#FAFAFA').alpha(1).get(),
            text: {
              fontFace: 'Montserrat-Medium',
              text: this.bindProp('message'),
              wordWrap: true,
              fontSize: 38,
              textAlign: 'center',
            },
          },
        },
        Buttons: {
          type: List,
          mountX: 0.5,
          y: 320,
          x: 300,
          w: 400,
          spacing: 120,
          autoResize: true,
          direction: 'row',
          signals: { onItemsRepositioned: true },
        },
      },
    };
  }

  _init() {
    this.transition('alpha').on('finish', () => {
      if (this.alpha === 0) {
        this.visible = false;
      }
    });
  }

  _firstEnable() {
    this._setState('DialogButtons');
  }

  _handleKey() {
    return true;
  }

  _handleEnter() {
    const index = this.tag('Buttons').index;
    const current = this._actions[index];
    if (!!(current && current.action && current.action.call && current.action.apply)) {
      current.action.call();
    }
  }

  _handleBack() {
    this.close();
  }

  open({ header = '', message = '', actions = [] }) {
    Router.focusWidget('Dialog');
    if (actions.length === 0) {
      actions.push({
        label: 'Yes, exit now',
        action: () => {
          this.close();
        },
      });
    }
    this._actions = actions;
    this.patch({
      header,
      message: message,
      Wrapper: {
        Buttons: {
          items: actions.map((action) => {
            return { type: Key, w: 170, h: 80, data: { label: action.label } };
          }),
        },
      },
    });
    this.visible = true;
    this.setSmooth('alpha', 1);
  }

  close() {
    this.tag('Buttons').clear();
    this.setSmooth('alpha', 0);
    Router.focusPage();
  }

  static _states() {
    return [
      class DialogButtons extends this {
        _getFocused() {
          return this.tag('Buttons');
        }
      },
    ];
  }
}
