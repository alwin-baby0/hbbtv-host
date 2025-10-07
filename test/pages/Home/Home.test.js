import TestUtils from '@lightningjs/ui-components-test-utils';
import Home from 'src/pages/Home/Home';
import homeProvider from 'src/pages/Home/provider/home';

describe('Home Page', () => {
  let testRenderer;
  let page;

  beforeEach(() => {
    const HomePage = {
      HomePage: {
        type: Home
      }
    };

    // ✅ Pass component config, not just the class
    testRenderer = TestApp.create(HomePage);
    page = testRenderer.getInstance();
  });

  it('renders the Home page', () => {
    expect(page).toBeTruthy();
    expect(testRenderer.toJSON()).toMatchSnapshot();
  });
});
