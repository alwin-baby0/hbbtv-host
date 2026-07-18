import { Colors, Router, Lightning, Utils } from '@lightningjs/sdk';
import { ScrollWrapper } from '@lightningjs/ui-components';
import colors from '../../../reskin/colors.json';
import LoadingScreenComponent from '../../components/LoadingScreenComponent/LoadinScreenComponent';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import { ROUTES, TRANSLATIONS, IMG_PATH } from '../../constants/globalConstants';
import { t } from '../../utils';

const states = ['HelpItems', 'ScrollWrapper'];

export default class HelpScreen extends Lightning.Component {
  _props = {
    lastId: 0,
    texts: [],
  };

  static _template() {
    return {
      Background: {
        src: Utils.asset(IMG_PATH.BACKGROUND_SUPPORT_PAGES),
        y: 0,
        x: 350,
        w: 1570,
        h: 883,
        zIndex: 1,
      },
      Overlay: {
        src: Utils.asset(IMG_PATH.GRADIENT_SVG),
        zIndex: 2,
      },
      InfoLabel: {
        zIndex: 3,
        w: 420,
        h: 80,
        x: 100,
        y: 175,
        text: {
          text: t(TRANSLATIONS.HELP_INFO_LABEL),
          fontFace: 'Montserrat-Bold',
          fontSize: 40,
        },
      },
      Wrapper: {
        zIndex: 3,
        x: 110,
        y: 120,
        h: 1080,
        w: 1800,
        Row: {
          y: 30,
          x: 300,
          collision: true,
          type: HorizontalContainer,
          h: 225,
          w: 290,
          props: {
            parentState: 'HelpItems',
            disableScroll: true,
          },
        },
        Description: {
          w: 1390,
          h: 760,
          y: 155,
          x: 290,
          color: Colors(colors.white).get(),
          QRDesc: {
            w: 250,
            h: 250,
            Wrapper: {
              ScrollWrapper: {
                type: ScrollWrapper,
                h: 650,
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

  get _Row() {
    return this.tag('Row');
  }

  get _ScrollWrapper() {
    return this.tag('ScrollWrapper');
  }

  _active() {
    this._setState('HelpItems');
  }

  _handleBack() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    Router.setHistory([{ hash: ROUTES.HOME, state: null }]);
    Router.back();
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      this._Row.Items.children[lastId]._unselectButton();
    }
    this._Row.Items.children[id]._selectButton();
    this._props.lastId = id;
  }

  $changeDescription(index) {
    const content = this._props.texts[index].map((chunk) => ({
      text: chunk,
      style: {
        alignContent: 'center',
        fontSize: 26,
        textColor: Colors('#f3f4f5').get(),
        fontFace: 'Montserrat-Regular',
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
          return this._Row;
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          if (!Router.isNavigating()) {
            Router.focusWidget(ROUTES.MENU_WIDGET);
          }
        }

        _handleDown() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          this._setState('ScrollWrapper');
        }
      },
      class ScrollWrapper extends this {
        _getFocused() {
          return this._ScrollWrapper;
        }

        _handleUp() {
          if (window.Didomi && didomiVisible) {
            return true;
          }

          this._setState('HelpItems');
          return false;
        }
      },
    ];
  }
}
