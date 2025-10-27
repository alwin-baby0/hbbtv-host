import { Lightning } from '@lightningjs/sdk';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services';
import { t } from '../../Services';
import { TRANSLATIONS } from '../../constants/globalConstants';

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
            text: t(TRANSLATIONS.CMP_TITLE),
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
            text: t(TRANSLATIONS.CMP_DESCRIPTION),
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

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _enable() {
    const cmpTitle = CMPService.cmpData?.title;
    const cmpDescription = CMPService.cmpData?.description;

    this._Wrapper.patch({
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

  _handleBack() {
    this.fireAncestors('$appClose');
  }
}
