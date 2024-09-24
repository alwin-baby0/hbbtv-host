import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import colors from '../../../reskin/colors.json';
import VerticalContainer from '../../Components/VerticalContainer/VerticalContainer';
import { CMPService } from '../../Services/CMPService';
import qrcode from 'qrcode';
import LanguageButton from '../../Components/Buttons/LanguageButton/LanguageButton';
import { parseVodMoviesPageData } from '../../Models';
import { constructRails } from '../utils';
import MemberTabButton from '../../components/MemberTabButton/MemberTabButton';
import UserRecentlyWatched from './UserRecentlyWatched';
import UserFavorites from './UserFavorites';

const languagesData = [
  {
    code: 'EN',
    value: 'en',
  },
  {
    code: 'DE',
    value: 'de',
  },
  {
    code: 'IT',
    value: 'it',
  },
];

/* const userLanguageTranslations = [
  {
    lang: 'de',
    title: `Kostenlos anmelden für unbegrenzte Unterhaltung!`,
    text: `Melde dich jetzt kostenlos an und erhalte Zugang zu noch mehr Funktionen! Synchronisiere wedotv auf all deinen Geräten und geniesse nahtloses Weiterschauen deiner Lieblingsfilme und -serien – jederzeit und überall.`,
    scanText: `Scann den QR-Code`,
  },
  {
    lang: 'en',
    title: `Sign up for unlimited entertainment – it's free!`,
    text: `Sign up now for free and unlock even more features! Sync wedotv across all your devices and enjoy seamless streaming of your favorite movies and series – anytime, anywhere.`,
    scanText: `Scan the QR code`,
  },
  {
    lang: 'it',
    title: `Registrati gratuitamente per un intrattenimento illimitato!`,
    text: `Registrati ora gratuitamente e accedi a ancora più funzioni! Sincronizza wedotv su tutti i tuoi dispositivi e goditi la visione senza interruzioni dei tuoi film e serie preferiti, sempre e ovunque.`,
    scanText: `Scansiona il codice QR`,
  },
  {
    lang: 'fr',
    title: `Inscrivez-vous gratuitement pour un divertissement illimité !`,
    text: `Inscrivez-vous gratuitement dès maintenant et accédez à encore plus de fonctionnalités ! Synchronisez wedotv sur tous vos appareils et profitez de vos films et séries préférés sans interruption, à tout moment et où que vous soyez.`,
    scanText: `Scannez le code QR`,
  },
  {
    lang: 'es',
    title: `¡Regístrate gratis para entretenimiento ilimitado!`,
    text: `Regístrate ahora gratis y accede a aún más funciones. Sincroniza wedotv en todos tus dispositivos y disfruta de tus películas y series favoritas sin interrupciones, en cualquier momento y lugar.`,
    scanText: `Escanea el código QR`,
  },
  {
    lang: 'nl',
    title: `Meld je gratis aan voor onbeperkt entertainment!`,
    text: `Meld je nu gratis aan en krijg toegang tot nog meer functies! Synchroniseer wedotv op al je apparaten en geniet van naadloze streaming van je favoriete films en series, altijd en overal.`,
    scanText: `Scan de QR-code`,
  },
  {
    lang: 'sv',
    title: `Registrera dig gratis för obegränsad underhållning!`,
    text: `Registrera dig nu gratis och få tillgång till ännu fler funktioner! Synkronisera wedotv på alla dina enheter och njut av sömlös streaming av dina favoritfilmer och serier – när som helst, var som helst.`,
    scanText: `Skanna QR-koden`,
  },
  {
    lang: 'no',
    title: `Registrer deg gratis for ubegrenset underholdning!`,
    text: `Registrer deg nå gratis og få tilgang til enda flere funksjoner! Synkroniser wedotv på alle enhetene dine og nyt sømløs strømming av dine favorittfilmer og serier – når som helst, hvor som helst.`,
    scanText: `Skann QR-koden`,
  },
  {
    lang: 'da',
    title: `Tilmeld dig gratis for ubegrænset underholdning!`,
    text: `Tilmeld dig nu gratis og få adgang til endnu flere funktioner! Synkroniser wedotv på alle dine enheder, og nyd problemfri streaming af dine yndlingsfilm og -serier – når som helst og hvor som helst.`,
    scanText: `Scan QR-koden`,
  },
  {
    lang: 'fi',
    title: `Rekisteröidy ilmaiseksi rajattomaan viihteeseen!`,
    text: `Rekisteröidy nyt ilmaiseksi ja saat käyttöösi vielä enemmän ominaisuuksia! Synkronoi wedotv kaikilla laitteillasi ja nauti suosikkielokuviesi ja -sarjojesi saumattomasta katselusta milloin ja missä tahansa.`,
    scanText: `Skannaa QR-koodi`,
  },
]; */

