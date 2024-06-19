import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import colors from '../../../reskin/colors.json';

export default class Settings extends Lightning.Component {
  _props = {
    lastId: 0,
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
        x: 100,
        y: 120,
        h: 300,
        w: 1720,
        Column: {
          h: 300,
          w: 1720,
          type: VerticalContainer,
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  _init() {
    this._setState('LanguageItems');
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this._Column.Items.children[lastId]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this._Column.Items.children[0]._selectButton();
    } else {
      this._Column.Items.children[id]._selectButton();
    }
    // Update the lastId variable with the current ID
    this._props.lastId = id;
  }

  static _states() {
    return [
      class LanguageItems extends this {
        _getFocused() {
          return this.tag('Wrapper.Column');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }
      },
    ];
  }
}
