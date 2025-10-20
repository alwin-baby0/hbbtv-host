import { Colors, Router } from '@lightningjs/sdk';
import { ScrollWrapper } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LoadingScreenComponent from '../../components/LoadingScreenComponent/LoadinScreenComponent';

export default class HelpScreen extends lng.Component {
  _props = {
    lastId: 0,
    texts: [],
  };

  static _template() {
    return {
      Background: {
        w: 1920,
        h: 1080,
        color: Colors(colors.background).get(),
        rect: true,
      },
      Wrapper: {
        x: 110,
        y: 120,
        h: 1080,
        w: 1800,
        Column: {
          y: 105,
          collision: true,
          type: VerticalContainer,
          h: 225,
          w: 240,
          props: {
            parentState: 'HelpItems',
          },
        },
        Description: {
          w: 1390,
          h: 760,
          y: 85,
          x: 290,
          color: Colors(colors.white).get(),
          QRDesc: {
            w: 250,
            h: 250,
            Wrapper: {
              ScrollWrapper: {
                type: ScrollWrapper,
                h: 560,
                w: 1380,
                autoScroll: false,
                autoScrollDelay: 2000,
                autoScrollSpeed: 200,
                fadeContent: true,
                scrollDuration: 0.2,
                scrollStep: 200,
                showScrollBar: true,
                mode: 'focused',
                content: [],
              },
            },
          },
        },
      },
      LoadingIndicator: {
        type: LoadingScreenComponent,
        props: {
          xPos: 425,
          yPos: 425,
        },
        w: 1380,
        h: 560,
        visible: false,
        flex: { direction: 'row', justifyContent: 'center', alignItems: 'center' },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  get _Column() {
    return this.tag('Column');
  }

  get _LoadingIndicator() {
    return this.tag('LoadingIndicator');
  }

  get _ScrollWrapper() {
    return this.tag('ScrollWrapper');
  }

  _active() {
    this._setState('HelpItems');
  }

  _handleBack() {
    Router.setHistory([{ hash: 'home', state: null }]);
    Router.back();
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      this._Column.Items.children[lastId]._unselectButton();
    }
    this._Column.Items.children[id]._selectButton();
    this._props.lastId = id;
  }

  $changeDescription(index) {
    const content = this._props.texts[index - 1].map((chunk) => ({
      text: chunk,
      style: {
        fontStyle: 'italic',
        alignContent: 'center',
      },
    }));

    this._ScrollWrapper.patch({
      content: content,
    });
  }

  $handleStateHover(index, stateName = null) {
    if (stateName) {
      this._setState(stateName);
      return;
    }
    this._setState(states[index]);
  }

  static _states() {
    return [
      class HelpItems extends this {
        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleRight() {
          this._setState('ScrollWrapper');
        }
      },
      class ScrollWrapper extends this {
        _getFocused() {
          return this._ScrollWrapper;
        }

        _handleLeft() {
          this._setState('HelpItems');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },
    ];
  }
}
