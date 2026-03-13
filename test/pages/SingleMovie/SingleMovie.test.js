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

  describe('Button visibility logic', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    it('shows WATCH NOW button when movie has no trailer', () => {
      const mockMovieData = {
        id: 'movie-no-trailer',
        title: 'Movie Without Trailer',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          genre: 'Action',
          is_favorite: false,
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

      // Build button configuration with no trailer URL
      const buttons = page._buildButtonConfiguration(galleryItem, '', null);

      // Should only have WATCH NOW button (no trailer, not logged in)
      expect(buttons).toHaveLength(1);
      expect(buttons[0].buttonName).toBe('WATCH NOW');
    });

    it('shows both WATCH NOW and TRAILER buttons when trailer exists', () => {
      const mockMovieData = {
        id: 'movie-with-trailer',
        title: 'Movie With Trailer',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          genre: 'Action',
          is_favorite: false,
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

      // Build button configuration with trailer URL
      const buttons = page._buildButtonConfiguration(
        galleryItem,
        'https://test.com/trailer.mp4',
        null
      );

      // Should have both WATCH NOW and TRAILER buttons (not logged in)
      expect(buttons).toHaveLength(2);
      expect(buttons[0].buttonName).toBe('WATCH NOW');
      expect(buttons[1].buttonName).toBe('TRAILER');
    });

    it('shows FAVORITE button only when user is logged in', () => {
      const mockMovieData = {
        id: 'movie-logged-in',
        title: 'Movie Logged In',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          genre: 'Action',
          is_favorite: false,
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

      // Test without user data - no favorite button
      const buttonsNotLoggedIn = page._buildButtonConfiguration(galleryItem, '', null);
      expect(buttonsNotLoggedIn.some((btn) => btn.buttonName === 'FAVORITE')).toBe(false);

      // Set user data in localStorage (use correct key: 'userData')
      localStorage.setItem('userData', JSON.stringify({ userId: '123' }));

      // Test with user data - favorite button should appear
      const buttonsLoggedIn = page._buildButtonConfiguration(galleryItem, '', null);
      expect(buttonsLoggedIn.some((btn) => btn.buttonName === 'FAVORITE')).toBe(true);
      expect(buttonsLoggedIn).toHaveLength(2); // WATCH NOW + FAVORITE
    });

    it('shows CONTINUE WATCHING button only when user is logged in AND has last_position', () => {
      const mockMovieData = {
        id: 'movie-with-progress',
        title: 'Movie With Progress',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          genre: 'Action',
          is_favorite: false,
          last_position: 1200,
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

      // Test 1: Not logged in, has last_position - no continue watching button
      const buttonsNotLoggedIn = page._buildButtonConfiguration(galleryItem, '', 1200);
      expect(buttonsNotLoggedIn.some((btn) => btn.buttonName === 'CONTINUE WATCHING')).toBe(false);

      // Test 2: Logged in but no last_position - no continue watching button
      localStorage.setItem('userData', JSON.stringify({ userId: '123' }));
      const buttonsNoProgress = page._buildButtonConfiguration(galleryItem, '', null);
      expect(buttonsNoProgress.some((btn) => btn.buttonName === 'CONTINUE WATCHING')).toBe(false);

      // Test 3: Logged in AND has last_position - continue watching button appears
      const buttonsWithProgress = page._buildButtonConfiguration(galleryItem, '', 1200);
      expect(buttonsWithProgress.some((btn) => btn.buttonName === 'CONTINUE WATCHING')).toBe(true);
      expect(buttonsWithProgress).toHaveLength(3); // WATCH NOW + FAVORITE + CONTINUE WATCHING
    });

    it('shows correct favorite icon based on is_favorite state', () => {
      localStorage.setItem('userData', JSON.stringify({ userId: '123' }));

      // Test with is_favorite = false
      const mockMovieNotFavorited = {
        id: 'movie-not-fav',
        title: 'Movie Not Favorited',
        summary: '2024',
        type: { value: 'movie' },
        extensions: {
          preview_playback: 'https://test.com/trailer.mp4',
          description: 'Test description',
          duration: '7200',
          genre: 'Action',
          is_favorite: false,
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

      const galleryItemNotFav = new GalleryItem(mockMovieNotFavorited);
      const buttonsNotFav = page._buildButtonConfiguration(galleryItemNotFav, '', null);
      const favoriteBtn = buttonsNotFav.find((btn) => btn.buttonName === 'FAVORITE');
      expect(favoriteBtn.icon).toBe('icons/heart.png');

      // Test with is_favorite = true
      const mockMovieFavorited = {
        ...mockMovieNotFavorited,
        extensions: {
          ...mockMovieNotFavorited.extensions,
          is_favorite: true,
        },
      };

      const galleryItemFav = new GalleryItem(mockMovieFavorited);
      const buttonsFav = page._buildButtonConfiguration(galleryItemFav, '', null);
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
