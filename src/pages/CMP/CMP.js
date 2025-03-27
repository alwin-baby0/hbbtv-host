import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services';

export default class CMP extends Lightning.Component {
  static _template() {
    return {
      Wrapper: {
        w: 1920,
        y: 225,
        flex: { direction: 'column', justifyContent: 'center', alignItems: 'center' },
        Title: {
          w: 1000,
          h: 50,
          text: {
            text: 'We value you privacy',
            fontSize: 40,
            fontFace: 'Montserrat-Bold',
            lineHeight: 50,
            textAlign: 'center',
          },
        },
        Description: {
          w: 1000,
          h: 100,
          y: 30,
          text: {
            text: 'We use cookies to enhance browsing experience. By clicking “Yes” you consent to our use of cookies. You can customize your consent preferences by clicking “Customize”',
            fontSize: 24,
            fontFace: 'Montserrat-Regular',
            lineHeight: 30,
            textAlign: 'center',
          },
        },
        Buttons: {
          w: 1050,
          h: 400,
          y: 100,
          collision: true,
          type: VerticalContainer,
        },
      },
    };
  }

  get _Buttons() {
    return this.tag('Buttons');
  }

  _enable() {
    const cmpTitle = CMPService.cmpData?.title;
    const cmpDescription = CMPService.cmpData?.description;

    this.tag('Wrapper').patch({
      Title: {
        text: {
          text: cmpTitle,
        },
      },
      Description: {
        text: {
          text: cmpDescription,
        },
      },
    });
  }

  _getFocused() {
    return this._Buttons;
  }

  _disable() {
    console.log('called disable life event from cmp');
    // Router.setHistory([]);
  }

  _handleBack() {
    this.fireAncestors('$appClose');
  }
}
