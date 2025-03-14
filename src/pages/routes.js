import Splash from '../Components/SplashScreen/Splash';
import Home from './Home/Home';
import home from './Home/provider/home';
import VodPreview from './VodPreview/VodPreview';
import onVodPage from './VodPreview/provider/onVodPage';
import SingleMovie from './SingleMovie/SingleMovie';
import singleMovie from './SingleMovie/provider/singleMovie';
import Filtered from './Filtered/Filtered';
import filtered from './Filtered/provider/filtered';
import SingleSeries from './SingleSeries/SingleSeries';
import singleSeries from './SingleSeries/provider/singleSeries';
import Search from './Search/Search';
import SingleLiveEvent from './SingleLiveEvent/SingleLiveEvent';
import singleLiveEvent from './SingleLiveEvent/provider/singleLiveEvent';
import Player from './Player/Player';
import Settings from './Settings/Settings';
import settings from './Settings/provider/settings';
import HelpScreen from './Help/HelpScreen';
import help from './Help/provider/help';
import LiveTV from './LiveTV/LiveTV';
import livetv from './LiveTV/providers/livetv';
import onSearchPage from './Search/provider/onSearchPage';
import Collection from './Collection/Collection';
import collection from './Collection/provider/collection';
import CMP from './CMP/CMP';
import cmp from './CMP/provider/cmp';
import CMPCustomize from './CMP/components/CMPCustomize';
import LanguageSettings from './LanguageSettings/LanguageSettings';
import languageSettings from './LanguageSettings/provider/languageSettings';
// TODO: pomeriti ovaj fajl van ovog foldera u /src
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
      // cache: 30,
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
      // on: singleSeries,
    },
    {
      path: 'settings',
      component: Settings,
      widgets: ['Menu'],
      on: settings,
      //cache: 24 * 60 * 60, //24h ex
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
      // on: cmp,
    },
    /* {
      path: '*',
      component: NotFound,
      beforeNavigate() {
        Router.navigate('home', false);
      },
    }, */
  ],
};
