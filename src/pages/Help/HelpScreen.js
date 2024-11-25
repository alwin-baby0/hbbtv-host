import { Colors, Router } from '@lightningjs/sdk';
import { ScrollWrapper } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import LoadingScreenComponent from '../../Components/LoadingScreenComponent/LoadinScreenComponent';

export default class HelpScreen extends lng.Component {
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
        },
        Description: {
          w: 1390,
          h: 760,
          // y: 105,
          // x: 290,
          y: 85,
          x: 290,
          color: Colors(colors.white).get(),
          // QRCode: {
          //   x: 30,
          //   w: 160,
          //   h: 160,
          // },
          QRDesc: {
            // y: 220,
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

  _active() {
    this._setState('HelpItems');
  }

  $setFocus(id) {
    const { lastId } = this._props;

    if (typeof lastId !== 'undefined') {
      this._Column.Items.children[lastId]._unselectButton();
    }
    this._Column.Items.children[id]._selectButton();
    this._props.lastId = id;
  }

  $changeDescription(newPagePromise) {
    try {
      newPagePromise
        .then((resolvedPage) => {
          const text = resolvedPage.data.entry[0].extensions.content_plain;
          const strippedText = text.replace(/<[^>]+>/g, '');
          const decodedText = new DOMParser().parseFromString(strippedText, 'text/html')
            .documentElement.textContent;

          this._setScrollWrapperContent(decodedText);

          // let isQrCodeExist = resolvedPage.data.entry[0].extensions.qr;
          // if (isQrCodeExist !== null) {
          //   this.tag('QRCode').patch({
          //     src: isQrCodeExist,
          //     visible: true,
          //   });
          //   this.tag('QRDesc').patch({
          //     y: 220,
          //   });
          // } else {
          //   this.tag('QRCode').patch({
          //     visible: false,
          //   });
          //   this.tag('QRDesc').patch({
          //     y: 0,
          //   });
          // }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('There was a problem processing the text:', error);
    }
  }

  async $changeDescription(newPagePromise) {
    try {
      this.tag('LoadingIndicator').visible = true; // Show the loading indicator
      const resolvedPage = await newPagePromise;
      const text = resolvedPage.data.entry[0].extensions.content_plain;
      const strippedText = text.replace(/<[^>]+>/g, '');
      const decodedText = new DOMParser().parseFromString(strippedText, 'text/html').documentElement
        .textContent;

      this._setScrollWrapperContent(decodedText);

      // const isQrCodeExist = resolvedPage.data.entry[0].extensions.qr;
      // if (isQrCodeExist !== null) {
      //   this.tag('QRCode').patch({
      //     src: isQrCodeExist,
      //     visible: true,
      //   });
      //   this.tag('QRDesc').patch({
      //     y: 220,
      //   });
      // } else {
      //   this.tag('QRCode').patch({
      //     visible: false,
      //   });
      //   this.tag('QRDesc').patch({
      //     y: 0,
      //   });
      // }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.tag('LoadingIndicator').visible = false; // Hide the loading indicator
    }
  }

  _setScrollWrapperContent(text) {
    const chunks = this._splitTextIntoChunks(text, 1000); // Adjust chunk size as needed
    const content = chunks.map((chunk) => ({
      text: chunk,
      style: {
        fontStyle: 'italic',
        alignContent: 'center',
      },
    }));

    this.tag('ScrollWrapper').patch({
      content: content,
    });
  }

  _splitTextIntoChunks(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  static _states() {
    return [
      class HelpItems extends this {
        _getFocused() {
          return this.tag('Wrapper.Column');
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
          return this.tag('ScrollWrapper');
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
