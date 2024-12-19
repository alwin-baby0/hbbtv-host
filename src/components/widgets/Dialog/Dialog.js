import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import { List } from '@lightningjs/ui';
import { Key } from './components/Key';
import { Row } from '@lightningjs/ui-components';
import colors from '../../../../reskin/colors.json';

export default class Dialog extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      zIndex: 9,
      rect: true,
      color: Colors(colors.background).get(),
      Background: {
        x: 610,
        y: 160,
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
        y: 300,
        w: 700,
        h: 480,
        Labels: {
          x: 350,
          y: 220,
          w: 660,
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
              text: this.bindProp('message'),
              wordWrap: true,
              fontSize: 38,
              textAlign: 'center',
            },
          },
        },
        Buttons: {
          flex: { justifyContent: 'center' },
          collision: true,
          type: Row,
          mountX: 0.5,
          x: 300,
          y: 320,
          w: 400,
          scrollIndex: 10,
          style: {
            itemSpacing: 220,
          },
          // spacing: 120,
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

  _handleKey() {
    return true;
  }

  _handleEnter() {
    const index = this.tag('Buttons').selectedIndex;
    const current = this._actions[index];
    if (!!(current && current.action && current.action.call && current.action.apply)) {
      current.action.call();
    }
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
              w: 170,
              h: 80,
              data: { label: action.label },
            };
          }),
        },
      },
    });
    this.visible = true;
    this.setSmooth('alpha', 1);
  }

  $setFocus(index) {
    this.tag('Buttons').selectedIndex = index;
  }

  _handleBack(e) {
    e.preventDefault();
    // this.tag('Buttons').clear();
    this.setSmooth('alpha', 0);
    Router.focusPage();
  }

  close() {
    // this.tag('Buttons').clear();
    this.setSmooth('alpha', 0);
    Router.focusPage();
  }

  _getFocused() {
    return this.tag('Buttons');
  }
}
