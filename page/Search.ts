import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  page: Page;

  locationDropdown: Locator;
  locationPanel: Locator;
  /** Ô hiển thị khoảng ngày (dd/mm/yyyy – dd/mm/yyyy). */
  dateDropdown: Locator;

  guestDropdown: Locator;

  searchButton: Locator;
  roomItem: Locator;

  /** Vùng lịch react-date-range sau khi mở ô ngày */
  calendarPanel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.locationDropdown = page.getByText('Địa điểm', { exact: true });
    this.locationPanel = page.getByRole('heading', { name: 'Tìm kiếm địa điểm' }).locator('xpath=..');
    this.dateDropdown = page
      .locator('text=/\\d{2}\\/\\d{2}\\/\\d{4}\\s*–\\s*\\d{2}\\/\\d{2}\\/\\d{4}/')
      .first();
    this.guestDropdown = page.getByText('Thêm khách', { exact: true });
    // Trang chủ: icon search nằm cạnh "Thêm khách", không phải img[alt="search"] đơn giản
    this.searchButton = page.getByRole('img', { name: 'search' }).first();
    this.roomItem = page.locator('a[href^="/room-detail/"], a[href^="/rooms/"]');
    this.calendarPanel = page.locator('.rdrMonths, .rdrCalendarWrapper').first();
  }

  /** Mở panel lịch (TC_Search_11). */
  async openCalendar() {
    await this.dateDropdown.click();
    await this.calendarPanel.waitFor({ state: 'visible', timeout: 15_000 });
  }

  /**
   * Điều hướng tháng (TC_Search_13).
   * Demo dùng layout có combobox tháng/năm + nút prev/next cạnh đó (không phải class rdrPrewButton).
   */
  async goToNextMonth() {
    const header = this.page.locator('.rdrMonthAndYearPickers').locator('..');
    await header.locator(':scope > button').nth(1).click();
  }

  async goToPreviousMonth() {
    const header = this.page.locator('.rdrMonthAndYearPickers').locator('..');
    await header.locator(':scope > button').nth(0).click();
  }

  /** Có ít nhất một ô ngày bị khóa (quá khứ) — TC_Search_18/19. */
  async hasDisabledPastDays(): Promise<boolean> {
    const patterns = [
      '.rdrDay.rdrDayDisabled',
      '.rdrDayDisabled',
      '.rdrCalendarWrapper button[disabled]',
    ];
    for (const sel of patterns) {
      if ((await this.page.locator(sel).count()) > 0) return true;
    }
    return false;
  }

  /** Giảm số khách bằng nút − (TC_Search_21). */
  async decreaseGuest(clicks: number) {
    await this.guestDropdown.click();
    const minusBtn = this.page.getByRole('button', { name: '-' }).first();
    for (let i = 0; i < clicks; i++) {
      await minusBtn.click();
    }
  }

  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.locationDropdown.waitFor({ state: 'visible', timeout: 60_000 });
  }

  async selectLocation(location: string) {
    await this.locationDropdown.click();
    await this.locationPanel.waitFor({ state: 'visible' });

    const option = this.locationPanel.getByText(location, { exact: true }).first();
    if ((await option.count()) === 0) {
      throw new Error(`Không tìm thấy location: ${location}`);
    }
    await option.click();
  }

  async selectDate(checkIn: string, checkOut: string) {
    await this.dateDropdown.click();
    const dayButton = (day: string) =>
      this.page.locator('.rdrDayNumber span').filter({ hasText: new RegExp(`^${day}$`) }).first();

    await dayButton(checkIn).waitFor({ state: 'visible', timeout: 15_000 });
    await dayButton(checkIn).click();
    await dayButton(checkOut).click();
  }

  async selectGuest(target: number) {
    await this.guestDropdown.click();
    const plusBtn = this.page.getByRole('button', { name: '+' }).first();
    for (let i = 1; i < target; i++) {
      await plusBtn.click();
    }
  }

  async clickSearch() {
    await this.searchButton.click({ timeout: 15_000 });
    await this.page.waitForURL(/\/rooms\//, { timeout: 30_000 });
  }

  async getRoomResultCount(): Promise<number> {
    await this.roomItem.first().waitFor({ state: 'visible', timeout: 25_000 });
    return await this.roomItem.count();
  }

  async verifyRoomList() {
    const count = await this.getRoomResultCount();
    expect(count).toBeGreaterThan(0);
  }

  async searchRoom(location: string, checkIn: string, checkOut: string, guest: string) {
    await this.selectLocation(location);
    await this.selectDate(checkIn, checkOut);
    await this.selectGuest(parseInt(guest, 10));
    await this.clickSearch();
  }
}
