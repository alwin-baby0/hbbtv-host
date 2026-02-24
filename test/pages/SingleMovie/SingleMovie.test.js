import { TestRenderer } from '@lightningjs/ui-components-test-utils';
import SingleMovie from 'src/pages/SingleMovie/SingleMovie';
import { GalleryItem } from 'src/Models/GalleryItem';
import * as deviceUtils from 'src/utils/device';
import { EVENT_NAMES } from 'src/constants/globalConstants';

// Mock the device utils module
jest.mock('src/utils/device', () => ({
  ...jest.requireActual('src/utils/device'),
  eventTrackPayload: jest.fn(),
  getDeviceInfo: jest.fn(() => ({
    serialNumber: 'test-serial',
    model: 'test-model',
    brand: 'test-brand',
    os: 'Web',
    osVersion: '1.0',
    macAddress: 'test-mac',
  })),
}));

// Mock CMPService
jest.mock('src/Services/CMPService/CMPService', () => ({
  CMPService: {
    initialFetch: jest.fn().mockResolvedValue({}),
    cmpData: {
      consent: {
        expire: {
          timestamp: 0,
        },
      },
    },
  },
}));

// Mock Router
jest.mock('@lightningjs/sdk', () => ({
  ...jest.requireActual('@lightningjs/sdk'),
  Router: {
    navigate: jest.fn(),
    isNavigating: jest.fn(() => false),
    getHistory: jest.fn(() => []),
  },
}));

