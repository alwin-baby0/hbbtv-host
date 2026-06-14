var broadcastControlObject = {
  objectsInitialized: false,
  controlAssumed: false,
  videoObj: null,
  videoTag: null,
  currentLiveChannel: null,
  initializeObjects: function () {
    broadcastControlObject.videoObj = document.getElementById('broadcast-video');
    try {
      if (broadcastControlObject.videoObj) {
        console.log('broadcastControlObject: videoObj initialization success')
      }
      broadcastControlObject.videoTag = broadcastControlObject.videoObj.querySelector('video')
      if (broadcastControlObject.videoTag) {
        broadcastControlObject.videoObj.addEventListener('PlayStateChange', broadcastControlObject.playStateChangeEventHandler);
        broadcastControlObject.videoObj.addEventListener('ChannelChangeSucceeded', broadcastControlObject.channelChangeSucceededEvenetHandler);
        broadcastControlObject.videoObj.addEventListener('ChannelChangeError', broadcastControlObject.channelChangeErrorEventHandler);
        broadcastControlObject.objectsInitialized = true
        console.log('broadcastControlObject: videoTag initialization success')
        console.log('broadcastControlObject: initializeObjects success')
        return true
      } else {
        broadcastControlObject.objectsInitialized = false
        console.log('broadcastControlObject: initializeObjects failed: videoTag not found')
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
      broadcastControlObject.videoTag.muted = true;
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
      broadcastControlObject.videoTag.muted = false;
      console.log('broadcastControlObject: showAndUnmuteBroadcast sucess');
      return true
    } catch (error) {
      console.log('broadcastControlObject: showAndUnmuteBroadcast failed', error);
      return false
    }
  },
  // assumeControl: function () {
  //   try {
  //     if (!broadcastControlObject.objectsInitialized) broadcastControlObject.initializeObjects()
  //     broadcastControlObject.videoObj.bindToCurrentChannel();
  //     broadcastControlObject.currentLiveChannel = broadcastControlObject.videoObj.currentChannel;
  //     broadcastControlObject.controlAssumed = true
  //     console.log('broadcastControlObject: assumeControl success')
  //     return true;
  //   } catch (error) {
  //     broadcastControlObject.currentLiveChannel = null;
  //     broadcastControlObject.controlAssumed = false
  //     console.log('broadcastControlObject: assumeControl failed', error)
  //     return false;
  //   }
  // },
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
    broadcastControlObject.videoObj.removeEventlistener('PlayStateChange', broadcastControlObject.playStateChangeEventHandler);
    broadcastControlObject.videoObj.removeEventlistener('ChannelChangeSucceeded', broadcastControlObject.channelChangeSucceededEvenetHandler);
    broadcastControlObject.videoObj.removeEventlistener('ChannelChangeError', broadcastControlObject.channelChangeErrorEventHandler);
    broadcastControlObject.objectsInitialized = false
    broadcastControlObject.controlAssumed = false
    broadcastControlObject.videoObj = null
    broadcastControlObject.videoTag = null
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
      // var playStateField = document.getElementById('playState_field');
      switch (broadcastControlObject.videoObj.playState) {
        case 0:	// unrealized
          // playStateField.innerHTML = 'Unrealized';
          break;
        case 1:	// connecting
          // playStateField.innerHTML = 'Connecting';
          break;
        case 2:	// presenting
          // playStateField.innerHTML = 'Presenting';
          break;
        case 3:	// stopped
          // playStateField.innerHTML = 'Stopped';
          break;
        default:
        // playStateField.innerHTML = 'Error';
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
  }
};
