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
        title: 'Test Movie',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          director: 'Director:John Doe',
          genre: 'Action',
          subtitle: '120 min',
          cast: 'Cast:Jane Doe, John Smith',
          rating: 'PG-13',
          is_favorite: false,
          trailer: null,
        },
        media_group: [
          {
            media_item: [
              { key: 'thumbnail_480', src: 'https://test.com/thumb.jpg' },
              { key: 'poster_landscape_1080', src: 'https://test.com/landscape.jpg' },
            ],
          },
        ],
        content: {
          src: 'https://test.com/video.mp4',
          type: 'video/mp4',
        },
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
          title: `Movie ${movieId}`,
          summary: '2024',
          type: { value: 'movie' },
          extensions: {
            preview_playback: 'https://test.com/trailer.mp4',
            description: 'Test description',
            duration: '7200',
            director: 'Director:John Doe',
            genre: 'Action',
            subtitle: '120 min',
            cast: 'Cast:Jane Doe',
            rating: 'PG-13',
            is_favorite: false,
            trailer: null,
          },
          media_group: [
            {
              media_item: [
                { key: 'thumbnail_480', src: 'https://test.com/thumb.jpg' },
                { key: 'poster_landscape_1080', src: 'https://test.com/landscape.jpg' },
              ],
            },
          ],
          content: {
            src: 'https://test.com/video.mp4',
            type: 'video/mp4',
          },
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
        title: 'Test Movie',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          director: 'Director:John Doe',
          genre: 'Action',
          subtitle: '120 min',
          cast: 'Cast:Jane Doe',
          rating: 'PG-13',
          is_favorite: false,
          trailer: null,
        },
        media_group: [
          {
            media_item: [
              { key: 'thumbnail_480', src: 'https://test.com/thumb.jpg' },
              { key: 'poster_landscape_1080', src: 'https://test.com/landscape.jpg' },
            ],
          },
        ],
        content: {
          src: 'https://test.com/video.mp4',
          type: 'video/mp4',
        },
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
});
