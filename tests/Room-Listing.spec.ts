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
    console.log(`Số lượng phòng hiện có: ${count}`);
    expect(count).toBeGreaterThan(0);
  });

  test('TC_02 - Should search for a room by clicking "Hồ Chí Minh"', async ({ page }) => {
    // Thực hiện chọn địa điểm bằng cách click
    await roomPage.selectLocationAndSearch('Hồ Chí Minh');

    // Chờ chuyển hướng sang trang kết quả (room-list)
    await expect(page).toHaveURL(/room-list/);

    // Kiểm tra kết quả hiển thị sau khi search
    const countAfterSearch = await roomPage.getRoomCount();
    expect(countAfterSearch).toBeGreaterThan(0);
  });

  test('TC_03 - Should navigate to room detail when card is clicked', async ({ page }) => {
    // Click vào card phòng đầu tiên
    await roomPage.clickFirstRoom();

    // Kiểm tra URL trang chi tiết 
    await expect(page).toHaveURL(/phong-thue/);
    
    // Kiểm tra xem có button đặt phòng không để xác nhận đã vào đúng trang
    const bookingBtn = page.locator('button').filter({ hasText: /đặt phòng/i });
    await expect(bookingBtn).toBeVisible();
  });
});