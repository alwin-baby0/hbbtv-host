import Splash from './components/SplashScreen/Splash';
import Home from './pages/Home/Home';
import home from './pages/Home/provider/home';
import VodPreview from './pages/VodPreview/VodPreview';
import onVodPage from './pages/VodPreview/provider/onVodPage';
import SingleMovie from './pages/SingleMovie/SingleMovie';
import singleMovie from './pages/SingleMovie/provider/singleMovie';
import Filtered from './pages/Filtered/Filtered';
import filtered from './pages/Filtered/provider/filtered';
import SingleSeries from './pages/SingleSeries/SingleSeries';
import singleSeries from './pages/SingleSeries/provider/singleSeries';
import Search from './pages/Search/Search';
import SingleLiveEvent from './pages/SingleLiveEvent/SingleLiveEvent';
import singleLiveEvent from './pages/SingleLiveEvent/provider/singleLiveEvent';
import Player from './pages/Player/Player';
import MyAccount from './pages/MyAccount/MyAccount';
import myAccount from './pages/MyAccount/provider/myAccount';
import HelpScreen from './pages/Help/HelpScreen';
import help from './pages/Help/provider/help';
import LiveTV from './pages/LiveTV/LiveTV';
import livetv from './pages/LiveTV/providers/livetv';
import onSearchPage from './pages/Search/provider/onSearchPage';
import Collection from './pages/Collection/Collection';
import collection from './pages/Collection/provider/collection';
import CMP from './pages/CMP/CMP';
import cmp from './pages/CMP/provider/cmp';
import CMPCustomize from './pages/CMP/components/CMPCustomize';
import LanguageSettings from './pages/LanguageSettings/LanguageSettings';
import languageSettings from './pages/LanguageSettings/provider/languageSettings';
import { PATH } from './constants/globalConstants';

export default {
  root: PATH.SPLASH,
  routes: [
    {
      path: PATH.SPLASH,
      component: Splash,
    },
    {
      path: PATH.HOME,
      component: Home,
      widgets: [PATH.MENU_WIDGET],
      on: home,
    },
    {
      path: `${PATH.VOD}/:vodType`,
      component: VodPreview,
      widgets: [PATH.MENU_WIDGET],
      on: onVodPage,
    },
    {
      path: `${PATH.MOVIE_DETAILS}/:movieId`,
      component: SingleMovie,
      on: singleMovie,
    },
    {
      path: `${PATH.SERIES_DETAILS}/:seriesId`,
      component: SingleSeries,
      on: singleSeries,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: `${PATH.FILTER_PAGE}/:action/:genre_movies`,
      component: Filtered,
      on: filtered,
      widgets: [PATH.MENU_WIDGET],
    },
    {
      path: `${PATH.SPORTS_DETAIL}/:seriesId`,
      component: SingleSeries,
      on: singleSeries,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: `${PATH.EVENT_DETAILS}/:eventId`,
      component: SingleLiveEvent,
      on: singleLiveEvent,
    },
    {
      path: PATH.LIVE,
      component: LiveTV,
      widgets: [PATH.MENU_WIDGET],
      on: livetv,
    },
    {
      path: PATH.SEARCH,
      component: Search,
      widgets: [PATH.MENU_WIDGET],
      on: onSearchPage,
    },
    {
      path: PATH.ACC,
      component: MyAccount,
      widgets: [PATH.MENU_WIDGET],
      on: myAccount,
    },
    {
      path: PATH.LAN_SETTINGS,
      component: LanguageSettings,
      widgets: [PATH.MENU_WIDGET],
      on: languageSettings,
    },
    {
      path: PATH.HELP,
      component: HelpScreen,
      widgets: [PATH.MENU_WIDGET],
      on: help,
    },
    {
      path: PATH.PLAYER,
      component: Player,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: `${PATH.COLLECTION}/:collectionId`,
      component: Collection,
      on: collection,
    },
    {
      path: PATH.CMP,
      component: CMP,
      on: cmp,
    },
    {
      path: PATH.CMP_CUSTOMIZE,
      component: CMPCustomize,
    },
  ],
};
