import { Page, Locator, expect } from '@playwright/test';

export class RoomListingPage {
  readonly page: Page;
  readonly searchBar: Locator;
  readonly searchBtn: Locator;
  readonly roomCardsContainer: Locator;
  readonly roomItems: Locator;

  constructor(page: Page) {
    this.page = page;

    // Thanh search bar tổng quát
    this.searchBar = page.locator("//div[@class='grid grid-cols-12 smm:grid-cols-1 border-2 border-gray-300 md:rounded-full']");
    
    // Nút kính lúp (Sử dụng nth(0) hoặc filter nếu có nhiều cái trùng class này)
    this.searchBtn = page.locator("//div[@class='bg-main ml-5 hover:bg-[#9e3e4e] duration-300 text-white rounded-full p-2 flex justify-center items-center']").first();
    
    // Container chứa danh sách phòng
    this.roomCardsContainer = page.locator("//div[@class='grid lg:grid-cols-3 2xl:grid-cols-5 md:grid-cols-3 smm:grid-cols-1 gap-5']");
    
    // Từng card phòng cụ thể (là con trực tiếp của container bên trên)
    this.roomItems = this.roomCardsContainer.locator('> div');
  }

  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/');
    // Chờ cho container danh sách phòng hiển thị
    await this.roomCardsContainer.waitFor({ state: 'visible' });
  }

  /**
   * Thực hiện luồng chọn địa điểm và nhấn search (Chỉ Click)
   */
  async selectLocationAndSearch(locationName: string) {
    // 1. Click vào thanh search để mở menu
    await this.searchBar.click();

    // 2. Click chọn địa điểm cụ thể từ danh sách gợi ý hiện ra
    // Tìm element chứa tên địa điểm (ví dụ: 'Hồ chí minh') và click
    const locationItem = this.page.locator('.search-location__item, div').filter({ hasText: locationName }).first();
    await locationItem.click();

    // 3. Thực hiện click nút Search (Kính lúp)
    await this.searchBtn.click();
  }

  async clickFirstRoom() {
    await this.roomItems.first().click();
  }

  async getRoomCount(): Promise<number> {
    return await this.roomItems.count();
  }
}