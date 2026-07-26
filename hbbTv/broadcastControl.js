/*
 * NOTE — video/broadcast (analog tuner) handling on single-video-plane HbbTV devices
 * (verified on a real Sony BRAVIA, HbbTV 1.5.1):
 *
 * 1. NESTED <video> REQUIRED. The host page's
 *      <object type="video/broadcast" id="broadcast-video"> ... </object>
 *    MUST contain a nested <video></video>. initializeObjects() below does
 *    videoObj.querySelector('video') and fails ("videoTag not found", app doesn't load) without it.
 *
 * 2. HIDING IS NOT STOPPING. A video/broadcast object that is only covered graphically (or has
 *    visibility:hidden) keeps DECODING AUDIO while presenting. display:none and videoTag.muted do
 *    NOT silence the external tuner. Per HbbTV/OIPF the reliable way to blank + silence broadcast
 *    is to TAKE CONTROL then STOP the object:
 *        videoObj.style.display = 'block';   // display:none RELEASES it -> terminal shows its tuner
 *        videoObj.bindToCurrentChannel();    // unrealized(0) -> presenting(2)
 *        videoObj.stop();                    // -> stopped(3): blank + silent, decoders freed
 *    stop() on an unrealized (playState 0) object is a no-op — you must bindToCurrentChannel first.
 *    Re-apply this whenever the app's own HTML5 player is idle; it frees the single broadband
 *    decoder for that player (HbbTV 2.0.1), so it never competes with it.
 */
const generateRandomUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const randomHex = Math.floor(Math.random() * 16);
    const value = char === 'x' ? randomHex : (randomHex & 0x3) | 0x8;
    return value.toString(16);
  });
};

