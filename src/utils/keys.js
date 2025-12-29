export const setupKeys = (deviceType) => {
  switch (deviceType) {
    case 'tizen': {
      window.tizen &&
        window.tizen.tvinputdevice.registerKeyBatch([
          'MediaPlay',
          'MediaPause',
          'MediaStop',
          'ColorF0Red',
          'ColorF1Green',
          'ColorF2Yellow',
          'ColorF3Blue',
          'ChannelUp',
          'ChannelDown',
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          'MediaRewind',
          'MediaFastForward',
          'MediaRecord',
          'MediaPlayPause',
        ]);
      return {
        10009: 'Back',
        10182: 'Exit',
        427: 'ChannelUp',
        428: 'ChannelDown',
        10252: 'MediaPlayPause',
        412: 'MediaRewind',
        417: 'MediaFastForward',
        415: 'MediaPlay',
        19: 'MediaPause',
        413: 'MediaStop',
      };
    }
    case 'webos':
      return {
        // TODO: proveri da li 412 treba da bude 'Exit' ili 'MediaRewind'
        412: 'Exit',
        461: 'Back',
        33: 'ChannelUp',
        34: 'ChannelDown',
        415: 'MediaPlay',
        19: 'MediaPause',
        417: 'MediaFastForward',
        412: 'MediaRewind',
        413: 'MediaStop',
      };
    case 'hisense':
      return {
        8: 'Back',
        427: 'ChannelUp',
        428: 'ChannelDown',
        415: 'MediaPlay',
        19: 'MediaPause',
        417: 'MediaFastForward',
        412: 'MediaRewind',
        413: 'MediaStop',
      };
    case 'titan':
      return {
        8: 'Back',
        33: 'ChannelUp',
        34: 'ChannelDown',
        179: 'MediaPlayPause',
        412: 'MediaRewind',
        417: 'MediaFastForward',
        415: 'MediaPlay',
        19: 'MediaPause',
        413: 'MediaStop',
      };
    case 'xperi':
      return {
        8: 'Back',
        461: 'Back',
        17: 'Back',
        463: 'MediaPlayPause',
        412: 'MediaRewind',
        417: 'MediaFastForward',
        463: 'MediaPlay',
        463: 'MediaPause',
        413: 'MediaStop',
      };
    case 'sunrise':
      return {
        8: 'Back',
        27: 'Back',
        461: 'Back',
        17: 'Back',
        179: 'MediaPlayPause',
        227: 'MediaRewind',
        228: 'MediaFastForward',
        55: 'MediaPlay',
        56: 'MediaPause',
        52: 'MediaStop',
      };
    default:
      // Ocilion Key Codes
      // 461 || 17: 'Back',
      return {
        8: 'Back',
        461: 'Back',
        17: 'Back',
        57: 'MediaPlayPause',
        54: 'MediaRewind',
        53: 'MediaFastForward',
        55: 'MediaPlay',
        56: 'MediaPause',
        52: 'MediaStop',
      };
  }
};