export default class Settings extends Lightning.Component {
  _props = {
    lastId: 0,
    lastLanguage: 0,
    deviceData: undefined,
    isLoggedIn: false,
  };

  constructor(context) {
    super(context);
    this.userLoginButtonsUpdate = this.userLoginButtonsUpdate.bind(this);
  }

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
        y: 225,
        h: 300,
        w: 1720,
        Column: {
          h: 300,
          w: 1720,
          type: VerticalContainer,
        },
      },
      Content: {
        w: 1310,
        h: 920,
        x: 480,
        y: 225,
        clipping: true,
      },
    };
  }

  get _Column() {
    return this.tag('Column');
  }

  set props(props) {
    this._props = { ...this._props, ...props };
  }

  _enable() {
    if (!localStorage.getItem('languageCode')) localStorage.setItem('languageCode', 'en');
  }

  _active() {
    this._setState('DefaultState');
    this.$changeContent(0);
  }

  _disable() {
    CMPService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
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
      this._Column._focusedIndex = 0;
    } else {
      this._Column.Items.children[id]._selectButton();
      this._Column._focusedIndex = id;
    }
    // Update the lastId variable with the current ID
    this._props.lastId = id;
  }

  $setFocusLanguage(id) {
    const { lastLanguage } = this._props;

    if (typeof lastLanguage !== 'undefined') {
      // Unselect the button of the last ID before setting a new one
      this.tag('Content.Languages').Items.children[lastLanguage]._unselectButton();
    }
    // Set the new ID
    if (!id) {
      this.tag('Content.Languages').Items.children[0]._selectButton();
    } else {
      this.tag('Content.Languages').Items.children[id]._selectButton();
    }
    // Update the lastId variable with the current ID
    this._props.lastLanguage = id;
  }

  async $changeContent(contentId) {
    this.tag('Content').patch({
      QRContainer: undefined,
      Languages: undefined,
      Favorites: undefined,
      RecentlyWatched: undefined,
    });
    CMPService.clearPollingInterval();
    window.removeEventListener('userLogIn', this.userLoginButtonsUpdate);
    if (contentId === 0) {
      console.log(this._props);
      const { isLoggedIn } = this._props;
      const userLanguageTranslations = this._props.userLanguageTranslations;
      console.log(userLanguageTranslations);

      const selectedLanguageCode = localStorage.getItem('languageCode');

      const languageObject = userLanguageTranslations.find(
        (item) => item.lang === selectedLanguageCode
      );

      window.addEventListener('userLogIn', this.userLoginButtonsUpdate);

      const { device_code, verification_uri } = this._props.deviceData;

      if (!localStorage.getItem('userData')) {
        await CMPService.setDeviceCodeStatusInterval(device_code);
        const qrCode = verification_uri.url;

        qrcode.toDataURL(qrCode).then((image) => {
          this.tag('Content').patch({
            QRContainer: {
              w: 1310,
              h: 800,
              flex: {
                direction: 'row',
              },
              Info: {
                flex: {
                  direction: 'column',
                },
                w: 750,
                h: 800,
                Title: {
                  h: 120,
                  w: 500,
                  text: {
                    text: languageObject?.title,
                    fontFace: 'Montserrat-Bold',
                    fontSize: 30,
                    lineHeight: 35,
                    letterSpacing: 2,
                  },
                },
                Text: {
                  h: 300,
                  w: 650,
                  text: {
                    text: languageObject?.text,
                    fontFace: 'Montserrat-Regular',
                    fontSize: 25,
                    lineHeight: 30,
                    letterSpacing: 2,
                  },
                },
              },
              Divider: {
                w: 1,
                h: 450,
                rect: true,
                color: Colors('#ffffff').alpha(0.5).get(),
              },
              QRCodeInfo: {
                x: 150,
                flex: {
                  direction: 'column',
                  alignItems: 'center',
                },
                QRCode: {
                  w: 280,
                  h: 280,
                  src: image,
                  zIndex: 100,
                },
                QRText: {
                  flexItem: {
                    marginTop: 10,
                  },
                  text: {
                    text: languageObject?.scanText,
                    fontFace: 'Montserrat-Bold',
                    fontSize: 25,
                    lineHeight: 30,
                    letterSpacing: 2,
                  },
                },
              },
            },
          });
        });
      } else {
        const recentlyWatched = await CMPService.getRecentlyWatched();
        console.log(recentlyWatched.data.recently_watched);
        console.log(recentlyWatched.data.recently_watched.length);

        const parsedMovies = parseVodMoviesPageData({
          data: {
            railTitle: 'Continue Watching',
            entry: recentlyWatched.data.recently_watched,
          },
          itemsPerRow: recentlyWatched.data.recently_watched.length,
        });

        const favorites = await CMPService.getFavorites();
        console.log(favorites.data.favorites);
        const parsedFavorites = parseVodMoviesPageData({
          data: {
            railTitle: 'Favorites',
            entry: favorites.data.favorites,
          },
          itemsPerRow: favorites.data.favorites.length,
        });

        this.tag('Content').patch({
          QRContainer: {
            w: 1400,
            h: 800,
            flex: {
              direction: 'column',
            },
            Info: {
              w: 1310,
              h: 100,
              Title: {
                h: 120,
                w: 1310,
                text: {
                  text: languageObject?.loggedInText,
                  fontFace: 'Montserrat-Bold',
                  fontSize: 30,
                  lineHeight: 35,
                  letterSpacing: 2,
                },
              },
            },
            RecentlyWatched: {
              type: UserRecentlyWatched,
              w: 1400,
              h: 500,
              props: {
                items: parsedMovies,
              },
            },
            Favorites: {
              type: UserFavorites,
              w: 1400,
              h: 920,
              props: {
                items: parsedFavorites,
              },
            },
          },
        });
      }
    } else if (contentId === 1) {
      const { languages } = this._props.languagesData;
      const languagesArr = languages.split(',');

      const items = languagesArr.map((language, index) => ({
        type: LanguageButton,
        props: {
          languageInfo: language,
          languageIndex: index,
        },
        w: 1050,
        h: 100,
      }));

      this.tag('Content').patch({
        Languages: {
          type: VerticalContainer,
          w: 1050,
          h: 300,
          props: {
            items: items,
            enableScroll: false,
            w: 1050,
            h: 300,
          },
        },
      });
    } else if (contentId === 2) {
      const recentlyWatched = await CMPService.getRecentlyWatched();
      console.log(recentlyWatched.data.recently_watched);
      console.log(recentlyWatched.data.recently_watched.length);

      const parsedMovies = parseVodMoviesPageData({
        data: {
          entry: recentlyWatched.data.recently_watched,
        },
        itemsPerRow: 4,
      });

      this.tag('Content').patch({
        RecentlyWatched: {
          type: VerticalContainer,
          w: 1310,
          h: 920,
          props: {
            items: constructRails(parsedMovies),
            h: 920,
          },
        },
      });
    } else if (contentId === 3) {
      const favorites = await CMPService.getFavorites();
      console.log(favorites.data.favorites);
      const parsedMovies = parseVodMoviesPageData({
        data: {
          entry: favorites.data.favorites,
        },
        itemsPerRow: 4,
      });

      this.tag('Content').patch({
        Favorites: {
          type: VerticalContainer,
          w: 1310,
          h: 920,
          props: {
            items: constructRails(parsedMovies),
            h: 920,
          },
        },
      });
    } else if (contentId === 4) {
      localStorage.removeItem('userData');
    }
  }

  userLoginButtonsUpdate() {
    //this._props.isLoggedIn = true;
    this.$changeContent(0);

    this._Column._appendItems([
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 2,
          title: 'Continue Watching',
        },
        w: 250,
        h: 100,
        tabIndex: 2,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 3,
          title: 'Favorites',
        },
        w: 250,
        h: 100,
        tabIndex: 3,
      },
      {
        type: MemberTabButton,
        tabInfoData: {
          id: 4,
          title: 'Logout',
        },
        w: 250,
        h: 100,
        tabIndex: 4,
      },
    ]);
  }

  static _states() {
    return [
      class DefaultState extends this {
        _getFocused() {
          return this.tag('Wrapper.Column');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleRight() {
          if (this.tag('Content.Languages')) {
            this._setState('Languages');
          }
          if (this.tag('Content.Favorites')) {
            this._setState('Favorites');
          }
          if (this.tag('Content.RecentlyWatched')) {
            this._setState('RecentlyWatched');
          }
          if (this.tag('Content.QRContainer.RecentlyWatched')) {
            this._setState('UserRecentlyWatched');
          }
        }
      },

      class Languages extends this {
        _getFocused() {
          return this.tag('Content.Languages');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class Favorites extends this {
        _getFocused() {
          return this.tag('Content.Favorites');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class RecentlyWatched extends this {
        _getFocused() {
          return this.tag('Content.RecentlyWatched');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class UserRecentlyWatched extends this {
        _getFocused() {
          return this.tag('Content.QRContainer.RecentlyWatched');
        }

        _handleUp() {
          Router.focusWidget('Menu');
        }

        _handleDown() {
          this._setState('UserFavorites');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },

      class UserFavorites extends this {
        _getFocused() {
          return this.tag('Content.QRContainer.Favorites');
        }

        _handleUp() {
          this._setState('UserRecentlyWatched');
        }

        _handleLeft() {
          this._setState('DefaultState');
        }
      },
    ];
  }
}
