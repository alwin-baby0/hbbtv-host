import { Colors, Lightning, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import HorizontalContainer from '../../components/HorizontalContainer/HorizontalContainer';
import LandscapeRailItem from '../../components/RailItems/LandscapeRailItem';
import GalleryItem from '../../components/GalleryItem/GalleryItem';
import { imageSizes } from '../../api/models/utils';

export default class SingleSeries extends Lightning.Component {
  _props = {};
  static _template() {
    return {
      Asd: {
        Content: {
          Background: {
            w: 1920,
            h: 2080,
            src: Utils.asset('images/background.jpg'),
          },
          HeroSection: {
            type: GalleryItem,
          },
          Seasson: {
            x: 110,
            y: 715,
            w: 150,
            h: 40,
            color: Colors(colors.unfocus).get(),
            text: {
              fontFamily: 'Inter',
              fontStyle: 'normal bold',
              fontSize: 32,
              lineHeight: 39,
            },
          },
        },
        Wrapper: {
          x: 110,
          y: 795,
          h: 600,
          w: 1700,
          clipping: true,
          Column: {
            // y: 30,
            h: 600,
            w: 1700,
            type: HorizontalContainer,
          },
        },
      },
    };
  }

  set props(props) {
    this._Column.props = {
      items: [],
    };

    this._props = { ...this._props, ...props };
    const { items, seasonInfo } = this._props;
    const { sectionTitle, items: episodesInfo } = seasonInfo;

    this._HeroSection.patch({
      props: {
        galleryItem: items[0],
        height: 650,
        yPos: 100,
      },
    });

    this._Seasson.patch({
      text: {
        text: sectionTitle,
      },
    });
    console.log('episodesInfo:', episodesInfo);
    const episodes = episodesInfo.map((episode) => {
      return {
        type: LandscapeRailItem,
        flexItem: {
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          marginBottom: 10,
        },
        props: {
          itemTitle: episode.title,
          itemDescription: episode.summary,
          imageSrc: episode.getThumbnailImage(imageSizes.M).src,
          /* callback: () => {
            console.log('Navigate to player:', episode.content.src);
          }, */
        },
      };
    });

    this._Column.props = {
      items: episodes,
    };
  }

  _active() {
    this._setState('HeroSection');
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Seasson() {
    return this.tag('Seasson');
  }

  get _Column() {
    return this.tag('Column');
  }

  _init() {}

  _getFocused() {}

  static _states() {
    return [
      class HeroSection extends this {
        _getFocused() {
          this.tag('Asd').patch({
            y: 0,
          });
          return this._HeroSection;
        }

        _handleDown() {
          this._setState('Items');
        }
      },

      class Items extends this {
        _getFocused() {
          const focusedItem = this._Column;
          this.tag('Asd').patch({
            y: -140,
          });
          return this._Column;
        }

        _handleUp() {
          this._setState('HeroSection');
        }
      },
    ];
  }
}
