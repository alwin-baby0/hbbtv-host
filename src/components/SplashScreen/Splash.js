import { Colors, Lightning, Router, Utils } from '@lightningjs/sdk';
import { CMPService, DetailService } from '../../Services';

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        src: Utils.asset('images/background.jpg'),
        zIndex: 999,
      },
      Logo: {
        w: 1920,
        h: 1080,
        rect: true,
        src: Utils.asset('images/splash-screen.png'),
        zIndex: 1000,
      },
    };
  }

  async getMovie(id) {
    const movie = await DetailService.getMovie(id);

    if (movie) {
      Router.navigate('player', {
        videoUrl: movie.url,
        duration: movie.duration,
        videoId: id,
        ssai: movie.ssai,
      });
    }
  }

  async _active() {
    await CMPService.initialFetch();
    const expireTimeInMS = CMPService.cmpData?.consent?.expire.timestamp;

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    setTimeout(() => {
      const currentTimeInMS = Math.floor(Date.now() / 1000);
      // console.log('Checking time:', currentTimeInMS);

      if (params.has('type') && params.has('id')) {
        const type = params.get('type');
        const id = params.get('id');
        const seriesId = params.get('seriesId');

        if (type === 'movie') {
          /* Router.setHistory([{ hash: 'home' }, { hash: `movie-details/${id}` }]);
          this.getMovie(id); */
          Router.setHistory([{ hash: 'home' }]);
          Router.navigate(`movie-details/${id}`);
        } else if (type === 'series') {
          Router.setHistory([{ hash: 'home' }]);
          Router.navigate(`series-details/${id}`);
        } else if (type === 'episode') {
          /*  Router.setHistory([{ hash: 'home' }, { hash: `series-details/${seriesId}` }]);
          this.getMovie(id); */
          Router.setHistory([{ hash: 'home' }]);
          history.replaceState(null, '', window.location.pathname);
          Router.navigate(`series-details/${seriesId}?episodeId=${id}&isDeeplinkEpisode=true`);
        }
      } else if (expireTimeInMS && currentTimeInMS > expireTimeInMS) {
        Router.navigate('cmp', false);
      } else {
        Router.navigate('home', false);
      }
    }, 3000);
  }

  _disable() {
    console.log('called disable life event from splash');
    // Router.setHistory([]);
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    }
  }
}
