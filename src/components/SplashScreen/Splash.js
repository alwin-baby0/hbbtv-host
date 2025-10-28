import { Lightning, Router, Utils } from '@lightningjs/sdk';
import { CMPService, DetailService } from '../../Services';
import { IMG_PATH, ROUTES } from '../../constants/globalConstants';

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      Background: {
        rect: true,
        w: 1920,
        h: 1080,
        src: Utils.asset(IMG_PATH.BACKGROUND),
        zIndex: 999,
      },
      Logo: {
        w: 1920,
        h: 1080,
        rect: true,
        src: Utils.asset(IMG_PATH.SPLASH_SCREEN),
        zIndex: 1000,
      },
    };
  }

  async getMovie(id) {
    const movie = await DetailService.getMovie(id);

    if (movie) {
      Router.navigate(ROUTES.PLAYER, {
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

      if (params.has('type') && params.has('id')) {
        const type = params.get('type');
        const id = params.get('id');
        const seriesId = params.get('seriesId');

        if (type === 'movie') {
          Router.setHistory([{ hash: ROUTES.HOME }]);
          Router.navigate(`${ROUTES.MOVIE_DETAILS}/${id}`);
        } else if (type === 'series') {
          Router.setHistory([{ hash: ROUTES.HOME }]);
          Router.navigate(`${ROUTES.SERIES_DETAILS}/${id}`);
        } else if (type === 'episode') {
          Router.setHistory([{ hash: ROUTES.HOME }]);
          history.replaceState(null, '', window.location.pathname);
          Router.navigate(
            `${ROUTES.SERIES_DETAILS}/${seriesId}?episodeId=${id}&isDeeplinkEpisode=true`
          );
        }
      } else if (expireTimeInMS === 0 || currentTimeInMS > expireTimeInMS) {
        Router.navigate(ROUTES.CMP, false);
      } else {
        Router.navigate(ROUTES.HOME, false);
      }
    }, 3000);
  }

  _disable() {
    console.log('called disable life event from splash');
    if (this._intervalID) {
      clearInterval(this._intervalID);
      this._intervalID = null;
    }
  }
}
