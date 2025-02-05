import LanguageButton from '../../../Components/Buttons/LanguageButton/LanguageButton';
import { CMPService } from '../../../Services/CMPService';
import { parseTranslations } from '../../../Services/HomePageService';
import { LanguageService } from '../../../Services/LanguagesService';
import HelpButton from '../../../components/Buttons/HelpButton/HelpButton';
import MemberTabButton from '../../../components/MemberTabButton/MemberTabButton';
import defTr from '../../../../static/translations/en.json';
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

// const languages = (page) => {
//   const items = languagesData.map((language) => ({
//     type: LanguageButton,
//     props: {
//       languageInfo: language,
//     },
//     w: 250,
//     h: 100,
//   }));
//   page._Column.props = {
//     items: items,
//     enableScroll: false,
//   };
// };

const userLanguageTranslations = [
  {
    lang: 'de',
    title: `Kostenlos anmelden für unbegrenzte Unterhaltung!`,
    text: `Melde dich jetzt kostenlos an und erhalte Zugang zu noch mehr Funktionen! Synchronisiere wedotv auf all deinen Geräten und geniesse nahtloses Weiterschauen deiner Lieblingsfilme und -serien – jederzeit und überall.`,
    scanText: `Scann den QR-Code`,
    loggedInText: `Hallo, du bist eingeloggt. Bereit für neue Entdeckungen?`,
  },
  {
    lang: 'en',
    title: `Sign up for unlimited entertainment – it's free!`,
    text: `Sign up now for free and unlock even more features! Sync wedotv across all your devices and enjoy seamless streaming of your favorite movies and series – anytime, anywhere.`,
    scanText: `Scan the QR code`,
    loggedInText: `Hello, you are logged in. Ready for new discoveries?`,
  },
  {
    lang: 'it',
    title: `Registrati gratuitamente per un intrattenimento illimitato!`,
    text: `Registrati ora gratuitamente e accedi a ancora più funzioni! Sincronizza wedotv su tutti i tuoi dispositivi e goditi la visione senza interruzioni dei tuoi film e serie preferiti, sempre e ovunque.`,
    scanText: `Scansiona il codice QR`,
    loggedInText: `Ciao, sei connesso. Pronto per nuove scoperte?`,
  },
  {
    lang: 'fr',
    title: `Inscrivez-vous gratuitement pour un divertissement illimité !`,
    text: `Inscrivez-vous gratuitement dès maintenant et accédez à encore plus de fonctionnalités ! Synchronisez wedotv sur tous vos appareils et profitez de vos films et séries préférés sans interruption, à tout moment et où que vous soyez.`,
    scanText: `Scannez le code QR`,
    loggedInText: `Bonjour, tu es connecté. Prêt pour de nouvelles découvertes?`,
  },
  {
    lang: 'es',
    title: `¡Regístrate gratis para entretenimiento ilimitado!`,
    text: `Regístrate ahora gratis y accede a aún más funciones. Sincroniza wedotv en todos tus dispositivos y disfruta de tus películas y series favoritas sin interrupciones, en cualquier momento y lugar.`,
    scanText: `Escanea el código QR`,
    loggedInText: `Hola, estás conectado. ¿Listo para nuevos descubrimientos?`,
  },
  {
    lang: 'nl',
    title: `Meld je gratis aan voor onbeperkt entertainment!`,
    text: `Meld je nu gratis aan en krijg toegang tot nog meer functies! Synchroniseer wedotv op al je apparaten en geniet van naadloze streaming van je favoriete films en series, altijd en overal.`,
    scanText: `Scan de QR-code`,
    loggedInText: `Hoi, je bent ingelogd. Klaar voor nieuwe ontdekkingen?`,
  },
  {
    lang: 'sv',
    title: `Registrera dig gratis för obegränsad underhållning!`,
    text: `Registrera dig nu gratis och få tillgång till ännu fler funktioner! Synkronisera wedotv på alla dina enheter och njut av sömlös streaming av dina favoritfilmer och serier – när som helst, var som helst.`,
    scanText: `Skanna QR-koden`,
    loggedInText: `Hej, du är inloggad. Redo för nya upptäckter?`,
  },
  {
    lang: 'no',
    title: `Registrer deg gratis for ubegrenset underholdning!`,
    text: `Registrer deg nå gratis og få tilgang til enda flere funksjoner! Synkroniser wedotv på alle enhetene dine og nyt sømløs strømming av dine favorittfilmer og serier – når som helst, hvor som helst.`,
    scanText: `Skann QR-koden`,
    loggedInText: `Hei, du er logget inn. Klar for nye oppdagelser?`,
  },
  {
    lang: 'da',
    title: `Tilmeld dig gratis for ubegrænset underholdning!`,
    text: `Tilmeld dig nu gratis og få adgang til endnu flere funktioner! Synkroniser wedotv på alle dine enheder, og nyd problemfri streaming af dine yndlingsfilm og -serier – når som helst og hvor som helst.`,
    scanText: `Scan QR-koden`,
    loggedInText: `Hej, du er logget ind. Klar til nye opdagelser?`,
  },
  {
    lang: 'fi',
    title: `Rekisteröidy ilmaiseksi rajattomaan viihteeseen!`,
    text: `Rekisteröidy nyt ilmaiseksi ja saat käyttöösi vielä enemmän ominaisuuksia! Synkronoi wedotv kaikilla laitteillasi ja nauti suosikkielokuviesi ja -sarjojesi saumattomasta katselusta milloin ja missä tahansa.`,
    scanText: `Skannaa QR-koodi`,
    loggedInText: `Hei, olet kirjautunut sisään. Oletko valmis uusiin löytöihin?`,
  },
];

const memberArea = (page, tabButtons) => {
  const items = tabButtons.map((tabInfo, index) => ({
    type: MemberTabButton,
    tabInfoData: tabInfo,
    w: 250,
    h: 100,
    tabIndex: index,
  }));

  page._Column.props = {
    items: items,
    enableScroll: false,
  };

  //  page.helpPages = data.entry;
};

export default async function (page) {
  const translations = parseTranslations();
  console.log('prevodi iz settingsa', translations);

  const languages = await LanguageService.getLanguages();

  page.props = {
    languagesData: languages.data,
    userLanguageTranslations: userLanguageTranslations,
  };

  const tabButtons = [
    {
      id: 0,
      title: translations?.my_account || defTr.my_account,
    },
  ];

  if (localStorage.getItem('userData')) {
    tabButtons.push(
      {
        id: 1,
        title: translations?.continue_watching || defTr.continue_watching,
      },
      {
        id: 2,
        title: translations?.favorites || defTr.favorites,
      },
      {
        id: 3,
        title: translations?.logout || defTr.logout,
      }
    );
  }
  // languages(page);
  memberArea(page, tabButtons);
}
