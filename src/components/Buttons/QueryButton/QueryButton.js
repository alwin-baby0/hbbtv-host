import { Colors, Lightning, Utils } from '@lightningjs/sdk';
import colors from '../../../../reskin/colors.json';

export default class QueryButton extends Lightning.Component {
  static _template() {
    return {
      Column: {
        collision: true,
        w: 400,
        h: 50,
        color: Colors(colors.white).get(),
        rect: true,
        shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
        Icon: {
          x: 5,
          y: 5,
        },
        Text: {
          x: 60,
          y: 5,
          w: 400,
          h: 40,
          text: {
            fontFace: 'Montserrat-Regular',
            fontSize: 30,
            lineHeight: 25,
            letterSpacing: 1.2,
          },
        },
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  _enable() {
    this._Column.patch({
      color: Colors('#1b1b23').alpha(0).get(),
      Icon: {
        h: 40,
        w: 40,
        src: Utils.asset(`/icons/recentIcon.png`),
      },
      Text: {
        text: { text: this.title },
        color: Colors(colors.white).get(),
      },
    });
  }

  _handleEnter() {
    if (window.Didomi && didomiVisible) {
      return true;
    }

    this.fireAncestors('$searchRecent', this.title);
  }

  _focus() {
    this._Column.patch({
      color: Colors(colors.white).get(),
      Text: {
        text: {
          textColor: Colors(colors.black).get(),
        },
      },
      Icon: {
        color: Colors(colors.black).get(),
      },
    });
  }

  _unfocus() {
    this._Column.patch({
      color: Colors('#1b1b23').alpha(0).get(),
      Text: {
        text: {
          textColor: Colors(colors.white).get(),
        },
      },
      Icon: {
        color: Colors(colors.white).get(),
      },
    });
  }

  _handleHover() {
    this.fireAncestors('$handleItemHover', this.parent.children.indexOf(this));
    this._focus();
  }

  _handleClick() {
    this._handleEnter();
  }
}
