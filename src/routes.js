import Splash from './components/SplashScreen/Splash';
import Home from './pages/Home/Home';
import home from './pages/Home/provider/home';
import VodPreview from './pages/VodPreview/VodPreview';
import onVodPage from './pages/VodPreview/provider/onVodPage';
import SingleMovie from './pages/SingleMovie/SingleMovie';
import singleMovie from './pages/SingleMovie/provider/singleMovie';
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
import Settings from './pages/Settings/Settings';
import settings from './pages/Settings/provider/settings';
import { ROUTES } from './constants/globalConstants';

export default {
  root: ROUTES.SPLASH,
  routes: [
    {
      path: ROUTES.SPLASH,
      component: Splash,
    },
    {
      path: ROUTES.HOME,
      component: Home,
      widgets: [ROUTES.MENU_WIDGET],
      on: home,
    },
    {
      path: `${ROUTES.VOD}/:vodType`,
      component: VodPreview,
      widgets: [ROUTES.MENU_WIDGET],
      on: onVodPage,
    },
    {
      path: `${ROUTES.MOVIE_DETAILS}/:movieId`,
      component: SingleMovie,
      on: singleMovie,
    },
    {
      path: `${ROUTES.SERIES_DETAILS}/:seriesId`,
      component: SingleSeries,
      on: singleSeries,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: `${ROUTES.SPORTS_DETAIL}/:seriesId`,
      component: SingleSeries,
      on: singleSeries,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: `${ROUTES.EVENT_DETAILS}/:eventId`,
      component: SingleLiveEvent,
      on: singleLiveEvent,
    },
    {
      path: ROUTES.LIVE,
      component: LiveTV,
      widgets: [ROUTES.MENU_WIDGET],
      on: livetv,
    },
    {
      path: ROUTES.SEARCH,
      component: Search,
      widgets: [ROUTES.MENU_WIDGET],
      on: onSearchPage,
    },
    {
      path: ROUTES.ACC,
      component: MyAccount,
      widgets: [ROUTES.MENU_WIDGET],
      on: myAccount,
    },
    {
      path: ROUTES.SETTINGS,
      component: Settings,
      widgets: [ROUTES.MENU_WIDGET],
      on: settings,
    },
    {
      path: ROUTES.HELP,
      component: HelpScreen,
      widgets: [ROUTES.MENU_WIDGET],
      on: help,
    },
    {
      path: ROUTES.PLAYER,
      component: Player,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: `${ROUTES.COLLECTION}/:collectionId`,
      component: Collection,
      on: collection,
    },
    {
      path: ROUTES.CMP,
      component: CMP,
      on: cmp,
    },
    {
      path: ROUTES.CMP_CUSTOMIZE,
      component: CMPCustomize,
    },
  ],
};
