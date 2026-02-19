import { TestRenderer } from '@lightningjs/ui-components-test-utils';
import Home from 'src/pages/Home/Home';
import homeProvider from 'src/pages/Home/provider/home';
import { GalleryItem } from 'src/Models/GalleryItem';

describe('Home Page', () => {
  let testRenderer;
  let page;

  beforeEach(() => {
    const HomePage = {
      HomePage: {
        type: Home,
      },
    };

    testRenderer = TestRenderer.create(HomePage);
    page = testRenderer.getInstance();
  });

  it('renders the Home page with minimal data (Background only)', () => {
    expect(page).toBeTruthy();
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });

  it('renders the Home page with full data (HeroSection and Rails)', () => {
    const galleryItemData = {
      id: '1',
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

    const galleryItem = new GalleryItem(galleryItemData);

    const railItemData = {
      id: '2',
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

    const railItem = new GalleryItem(railItemData);

    const mockSliderData = {
      items: [galleryItem],
    };

    const mockRailData = [
      {
        title: 'Popular Movies',
        railType: 'movie',
        stripeId: 'stripe-1',
        items: [railItem],
      },
    ];

    page.props = {
      sliderData: mockSliderData,
      railData: mockRailData,
    };

    expect(page).toBeTruthy();
    // toJSON(10) to capture all child components in the snapshot
    expect(testRenderer.toJSON(10)).toMatchSnapshot();
  });
});