var broadcastControlObject = {
  objectsInitialized: false,
  controlAssumed: false,
  videoObj: null,
  currentLiveChannel: null,
  initializeObjects: function () {
    broadcastControlObject.videoObj = document.getElementById('broadcast-video');
    try {
      if (broadcastControlObject.videoObj) {
        broadcastControlObject.videoObj.addEventListener('PlayStateChange', broadcastControlObject.playStateChangeEventHandler);
        broadcastControlObject.videoObj.addEventListener('ChannelChangeSucceeded', broadcastControlObject.channelChangeSucceededEvenetHandler);
        broadcastControlObject.videoObj.addEventListener('ChannelChangeError', broadcastControlObject.channelChangeErrorEventHandler);
        broadcastControlObject.objectsInitialized = true
        broadcastControlObject.assumeControl()
        return true
      } else {
        broadcastControlObject.objectsInitialized = false
        return false
      }
    } catch (error) {
      broadcastControlObject.objectsInitialized = false
      console.log('broadcastControlObject: initializeObjects failed', error)
      return false
    }
  },
  hideAndMuteBroadcast: function () {
    try {
      broadcastControlObject.videoObj.style.display = 'none';
      broadcastControlObject.videoObj.stop();
      console.log('broadcastControlObject: hideAndMuteBroadcast sucess');
      return true
    } catch (error) {
      console.log('broadcastControlObject: hideAndMuteBroadcast failed', error);
      return false
    }
  },
  showAndUnmuteBroadcast: function () {
    try {
      broadcastControlObject.videoObj.style.display = 'block';
      console.log('broadcastControlObject: showAndUnmuteBroadcast sucess');
      return true
    } catch (error) {
      console.log('broadcastControlObject: showAndUnmuteBroadcast failed', error);
      return false
    }
  },
  assumeControl: function () {
    try {
      if (!broadcastControlObject.objectsInitialized) broadcastControlObject.initializeObjects()
      broadcastControlObject.videoObj.bindToCurrentChannel();
      broadcastControlObject.currentLiveChannel = broadcastControlObject.videoObj.currentChannel;
      broadcastControlObject.controlAssumed = true
      return true;
    } catch (error) {
      broadcastControlObject.currentLiveChannel = null;
      broadcastControlObject.controlAssumed = false
      console.log('broadcastControlObject: assumeControl failed', error)
      return false;
    }
  },
  // setNextChannel: function () {
  //   try {
  //     if (broadcastControlObject.controlAssumed) {
  //       if (!broadcastControlObject.objectsInitialized) broadcastControlObject.initializeObjects()
  //       cleanupBroadcastBeforeReleasing()
  //       broadcastControlObject.showAndUnmuteBroadcast()
  //       broadcastControlObject.videoObj.nextChannel()
  //       console.log('broadcastControlObject: setNextChannel initiated successfully');
  //     }
  //   } catch (error) {
  //     console.log('broadcastControlObject: setNextChannel failed, attempting releaseControl', error);
  //     broadcastControlObject.releaseControl()
  //   }
  // },
  // setPreviousChannel: function () {
  //   try {
  //     if (broadcastControlObject.controlAssumed) {
  //       if (!broadcastControlObject.objectsInitialized) broadcastControlObject.initializeObjects()
  //       cleanupBroadcastBeforeReleasing()
  //       broadcastControlObject.showAndUnmuteBroadcast()
  //       broadcastControlObject.videoObj.prevChannel()
  //       console.log('broadcastControlObject: setPreviousChannel initiated successfully');
  //     }
  //   } catch (error) {
  //     console.log('broadcastControlObject: setPreviousChannel failed, attempting releaseControl', error);
  //     broadcastControlObject.releaseControl()
  //   }
  // },
  releaseControl: function () {
    try {
      cleanupBroadcastBeforeReleasing()
      broadcastControlObject.showAndUnmuteBroadcast()
      try {
        broadcastControlObject.videoObj.release();
        broadcastControlObject.resetObjects()
      } catch (error) {
        console.log('broadcastControlObject: releaseControl failed, attempting reset', error)
        broadcastControlObject.resetObjects()
      }
      console.log('broadcastControlObject: releaseControl success')
    } catch (error) {
      console.log('broadcastControlObject: releaseControl failed, attempting reset', error)
      broadcastControlObject.resetObjects()
    }
  },
  resetObjects: function () {
    broadcastControlObject.videoObj.removeEventListener('PlayStateChange', broadcastControlObject.playStateChangeEventHandler);
    broadcastControlObject.videoObj.removeEventListener('ChannelChangeSucceeded', broadcastControlObject.channelChangeSucceededEvenetHandler);
    broadcastControlObject.videoObj.removeEventListener('ChannelChangeError', broadcastControlObject.channelChangeErrorEventHandler);
    broadcastControlObject.objectsInitialized = false
    broadcastControlObject.controlAssumed = false
    broadcastControlObject.videoObj = null
    broadcastControlObject.currentLiveChannel = null
  },
  // getChannelList: function () {
  //   try {
  //     return broadcastControlObject.videoObj.getChannelConfig().channelList;
  //   } catch (error) {
  //     return null;
  //   }
  // },
  // getChannelInfo: function (ch) {
  //   var channelInfo = '' + ch.name + '(' + ch.onid + ',' + ch.tsid + ',' + ch.sid + ')';
  //   return channelInfo;
  // },
  playStateChangeEventHandler: function () {
    try {
      switch (broadcastControlObject.videoObj.playState) {
        case 0:	// unrealized
          break;
        case 1:	// connecting
          break;
        case 2:	// presenting
          break;
        case 3:	// stopped
          break;
        default:
          break
      }
    } catch (error) {
      console.log('broadcastControlObject: playStateChangeEventHandler error', error);
    }
  },
  channelChangeSucceededEvenetHandler: function (channel) {
    console.log('broadcastControlObject: channel change succeeded, attempting releaseControl');
    broadcastControlObject.releaseControl()
  },
  channelChangeErrorEventHandler: function (channel, errorState) {
    console.log('broadcastControlObject: channel change error, attempting releaseControl', errorState);
    broadcastControlObject.releaseControl()
  },
  getHbbTvVersion: function () {
    // fetch the user agent string from the navigator object
    var userAgent = navigator.userAgent;
    // find the version number within the user agent string
    var hbbtvVersion = userAgent.match(/HbbTV\/([0-9.]+)/);
    if (hbbtvVersion && hbbtvVersion[1]) {
      return hbbtvVersion[1];
    } else {
      return 'unknown';
    }
  },
  getHbbTvDeviceDetails: function () {
    let serialNumber = localStorage.getItem('hbbtv_uniqid');

    if (!serialNumber) {
      serialNumber = generateRandomUUID()
      localStorage.setItem('hbbtv_uniqid', serialNumber);
    }

    return {
      serialNumber: serialNumber,
      model: 'model-unknown',
      brand: 'HbbTv',
      os: 'HbbTv',
      osVersion: broadcastControlObject.getHbbTvVersion(),
      macAddress: 'unknown',
    };
  }
};
