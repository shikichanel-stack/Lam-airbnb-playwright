import { test } from '@playwright/test';
import { SearchPage } from '../page/Search'; 

test.describe('Room Listing & Search', () => {

  test.beforeEach(async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('Search room valid data', async ({ page }) => {
    const searchPage = new SearchPage(page);

    // chọn location (click option đầu tiên)
    await searchPage.locationDropdown.click();
    await searchPage.locationOption.click();

    // chọn ngày
    await searchPage.selectDate('20', '25');

    // chọn guest
    await searchPage.selectGuest(2);

    // search
    await searchPage.clickSearch();

    // verify
    await searchPage.verifyRoomList();
  });

  test('Search with different guest number', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.locationDropdown.click();
    await searchPage.locationOption.click();

    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(4);
    await searchPage.clickSearch();

    await searchPage.verifyRoomList();
  });

  test('Search with different date', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.locationDropdown.click();
    await searchPage.locationOption.click();

    await searchPage.selectDate('10', '15');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await searchPage.verifyRoomList();
  });

});