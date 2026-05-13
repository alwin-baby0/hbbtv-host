import { Lightning, Router, VideoPlayer } from '@lightningjs/sdk';
import { loader, unloader } from '../../components/Player/HLS';
import { ROUTES } from '../../constants/globalConstants';
import Color from '@lightningjs/sdk/src/Colors';
import { InactivityService } from '../../Services';

const SCREENSAVER_VIDEO_URL =
  'https://cdn1.amtecco.com/v1/master/31e5c7a6a57f51f4ab8b46003ad27724c9261988/sf-a5bfc9e0-wedotvappsscreensaver/playlist.m3u8';

export default class Screensaver extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      x: 0,
      y: 0,
    };
  }

  _active() {
    this._prepareScreensaver();
  }

  set params(params) {
    console.log('Screensaver params', params);
    setTimeout(() => {
      this._prepareScreensaver();
    }, 1000);
  }

  _prepareScreensaver() {
    this._cleanupVideo();

    VideoPlayer.position(0, 0);
    VideoPlayer.size(1920, 1080);
    VideoPlayer.consumer(this);
    VideoPlayer.loader(loader);
    VideoPlayer.unloader(unloader);
    VideoPlayer.loop(true);

    this.fireAncestors('$punchHole');

    VideoPlayer.open(SCREENSAVER_VIDEO_URL);
    console.log('Playing screensaver video', SCREENSAVER_VIDEO_URL);
    // VideoPlayer.play();
  }

  _cleanupVideo() {
    VideoPlayer.pause();
    VideoPlayer.clear();
    VideoPlayer.close();
    this.fireAncestors('$unpunchHole');
  }

  _disable() {
    this._cleanupVideo();
  }

  _inactive() {
    this._cleanupVideo();
  }

  _closeScreensaver() {
    this._cleanupVideo();
    InactivityService.deactivateScreensaver();

    setTimeout(() => {
      Router.focusPage();
    }, 0);
  }

  _captureKey() {
    this._closeScreensaver();
    return true;
  }

  _handleEnter() {
    this._closeScreensaver();
    return true;
  }

  _handleBack() {
    this._closeScreensaver();
    return true;
  }
}
