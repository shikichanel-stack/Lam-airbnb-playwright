import { Page, Locator } from '@playwright/test';

export class RoomListingPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly searchBtn: Locator;
  /** Khối chứa ít nhất một link phòng (ổn định hơn class Tailwind cứng). */
  readonly roomCardsContainer: Locator;
  readonly roomItems: Locator;

  readonly logoHome: Locator;
  readonly priceFilterBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchBar = page.getByText('Địa điểm', { exact: true });
    this.searchBtn = page.locator('img[alt="search"]').first();
    this.roomItems = page.locator('a[href^="/room-detail/"]');
    this.roomCardsContainer = page.locator('div').filter({ has: this.roomItems }).first();

    this.logoHome = page.getByRole('link', { name: /Cyber Logo|CyberSoft/i }).first();
    this.priceFilterBtn = page.getByRole('button', { name: 'Giá' });
  }

  /** Ảnh trên thẻ phòng đầu tiên (TC_RL_01 / hiển thị danh sách). */
  firstRoomImage(): Locator {
    return this.roomItems.first().locator('img').first();
  }

  /** Quay về trang chủ qua logo (TC_RL_006). */
  async goHomeViaLogo() {
    await this.logoHome.click();
    await this.page.waitForURL(/\/$/, { timeout: 15_000 });
  }

  /** Mở bộ lọc giá nếu có (TC_RL_002 / TC_RL_004). Trả về false nếu không có nút. */
  async openPriceFilter(): Promise<boolean> {
    if ((await this.priceFilterBtn.count()) === 0) return false;
    await this.priceFilterBtn.click();
    return true;
  }

  /** Bấm trang kế phân trang nếu có (TC_RL_003 / TC_RL_07). */
  async clickPaginationNextIfPresent(): Promise<boolean> {
    const next = this.page.getByRole('button', { name: /Next|›|Sau/i }).first();
    if ((await next.count()) === 0) return false;
    await next.click();
    await this.page.waitForTimeout(300);
    return true;
  }

  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/rooms/ho-chi-minh');
    await this.roomItems.first().waitFor({ state: 'visible', timeout: 60_000 });
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /**
   * Chọn địa điểm trong panel và gửi tìm kiếm (click).
   */
  async selectLocationAndSearch(locationName: string) {
    await this.searchBar.click();

    const locationPanel = this.page
      .getByRole('heading', { name: 'Tìm kiếm địa điểm' })
      .locator('xpath=..');
    const locationItem = locationPanel.getByText(locationName, { exact: true }).first();
    await locationItem.waitFor({ state: 'visible' });
    await locationItem.click();

    if (await this.searchBtn.count()) {
      await this.searchBtn.first().click({ timeout: 5000 }).catch(() => {});
    }
  }

  async clickFirstRoom() {
    await this.roomItems.first().click();
  }

  async getRoomCount(): Promise<number> {
    return await this.roomItems.count();
  }

  async openLocationPicker() {
    await this.searchBar.click();
  }
}
