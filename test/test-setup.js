import fetchMock from 'jest-fetch-mock';
// https://github.com/jefflau/jest-fetch-mock
// Switch to https://github.com/philschatz/fetch-vcr

import basicEndpoint from 'test/mocks/basicEndpoint.json';
import basePathWithSubpath from 'test/mocks/basePathWithSubpath.json';

fetchMock.enableMocks();

// Mock VideoPlayer from @lightningjs/sdk
jest.mock('@lightningjs/sdk', () => ({
  ...jest.requireActual('@lightningjs/sdk'),
  VideoPlayer: {
    position: jest.fn(),
    size: jest.fn(),
    consumer: jest.fn(),
    loader: jest.fn(),
    unloader: jest.fn(),
    loop: jest.fn(),
    open: jest.fn(),
    play: jest.fn(),
    clear: jest.fn(),
  }
}));

const RESPONSES = {
  basicEndpoint: JSON.stringify(basicEndpoint),
  basePathWithSubpath: JSON.stringify(basePathWithSubpath),
}

fetch.mockResponse(req => {
  if (req.url.match(/basicEndpoint/)) {
    return Promise.resolve(RESPONSES.basicEndpoint);
  }

  if (req.url.match(/basePath\/\d+\/subPath/)) {
    return Promise.resolve(RESPONSES.basePathWithSubpath);
  }

  return Promise.reject("{}");
});
