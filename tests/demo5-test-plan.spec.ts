/**
 * Ánh xạ test plan (Google Sheet) → Playwright.
 * Lưu ý: demo5 chỉ có dropdown địa điểm + lịch + khách (không có ô “từ khóa” tự do),
 * nên các case TC_Search_02–10 (ký tự đặc biệt, <2 ký tự, …) không áp dụng trực tiếp.
 */
import { test, expect } from '@playwright/test';
import { SearchPage } from '../page/Search';
import { RoomListingPage } from '../page/Room-listing';

test.describe('Search — test plan (TC_Search)', () => {
  test('TC_Search_11 - Hiển thị lịch khi bấm ô ngày đến / đi', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.openCalendar();
    await expect(searchPage.calendarPanel).toBeVisible();
  });

  test('TC_Search_13 - Điều hướng tháng trước / sau trên lịch', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.openCalendar();
    await searchPage.goToNextMonth();
    await searchPage.goToPreviousMonth();
    await expect(searchPage.calendarPanel).toBeVisible();
  });

  test('TC_Search_18 - Ngày trong quá khứ bị vô hiệu (ô disabled trên lịch)', async ({
    page,
  }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.openCalendar();
    expect(await searchPage.hasDisabledPastDays()).toBeTruthy();
  });

  test('TC_Search_21 - Điều chỉnh số khách (+ / −) rồi tìm kiếm', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('20', '25');
    await searchPage.selectGuest(4);
    await searchPage.decreaseGuest(2);
    await searchPage.clickSearch();
    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_Search_22 - Chọn địa điểm từ danh sách gợi ý và hiển thị kết quả', async ({
    page,
  }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.selectDate('12', '18');
    await searchPage.selectGuest(2);
    await searchPage.clickSearch();
    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_Search_15 - Chọn địa điểm rồi tìm (giữ ngày & khách mặc định)', async ({
    page,
  }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await searchPage.selectLocation('Hồ Chí Minh');
    await searchPage.clickSearch();
    await expect(page).toHaveURL(/\/rooms\//);
    await searchPage.verifyRoomList();
  });

  test('TC_Search_12 - Địa điểm không có trong danh sách → báo lỗi rõ ràng', async ({
    page,
  }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();
    await expect(searchPage.selectLocation('ZZZ_KHONG_TON_TAI_999')).rejects.toThrow(
      /Không tìm thấy location/,
    );
  });
});

test.describe('Room listing — test plan (TC_RL)', () => {
  let roomPage: RoomListingPage;

  test.beforeEach(async ({ page }) => {
    roomPage = new RoomListingPage(page);
    await roomPage.goto();
  });

  test('TC_RL_01 - Danh sách phòng hiển thị ảnh và link chi tiết', async () => {
    await expect(roomPage.roomItems.first()).toBeVisible();
    await expect(roomPage.firstRoomImage()).toBeVisible();
  });

  test('TC_RL_02 - Mở bộ lọc Giá (nếu trang có nút)', async ({ page }, testInfo) => {
    const opened = await roomPage.openPriceFilter();
    if (!opened) {
      testInfo.skip(true, 'Trang không có nút lọc Giá');
      return;
    }
    const rangeInput = page.locator('input[type="range"]');
    if ((await rangeInput.count()) === 0) {
      testInfo.skip(true, 'Lọc giá không dùng slider — không assert thêm được');
      return;
    }
    await expect(rangeInput.first()).toBeVisible({ timeout: 8000 });
  });

  test('TC_RL_03 - Phân trang (nếu có nút trang sau)', async ({}, testInfo) => {
    const moved = await roomPage.clickPaginationNextIfPresent();
    if (!moved) {
      testInfo.skip(true, 'Không có phân trang hoặc chỉ một trang');
    }
  });

  test('TC_RL_06 - Quay lại trang chủ qua logo', async ({ page }) => {
    await roomPage.goHomeViaLogo();
    await expect(page).toHaveURL(/^https:\/\/demo5\.cybersoft\.edu\.vn\/?$/);
  });

  test('TC_RL_07 - Xem chi tiết phòng từ danh sách', async ({ page }) => {
    await roomPage.clickFirstRoom();
    await expect(page).toHaveURL(/room-detail|phong-thue/);
  });
});
