import FocusableItem from '../../components/FocusableItem/FocusableItem';

export default class RailItem extends FocusableItem {
  _props = {
    imageSrc: '',
    radius: 6,
    strokeWidth: 4,
  };
  static _template() {
    return {
      ...super._template(),
      Wrapper: {
        flex: { direction: 'column' },
        Border: {
          flex: { justifyContent: 'center', alignItems: 'center' },
          MovieImg: {
            rect: true,
          },
        },
        Title: {
          y: 15,
          h: 45,
          w: 265,
          text: {
            text: 'Title',
            fontFamily: 'Inter',
            fontSize: 18,
            lineHeight: 22,
            maxLines: 2,
            wordWrapWidth: 265,
          },
        },
      },
    };
  }

  set props(props) {
    this._props = { ...this._props, ...props };
    const { imageSrc, radius } = this._props;

    this.tag('MovieImg').patch({
      w: 265,
      h: 375,
      src: imageSrc,
      shader: {
        type: lng.shaders.RoundedRectangle,
        radius: radius,
      },
    });
  }

  set w(value) {
    super.w = value;
  }
  get w() {
    return super.w;
  }
  set h(value) {
    super.h = value - 60;
  }
  get h() {
    return super.h;
  }

  _focus() {
    super._focus();
  }

  _unfocus() {
    super._unfocus();
  }
}
