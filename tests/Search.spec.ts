import { test, expect } from '@playwright/test';
import { SearchPage } from '../page/Search';

test.describe('Room Listing & Search', () => {

  test.beforeEach(async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('TC_S01 - Search room valid data', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S02 - Search with different guest number', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(4);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S03 - Search with different date', async ({ page }) => {
    const searchPage = new SearchPage(page);

    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('10', '15');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S04 - Homepage displays main search controls', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await expect(searchPage.locationDropdown).toBeVisible();
    await expect(searchPage.dateDropdown).toBeVisible();
    await expect(searchPage.guestDropdown).toBeVisible();
    await expect(searchPage.searchButton).toBeVisible();
  });

  test('TC_S05 - Search by named location with minimum guests', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(1);
    await searchPage.clickSearch();

    await expect(page).toHaveURL(/\/rooms\//);
    const count = await searchPage.getRoomResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_S06 - Full flow via searchRoom helper', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.searchRoom('Hồ Chí Minh', '15', '20', '3');

    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_S07 - selectLocation throws when city is not found', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await expect(searchPage.selectLocation('__INVALID_CITY__')).rejects.toThrow(
      /Không tìm thấy location/,
    );
  });
});
