import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { constructRails } from '../utils';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import Gallery from '../../Components/Gallery/Gallery';
import { HomePageService } from '../../Services/HomePageService';
import { railItemConstructor } from '../utils/railItems';

export default class Home extends Lightning.Component {
  _props = {
    sliderData: null,
    railData: [],
  };
  static _template() {
    return {
      Background: {},
      HeroSection: {
        x: 0,
        y: 0,
        w: 1920,
        h: 800,
        type: Gallery,
      },
      Wrapper: {
        x: 80,
        y: 980,
        h: 1080,
        w: 1700,
        Column: {
          h: 1080,
          w: 1700,
          type: VerticalContainer,
        },
      },
    };
  }

  get _HeroSection() {
    return this.tag('HeroSection');
  }

  get _Column() {
    return this.tag('Column');
  }

  get _Wrapper() {
    return this.tag('Wrapper');
  }

  _active() {
    if (this._getState() === 'Items') {
      setTimeout(() => {
        this.fireAncestors('$setNavbarVisibility', false);
      });
    }
  }

  /**
   * @param {{ sliderData: GalleryItem | null; railData: SimpleRailItem[]; }} props
   */
  set props(props) {
    this._props = { ...this._props, ...props };
    const { sliderData, railData } = this._props;

    // // Modify railData by inserting an empty array after the first element
    // const modifiedRailData = [
    //   railData[0], // Take the first element
    //   [], // Insert an empty array
    //   ...railData.slice(1), // Append the rest of the railData elements
    // ];

    // const rails = constructRails(modifiedRailData);
    // this._Column.props = { items: rails };
    console.log('railData', railData);
    const rails = constructRails(railData);
    this._Column.props = { items: rails };

    if (sliderData) {
      this._HeroSection.patch({
        visible: true,
        props: {
          sliderData,
        },
      });
      this._HeroSection._HeroSection._Info.patch({
        y: 150,
      });
    } else {
      this._setState('Items');
      this.patch({
        HeroSection: undefined,
      });
    }
  }

  _firstActive() {
    this._setState('Hero');
  }