describe('SingleMovie Page', () => {
  let testRenderer;
  let page;
  let eventTrackPayloadSpy;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    const SingleMoviePage = {
      SingleMoviePage: {
        type: SingleMovie,
      },
    };

    testRenderer = TestRenderer.create(SingleMoviePage);
    page = testRenderer.getInstance();

    // Get reference to the mocked function
    eventTrackPayloadSpy = deviceUtils.eventTrackPayload;
  });

  it('renders the SingleMovie page', () => {
    expect(page).toBeTruthy();
  });

  describe('VIEW_MOVIE event tracking', () => {
    it('should send VIEW_MOVIE event to tracking backend when navigating to movie route', async () => {
      const mockMovieId = '12345';
      const mockMovieData = {
        id: mockMovieId,
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/pGIJhTddTq.mp4',
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItem = new GalleryItem(mockMovieData);

      // Set the props with movie data
      page.props = {
        movie: galleryItem,
        movieId: mockMovieId,
        movieTrailerId: '',
        movieTrailerUrl: '',
        cmpShown: true,
      };

      // Clear any previous calls
      eventTrackPayloadSpy.mockClear();

      // Call _active to simulate navigation to the movie page
      await page._active();

      // Assert that eventTrackPayload was called with correct parameters
      expect(eventTrackPayloadSpy).toHaveBeenCalledWith(EVENT_NAMES.VIEW_MOVIE, mockMovieId);
      expect(eventTrackPayloadSpy).toHaveBeenCalledTimes(1);
    });

    it('should send VIEW_MOVIE event with different movieId for different movies', async () => {
      const movieIds = ['movie-1', 'movie-2', 'movie-3'];

      for (const movieId of movieIds) {
        const mockMovieData = {
          id: movieId,
          type: 'movie',
          title: '2:13',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          summary:
            'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
          playlists: [
            {
              label: 'Related Movies',
              type: 'feed',
              items: [
                {
                  id: '34364',
                  title: '2:13',
                  type: 'movie',
                  url_handler: 'two-thirteen',
                  date_created: '2026-01-16 15:53:47',
                  images: {
                    thumbnail: {
                      180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                      270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                      360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                      480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                      576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                      720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                      1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                    },
                    poster: {
                      180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                      270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                      360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                      480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                      576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                      720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                      1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                    },
                    landscape: {
                      180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                      270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                      360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                      480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                      576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                      720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                      1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                    },
                  },
                },
              ],
            },
          ],
          meta: {
            director: 'Charles Adelman',
            cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
            ratings: {
              bbfc: '18',
              ci: '18',
              cnc: '18',
              fsk: 'FSK18',
              mpaa: 'R',
              tcs: '+18',
              tv: 'TV-MA',
              uk: '18',
            },
            year: 2009,
            country: 'United States',
            imdb: {
              id: 'tt1002561',
              score: 4.8,
            },
            genre: ['Horror', 'Mystery', 'Thriller'],
            keywords: [
              'wedotv',
              'lg:apl',
              'apldeal2025',
              'movie',
              'english',
              'fast',
              'titan',
              'horror',
              'mystery',
              'thriller',
              '213',
              'twothirteen',
            ],
            subtitle_languages: ['English'],
            badges: [
              {
                label: 'Movie',
                style: 'white',
              },
            ],
            language: 'English',
            duration: {
              seconds: 5711,
              string: '95 minutes',
            },
            scenes: {
              credits: {
                start: 5591,
                end: 5711,
              },
            },
          },
          images: {
            thumbnail: {
              180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
              270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
              360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
              480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
              576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
              720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
              1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
            },
            poster: {
              180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
              270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
              360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
              480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
              576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
              720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
              1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
            },
            landscape: {
              180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
              270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
              360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
              480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
              576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
              720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
              1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
            },
          },
          files: [
            {
              url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/pGIJhTddTq.mp4',
              type: 'video/mp4',
            },
            {
              url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
              type: 'application/vnd.apple.mpegurl',
            },
          ],
          date_created: '2025-08-07 09:32:18',
        };

        const galleryItem = new GalleryItem(mockMovieData);

        page.props = {
          movie: galleryItem,
          movieId: movieId,
          movieTrailerId: '',
          movieTrailerUrl: '',
          cmpShown: true,
        };

        // Clear any previous calls before each _active call
        eventTrackPayloadSpy.mockClear();

        await page._active();

        expect(eventTrackPayloadSpy).toHaveBeenCalledWith(EVENT_NAMES.VIEW_MOVIE, movieId);
        expect(eventTrackPayloadSpy).toHaveBeenCalledTimes(1);
      }
    });

    it('should send VIEW_MOVIE event even when CMP consent check is triggered', async () => {
      const mockMovieId = 'test-movie-123';
      const mockMovieData = {
        id: mockMovieId,
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/pGIJhTddTq.mp4',
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItem = new GalleryItem(mockMovieData);

      // Set props with cmpShown as false to trigger CMP check
      page.props = {
        movie: galleryItem,
        movieId: mockMovieId,
        movieTrailerId: '',
        movieTrailerUrl: '',
        cmpShown: false,
      };

      await page._active();

      // The event should still be tracked
      expect(eventTrackPayloadSpy).toHaveBeenCalledWith(EVENT_NAMES.VIEW_MOVIE, mockMovieId);
    });
  });

  describe('Button visibility logic', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('shows WATCH NOW button when movie has no trailer', () => {
      const mockMovieData = {
        id: 'movie-no-trailer',
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItem = new GalleryItem(mockMovieData);

      // Build button configuration with no trailer URL
      const buttons = page._buildButtonConfiguration(galleryItem.trailerUrl, null, '');

      // Should only have WATCH NOW button (no trailer, not logged in)
      expect(buttons).toHaveLength(1);
      expect(buttons[0].buttonName).toBe('WATCH NOW');
    });

    it('shows both WATCH NOW and TRAILER buttons when trailer exists', () => {
      const mockMovieData = {
        id: 'movie-with-trailer',
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/pGIJhTddTq.mp4',
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItem = new GalleryItem(mockMovieData);

      // Build button configuration with trailer URL
      const buttons = page._buildButtonConfiguration(galleryItem.trailerUrl, null, '');

      // Should have both WATCH NOW and TRAILER buttons (not logged in)
      expect(buttons).toHaveLength(2);
      expect(buttons[0].buttonName).toBe('WATCH NOW');
      expect(buttons[1].buttonName).toBe('TRAILER');
    });

    it('shows FAVORITE button only when user is logged in', () => {
      const mockMovieData = {
        id: 'movie-logged-in',
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItem = new GalleryItem(mockMovieData);

      // Test without user data - no favorite button
      const buttonsNotLoggedIn = page._buildButtonConfiguration(galleryItem.trailerUrl, null, '');
      expect(buttonsNotLoggedIn.some((btn) => btn.buttonName === 'FAVORITE')).toBe(false);

      // Set user data in localStorage (use correct key: 'userData')
      localStorage.setItem('userData', JSON.stringify({ userId: '123' }));

      // Test with user data - favorite button should appear
      const buttonsLoggedIn = page._buildButtonConfiguration(galleryItem.trailerUrl, null, '');
      expect(buttonsLoggedIn.some((btn) => btn.buttonName === 'FAVORITE')).toBe(true);
      expect(buttonsLoggedIn).toHaveLength(2); // WATCH NOW + FAVORITE
    });

    it('shows CONTINUE WATCHING button only when user is logged in AND has last_position', () => {
      const mockMovieData = {
        id: 'movie-with-progress',
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItem = new GalleryItem(mockMovieData);

      // Test 1: Not logged in, has last_position - no continue watching button
      const buttonsNotLoggedIn = page._buildButtonConfiguration(galleryItem.trailerUrl, 1200, '');
      expect(buttonsNotLoggedIn.some((btn) => btn.buttonName === 'CONTINUE WATCHING')).toBe(false);

      // Test 2: Logged in but no last_position - no continue watching button
      localStorage.setItem('userData', JSON.stringify({ userId: '123' }));
      const buttonsNoProgress = page._buildButtonConfiguration(galleryItem.trailerUrl, null, null);
      expect(buttonsNoProgress.some((btn) => btn.buttonName === 'CONTINUE WATCHING')).toBe(false);

      // Test 3: Logged in AND has last_position - continue watching button appears
      const buttonsWithProgress = page._buildButtonConfiguration(galleryItem.trailerUrl, 1200, '');
      expect(buttonsWithProgress.some((btn) => btn.buttonName === 'CONTINUE WATCHING')).toBe(true);
      expect(buttonsWithProgress).toHaveLength(3); // WATCH NOW + FAVORITE + CONTINUE WATCHING
    });

    it('shows correct favorite icon based on is_favorite state', () => {
      localStorage.setItem('userData', JSON.stringify({ userId: '123' }));

      // Test with is_favorite = false
      const mockMovieNotFavorited = {
        id: 'movie-not-fav',
        type: 'movie',
        title: '2:13',
        duration: {
          seconds: 5711,
          string: '95 minutes',
        },
        summary:
          'A profiler gets back to work after some time off for mental health reasons and dives right into a terrifying case involving a serial killer who leaves creepy skin masks on the victims. He’s got to track down this killer while also dealing with his own childhood traumas. It’s a thrilling story that really grips you.',
        playlists: [
          {
            label: 'Related Movies',
            type: 'feed',
            items: [
              {
                id: '34364',
                title: '2:13',
                type: 'movie',
                url_handler: 'two-thirteen',
                date_created: '2026-01-16 15:53:47',
                images: {
                  thumbnail: {
                    180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
                    270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
                    360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
                    480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
                    576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
                    720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
                    1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
                  },
                  poster: {
                    180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
                    270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
                    360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
                    480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
                    576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
                    720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
                    1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
                  },
                  landscape: {
                    180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
                    270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
                    360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
                    480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
                    576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
                    720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
                    1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
                  },
                },
              },
            ],
          },
        ],
        meta: {
          director: 'Charles Adelman',
          cast: ['Mark Thompson', 'Mark Pellegrino', 'Teri Polo'],
          ratings: {
            bbfc: '18',
            ci: '18',
            cnc: '18',
            fsk: 'FSK18',
            mpaa: 'R',
            tcs: '+18',
            tv: 'TV-MA',
            uk: '18',
          },
          year: 2009,
          country: 'United States',
          imdb: {
            id: 'tt1002561',
            score: 4.8,
          },
          genre: ['Horror', 'Mystery', 'Thriller'],
          keywords: [
            'wedotv',
            'lg:apl',
            'apldeal2025',
            'movie',
            'english',
            'fast',
            'titan',
            'horror',
            'mystery',
            'thriller',
            '213',
            'twothirteen',
          ],
          subtitle_languages: ['English'],
          badges: [
            {
              label: 'Movie',
              style: 'white',
            },
          ],
          language: 'English',
          duration: {
            seconds: 5711,
            string: '95 minutes',
          },
          scenes: {
            credits: {
              start: 5591,
              end: 5711,
            },
          },
        },
        images: {
          thumbnail: {
            180: 'https://cdn-images.wedo.tv/180/1/2036093-thumb.png',
            270: 'https://cdn-images.wedo.tv/270/1/2036093-thumb.png',
            360: 'https://cdn-images.wedo.tv/360/1/2036093-thumb.png',
            480: 'https://cdn-images.wedo.tv/480/1/2036093-thumb.png',
            576: 'https://cdn-images.wedo.tv/576/1/2036093-thumb.png',
            720: 'https://cdn-images.wedo.tv/720/1/2036093-thumb.png',
            1080: 'https://cdn-images.wedo.tv/1080/1/2036093-thumb.png',
          },
          poster: {
            180: 'https://cdn-images.wedo.tv/180/2/2036093-portrait.png',
            270: 'https://cdn-images.wedo.tv/270/2/2036093-portrait.png',
            360: 'https://cdn-images.wedo.tv/360/2/2036093-portrait.png',
            480: 'https://cdn-images.wedo.tv/480/2/2036093-portrait.png',
            576: 'https://cdn-images.wedo.tv/576/2/2036093-portrait.png',
            720: 'https://cdn-images.wedo.tv/720/2/2036093-portrait.png',
            1080: 'https://cdn-images.wedo.tv/1080/2/2036093-portrait.png',
          },
          landscape: {
            180: 'https://cdn-images.wedo.tv/180/3/2036093-landscape.png',
            270: 'https://cdn-images.wedo.tv/270/3/2036093-landscape.png',
            360: 'https://cdn-images.wedo.tv/360/3/2036093-landscape.png',
            480: 'https://cdn-images.wedo.tv/480/3/2036093-landscape.png',
            576: 'https://cdn-images.wedo.tv/576/3/2036093-landscape.png',
            720: 'https://cdn-images.wedo.tv/720/3/2036093-landscape.png',
            1080: 'https://cdn-images.wedo.tv/1080/3/2036093-landscape.png',
          },
        },
        files: [
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/pGIJhTddTq.mp4',
            type: 'video/mp4',
          },
          {
            url: 'https://cdn-06.wedo.tv/06/pGIJhTddTq/hls/main.m3u8',
            type: 'application/vnd.apple.mpegurl',
          },
        ],
        date_created: '2025-08-07 09:32:18',
      };

      const galleryItemNotFav = new GalleryItem(mockMovieNotFavorited);
      const buttonsNotFav = page._buildButtonConfiguration(galleryItemNotFav.trailerUrl, null, '');
      const favoriteBtn = buttonsNotFav.find((btn) => btn.buttonName === 'FAVORITE');
      expect(favoriteBtn.icon).toBe('icons/heart.png');

      // Test with is_favorite = true
      const mockMovieFavorited = {
        ...mockMovieNotFavorited,
      };

      const galleryItemFav = new GalleryItem(mockMovieFavorited);
      const buttonsFav = page._buildButtonConfiguration(galleryItemFav.trailerUrl, null, true);
      const favoriteBtnFilled = buttonsFav.find((btn) => btn.buttonName === 'FAVORITE');
      expect(favoriteBtnFilled.icon).toBe('icons/heart-filled.png');
    });
  });

  describe('Button grid layout', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('arranges buttons in rows of 4', () => {
      // Set English language
      localStorage.setItem('languageCode', 'en');

      const mockButtons = [
        { buttonName: 'WATCH NOW' },
        { buttonName: 'TRAILER' },
        { buttonName: 'FAVORITE' },
        { buttonName: 'CONTINUE WATCHING' },
        { buttonName: 'EXTRA' },
      ];

      const rows = page._arrangeButtonsInRowsDependingOnLanguage(mockButtons);

      // New behavior: rows of 4 items
      expect(rows).toHaveLength(2);
      expect(rows[0].items).toHaveLength(4);
      expect(rows[1].items).toHaveLength(1);
    });

    it('handles single button correctly for both languages', () => {
      const mockButtons = [{ buttonName: 'WATCH NOW' }];

      // Test English
      localStorage.setItem('languageCode', 'en');
      const rowsEn = page._arrangeButtonsInRowsDependingOnLanguage(mockButtons);
      expect(rowsEn).toHaveLength(1);
      expect(rowsEn[0].items).toHaveLength(1);

      // Test French
      localStorage.setItem('languageCode', 'fr');
      const rowsFr = page._arrangeButtonsInRowsDependingOnLanguage(mockButtons);
      expect(rowsFr).toHaveLength(1);
      expect(rowsFr[0].items).toHaveLength(1);
    });

    it('handles empty button array', () => {
      localStorage.setItem('languageCode', 'en');
      const rows = page._arrangeButtonsInRowsDependingOnLanguage([]);
      expect(rows).toHaveLength(0);
    });
  });
});
