import { Router } from '@lightningjs/sdk';
import Splash from '../components/SplashScreen/Splash';
import Home from './Home/Home';
import home from './Home/provider/home';
import Movies from './Movies/Movie';
import movies from './Movies/provider/movies';
import SingleMovie from './SingleMovie/SingleMovie';
import singleMovie from './SingleMovie/provider/singleMovie';

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
      path: 'movies',
      component: Movies,
      widgets: ['Menu'],
      on: movies,
    },
    {
      path: 'movie-details/:movieId',
      component: SingleMovie,
      on: singleMovie,
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