  static _states() {
    return [
      class Hero extends this {
        _getFocused() {
          this.fireAncestors('$setNavbarVisibility', true);
          return this._HeroSection;
        }

        $enter() {
          this.fireAncestors('$setNavbarVisibility', true);

          this._Wrapper.patch({
            y: 980,
          });
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('Items');
        }

        async $horizontalContainerIndexChange(index) {
          if (this._HeroSection._Bullets.Items.children.length - 1 === index) {
            const newRails = await HomePageService.fetchMoreItemsForHeroSection();
            if (newRails && newRails?.items?.length > 0) {
              const parsedItems = railItemConstructor(newRails.items, 'HeroRails', {});
              this._HeroSection._Bullets._appendItems(parsedItems);
            }
          }
        }
      },

      class Items extends this {
        $enter() {
          this.fireAncestors('$setNavbarVisibility', false);
          this._HeroSection?.patch({
            y: -980,
          });
          this._Wrapper.patch({
            y: 0,
          });
        }

        $exit() {
          this.fireAncestors('$setNavbarVisibility', true);
          this._HeroSection?.patch({
            y: 0,
          });
          this._Wrapper.patch({
            y: 900,
          });
        }

        _getFocused() {
          return this._Column;
        }

        _handleUp() {
          this._setState('Hero');
        }

        async $horizontalContainerIndexChange(index) {
          const currentItem = this._Column.Items.children[this._Column._focusedIndex];
          if (currentItem.Items.children.length - 1 === index) {
            const newRails = await HomePageService.fetchMoreItemsForStripeId(currentItem.stripeId);
            if (newRails && newRails?.items?.length > 0) {
              const parsedItems = railItemConstructor(newRails.items, newRails.railType, {});
              currentItem._appendItems(parsedItems);
            }
          }
        }

        async $verticalContainerIndexChange(index) {
          // if (index === 1 ) {
          //   console.log('ENTERED:', bannerState);
          //   // bannerState === false;
          //   if (bannerState === false) {
          //     // this._Column._focusedIndex = 2;
          //     // this._Column._reCalibrateScroll(0, 2);
          //     this._Column._focusedIndex = 2;
          //     this._Column._reCalibrateScroll(2, 0);
          //     index += 1;
          //   } else {
          //     // this._Column._focusedIndex = 0;
          //     // this._Column._reCalibrateScroll(2, 0);
          //     his._Column._focusedIndex = 0;
          //     this._Column._reCalibrateScroll(0, 2);
          //   }
          // }

          // if (index === 0) {
          //   console.log('ID 0');
          //   this._Column._focusedIndex = 2;
          //   this._Column._reCalibrateScroll(0, 2);
          // } else if (index === 2) {
          //   console.log('ID 2');
          //   this._Column._focusedIndex = 0;
          //   this._Column._reCalibrateScroll(2, 0);
          // } else if (index === 1) {
          //   // console.log('ID 1');
          // } else {
          //   console.log('ID UNKNOWN');
          // }

          // Upravljanje vidljivošću hero sekcije na osnovu index
          if (index > 0) {
            this._HeroSection?.patch({ visible: false });
            this._Wrapper.patch({ y: 0 });
          } else {
            // this._HeroSection?.patch({ visible: true, y: 980 });
            this._HeroSection?.patch({ visible: true, y: 1080 });
            this._Wrapper.patch({ y: 0 });
          }

          if (
            HomePageService.hasMore &&
            !HomePageService.isLoading &&
            HomePageService.stripesFetched - 2 === index
          ) {
            const newStripes = await HomePageService.fetchMoreStripes();
            const rails = constructRails(newStripes);
            this._Column._appendItems(rails);
          }
        }

        // async $verticalContainerIndexChange(index) {
        //   console.log('BEFORE: Vert index:', index);
        //   let bannerState = false;
        //   // if (index === 1 && this._Column.Items.children[1]._props.cardType === 'BANNER') {
        //   //   console.log('DADADA 111');
        //   //   this._Column._focusedIndex = 2;
        //   //   this._Column._reCalibrateScroll(0, 2);
        //   // } else if (index > 2) {
        //   //   console.log('AAAAAAAAA 222');
        //   // }
        //   if (index < 2) {
        //     bannerState = false;
        //     console.log('111:', index);
        //   } else {
        //     bannerState = true;
        //     console.log('222:', index);
        //   }

        //   if (bannerState) {
        //     // this._Column._focusedIndex = 2;
        //     // this._Column._reCalibrateScroll(0, 2);
        //     this._Column._focusedIndex = 0;
        //     this._Column._reCalibrateScroll(index, 0);
        //     index -= 1;
        //   } else {
        //     // this._Column._focusedIndex = 0;
        //     // this._Column._reCalibrateScroll(index, 0);
        //     index += 1;
        //     this._Column._focusedIndex = 2;
        //     this._Column._reCalibrateScroll(0, 2);
        //   }

        //   console.log('AFTER: Vert index:', index);

        //   if (index > 0) {
        //     this._HeroSection?.patch({
        //       visible: false,
        //     });
        //     this._Wrapper.patch({
        //       y: 0,
        //     });
        //   } else {
        //     this._HeroSection?.patch({
        //       visible: true,
        //       y: 980,
        //     });
        //     this._Wrapper.patch({
        //       y: 0,
        //     });
        //   }

        //   if (
        //     HomePageService.hasMore &&
        //     !HomePageService.isLoading &&
        //     HomePageService.stripesFetched - 2 === index
        //   ) {
        //     const newStripes = await HomePageService.fetchMoreStripes();
        //     const rails = constructRails(newStripes);
        //     this._Column._appendItems(rails);
        //   }
        // }
      },
    ];
  }
}
