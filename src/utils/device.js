export const getDevice = () => {
  if (window.tizen) {
    return 'tizen';
  } else if (window.webos) {
    return 'webos';
  }
  return 'web';
};
