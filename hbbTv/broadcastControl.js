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
  assumeControl: function () {
    try {
      if (!broadcastControlObject.objectsInitialized) broadcastControlObject.initializeObjects()
      broadcastControlObject.videoObj.addEventListener('PlayStateChange', broadcastControlObject.playStateChangeEventHandler);
      broadcastControlObject.videoObj.bindToCurrentChannel();
      broadcastControlObject.currentLiveChannel = broadcastControlObject.videoObj.currentChannel;
      broadcastControlObject.controlAssumed = true
      console.log('broadcastControlObject: assumeControl success', broadcastControlObject.currentLiveChannel)
      return true;
    } catch (error) {
      broadcastControlObject.currentLiveChannel = null;
      broadcastControlObject.controlAssumed = false
      console.log('broadcastControlObject: assumeControl failed', error)
      return false;
    }
  },
  getChannelList: function () {
    try {
      return broadcastControlObject.videoObj.getChannelConfig().channelList;
    } catch (error) {
      return null;
    }
  },
  getChannelInfo: function (ch) {
    var channelInfo = '' + ch.name + '(' + ch.onid + ',' + ch.tsid + ',' + ch.sid + ')';
    return channelInfo;
  },
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
  }
};
