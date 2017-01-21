import { AttendanceFrontendPage } from './app.po';

describe('attendance-frontend App', function() {
  let page: AttendanceFrontendPage;

  beforeEach(() => {
    page = new AttendanceFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
