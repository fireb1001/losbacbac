import { AngmdbacPage } from './app.po';

describe('angmdbac App', () => {
  let page: AngmdbacPage;

  beforeEach(() => {
    page = new AngmdbacPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
