import { Colors, Router } from '@lightningjs/sdk';
import { ScrollWrapper } from '@lightningjs/ui-components';
import lng from '@lightningjs/core';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../components/VerticalContainer/VerticalContainer';
import LoadingScreenComponent from '../../components/LoadingScreenComponent/LoadinScreenComponent';

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
      let decodedText = '';
      this._LoadingIndicator.visible = true; // Show the loading indicator
      const resolvedPage = await newPagePromise;
      const text = resolvedPage.data.entry[0].extensions.content_plain;
      if (typeof text === 'string') {
        const strippedText = text.replace(/<[^>]+>/g, '');
        decodedText = new DOMParser().parseFromString(strippedText, 'text/html').documentElement
          .textContent;
      }
      this._setScrollWrapperContent(decodedText);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this._LoadingIndicator.visible = false; // Hide the loading indicator
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

    this._ScrollWrapper.patch({
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
