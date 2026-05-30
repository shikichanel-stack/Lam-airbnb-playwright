import { test, expect } from '@playwright/test';
import { RoomListingPage } from '../page/Room-listing';

test.describe('Room Listing & Search (Click-Only Flow)', () => {
  let roomPage: RoomListingPage;

  test.beforeEach(async ({ page }) => {
    roomPage = new RoomListingPage(page);
    await roomPage.goto();
  });

  test('TC_01 - Should display at least 1 room on homepage', async () => {
    const count = await roomPage.getRoomCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_02 - Should search for a room by clicking "Hồ Chí Minh"', async ({ page }) => {
    // Thực hiện chọn địa điểm bằng cách click
    await roomPage.selectLocationAndSearch('Hồ Chí Minh');

    // Trang kết quả có thể là room-list hoặc đường dẫn /rooms/
    await expect(page).toHaveURL(/room-list|\/rooms\//);

    // Kiểm tra kết quả hiển thị sau khi search
    const countAfterSearch = await roomPage.getRoomCount();
    expect(countAfterSearch).toBeGreaterThan(0);
  });

  test('TC_03 - Should navigate to room detail when card is clicked', async ({ page }) => {
    // Click vào card phòng đầu tiên
    await roomPage.clickFirstRoom();

    // Trang chi tiết: slug phong-thue hoặc đường dẫn room-detail
    await expect(page).toHaveURL(/room-detail|phong-thue/);
    
    // Kiểm tra xem có button đặt phòng không để xác nhận đã vào đúng trang
    const bookingBtn = page.locator('button').filter({ hasText: /đặt phòng/i });
    await expect(bookingBtn).toBeVisible();
  });

  test('TC_04 - Should show search bar and room grid on load', async () => {
    await expect(roomPage.searchBar).toBeVisible();
    await expect(roomPage.roomCardsContainer).toBeVisible();
  });

  test('TC_05 - Should show location panel when search bar is opened', async ({ page }) => {
    await roomPage.openLocationPicker();
    await expect(page.getByRole('heading', { name: 'Tìm kiếm địa điểm' })).toBeVisible();
  });

  test('TC_06 - First room card should be visible', async () => {
    await expect(roomPage.roomItems.first()).toBeVisible();
  });
});