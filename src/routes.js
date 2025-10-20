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

export default {
  root: 'splash',
  routes: [
    {
      path: 'splash',
      component: Splash,
    },
    {
      path: 'home',
      component: Home,
      widgets: ['Menu'],
      on: home,
    },
    {
      path: 'vod/:vodType',
      component: VodPreview,
      widgets: ['Menu'],
      on: onVodPage,
    },
    {
      path: 'movie-details/:movieId',
      component: SingleMovie,
      on: singleMovie,
    },
    {
      path: 'series-details/:seriesId',
      component: SingleSeries,
      on: singleSeries,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: 'filterPage/:action/:genre_movies',
      component: Filtered,
      on: filtered,
      widgets: ['Menu'],
    },
    {
      path: 'sports-details/:seriesId',
      component: SingleSeries,
      on: singleSeries,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: 'event-details/:eventId',
      component: SingleLiveEvent,
      on: singleLiveEvent,
    },
    {
      path: 'live',
      component: LiveTV,
      widgets: ['Menu'],
      on: livetv,
    },
    {
      path: 'search',
      component: Search,
      widgets: ['Menu'],
      on: onSearchPage,
    },
    {
      path: 'account',
      component: MyAccount,
      widgets: ['Menu'],
      on: myAccount,
    },
    {
      path: 'langsettings',
      component: LanguageSettings,
      widgets: ['Menu'],
      on: languageSettings,
    },
    {
      path: 'help',
      component: HelpScreen,
      widgets: ['Menu'],
      on: help,
    },
    {
      path: 'player',
      component: Player,
      options: {
        reuseInstance: false,
      },
    },
    {
      path: 'collection-details/:collectionId',
      component: Collection,
      on: collection,
    },
    {
      path: 'cmp',
      component: CMP,
      on: cmp,
    },
    {
      path: 'cmp-customize',
      component: CMPCustomize,
    },
  ],
};
