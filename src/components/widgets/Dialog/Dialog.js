import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import { Key } from './components/Key';
import { Row } from '@lightningjs/ui-components';
import colors from '../../../../reskin/colors.json';

export default class Dialog extends Lightning.Component {
  static _template() {
    return {
      zIndex: 200,
      w: 1920,
      h: 1080,
      collision: true,
      rect: true,
      color: Colors(colors.background).get(),
      Background: {
        x: 610,
        y: 300,
        w: 700,
        h: 480,
        rtt: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 22 },
        Logo: {
          y: 50,
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
        // y: 300,
        y: 260,
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
            y: 25,
            w: 1920,
            color: Colors('#FAFAFA').alpha(1).get(),
            text: {
              text: this.bindProp('message'),
              wordWrap: true,
              fontSize: 38,
              textAlign: 'center',
            },
          },
        },
        Buttons: {
          collision: true,
          zIndex: 300,
          type: Row,
          mountX: 0.5,
          y: 300,
          x: 265,
          w: 400,
          neverScroll: true,
          style: { itemSpacing: 100 },
          autoResize: true,
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
  _handleKey() {
    return true;
  }
  _handleClick() {}
  _handleEnter() {
    const index = this.tag('Buttons').selectedIndex;
    const current = this._actions[index];
    if (!!(current && current.action && current.action.call && current.action.apply)) {
      current.action.call();
    }
  }
  set actions(val) {
    this._actions = val;
  }
  set message(val) {
    this._message = val;
  }
  // _handleHover() {
  //   console.log('hovered');
  // }
  $handleEnter() {
    this._handleEnter();
  }
  $setIndex(index) {
    this.tag('Buttons').selectedIndex = index;
  }
  _handleHover() {
    return false;
  }
  $BtnClicked() {
    this._handleEnter();
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
          items: actions.map((action, index) => {
            return {
              type: Key,
              index: index,
              collision: true,
              w: 235,
              h: 80,
              data: { label: action.label },
              index,
              collision: true,
              zIndex: 200,
            };
          }),
        },
      },
    });
    this.visible = true;
    this.setSmooth('alpha', 1);
    this._setState('Buttons');
  }
  close() {
    this.setSmooth('alpha', 0);
    Router.focusPage();
  }
  focus() {
    this.tag('Buttons').selectedIndex = 1000;
    setTimeout(() => {
      this.tag('Buttons').selectedIndex = 0;
      this._setState('Buttons');
    }, 10);
  }
  $handleBack() {
    this.setSmooth('alpha', 0);
    Router.focusPage();
  }
  _handleBack() {
    this.$handleBack();
  }
  static _states() {
    return [
      class Buttons extends this {
        _getFocused() {
          return this.tag('Buttons');
        }
      },
    ];
  }

  close() {
    // this.tag('Buttons').clear();
    this.setSmooth('alpha', 0);
    Router.focusPage();
  }
  _getFocused() {
    return this.tag('Buttons');
  }
  $setFocus(index) {
    this.tag('Buttons').selectedIndex = index;
  }
}
