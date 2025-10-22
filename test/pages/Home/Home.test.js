import { TestRenderer } from '@lightningjs/ui-components-test-utils';
import Home from 'src/pages/Home/Home';
import homeProvider from 'src/pages/Home/provider/home';
import { GalleryItem } from 'src/Models/GalleryItem';
import { MovieRailItem } from 'src/api/models/MovieRailItem';

describe('Home Page', () => {
  let testRenderer;
  let page;

  beforeEach(() => {
    const HomePage = {
      HomePage: {
        type: Home
      }
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
      title: 'Test Movie',
      summary: 'Test summary',
      type: { value: 'movie' },
      extensions: {
        preview_playback: 'https://test.com/trailer.mp4',
        description: 'Test description',
        duration: '120',
        genre: 'Action'
      },
      media_group: [{
        media_item: [
          { key: 'thumbnail_480', src: 'https://test.com/thumb.jpg' },
          { key: 'poster_landscape_1080', src: 'https://test.com/landscape.jpg' },
          { key: 'poster_portrait_1080', src: 'https://test.com/portrait.jpg' }
        ]
      }],
      content: {
        src: 'https://test.com/video.mp4',
        type: 'video/mp4'
      }
    };

    const galleryItem = new GalleryItem(galleryItemData);

    const railItemData = {
      id: '2',
      title: 'Rail Movie 1',
      type: { value: 'movie' },
      summary: 'Rail movie summary',
      extensions: {
        description: 'Rail description',
        duration: '90'
      },
      media_group: [{
        media_item: [
          { key: 'thumbnail_480', src: 'https://test.com/rail-thumb.jpg' },
          { key: 'poster_landscape_720', src: 'https://test.com/rail-landscape.jpg' },
          { key: 'poster_portrait_720', src: 'https://test.com/rail-portrait.jpg' }
        ]
      }]
    };

    const railItem = new MovieRailItem(railItemData);

    const mockSliderData = {
      items: [galleryItem]
    };

    const mockRailData = [
      {
        title: 'Popular Movies',
        railType: 'movie',
        stripeId: 'stripe-1',
        items: [railItem]
      }
    ];

    page.props = {
      sliderData: mockSliderData,
      railData: mockRailData
    };

    expect(page).toBeTruthy();
    // toJSON(10) to capture all child components in the snapshot
    expect(testRenderer.toJSON(10)).toMatchSnapshot();
  });
});
