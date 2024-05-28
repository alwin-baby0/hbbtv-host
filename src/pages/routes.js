import { Router } from '@lightningjs/sdk';
import Splash from '../components/SplashScreen/Splash';
import Home from './Home/Home';
import home from './Home/provider/home';
import VodPreview from './VodPreview/VodPreview';
import onVodPage from './VodPreview/provider/onVodPage';
import SingleMovie from './SingleMovie/SingleMovie';
import singleMovie from './SingleMovie/provider/singleMovie';
import Filtered from './Filtered/Filtered';
import filtered from './Filtered/provider/filtered';

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
      path: 'filterPage/:action/:genre_movies',
      component: Filtered,
      on: filtered,
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
