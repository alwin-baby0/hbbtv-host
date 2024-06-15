import Splash from '../components/SplashScreen/Splash';
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
    },
    {
      path: 'filterPage/:action/:genre_movies',
      component: Filtered,
      on: filtered,
      // cache: 30,
    },
    {
      path: 'sports-details/:seriesId',
      component: SingleSeries,
      on: singleSeries,
    },
    {
      path: 'search',
      component: Search,
      widgets: ['Menu'],
      // on: singleSeries,
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
