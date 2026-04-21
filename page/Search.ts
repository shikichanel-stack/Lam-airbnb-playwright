import { Page, Locator, expect } from '@playwright/test';
import { test } from 'allure-playwright';

export class SearchPage {
  page: Page;

  locationDropdown: Locator;
  locationOption: Locator;

  dateDropdown: Locator;
  checkInInput: Locator;
  checkOutInput: Locator;

  guestDropdown: Locator;

  searchButton: Locator;
  roomItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.locationDropdown = page.locator("//div[@class='col-span-3  flex-1 px-6 py-3 flex flex-col justify-center items-center cursor-pointer ']");
    this.locationOption = page.locator("(//div[@class=' cursor-pointer flex flex-col items-center justify-center'])[1]");

    this.dateDropdown = page.locator("//div[@class='col-span-4 flex-1 smm:h-16 p-3 flex flex-col justify-center items-center cursor-pointer relative']");
    this.checkInInput = page.locator("//span[@class='rdrDateInput rdrDateDisplayItem rdrDateDisplayItemActive']");
    this.checkOutInput = page.locator("//span[@class='rdrDateInput rdrDateDisplayItem']");

    this.guestDropdown = page.locator("//div[@class='col-span-3 flex-1 p-3 flex justify-center items-center cursor-pointer relative gap-3']");

    this.searchButton = page.locator("//div[@class='bg-main ml-5 hover:bg-[#9e3e4e] duration-300 text-white rounded-full p-2 flex justify-center items-center']");
    this.roomItem = page.locator('.room-item');
  }

  // Mở trang
  async goto() {
    await this.page.goto('https://demo5.cybersoft.edu.vn/');
    await this.page.waitForLoadState('networkidle');
  }

  async selectLocation(location: string) {
  // click mở dropdown
  await this.locationDropdown.click();

  // đợi dropdown render
  await this.page.waitForTimeout(1000); // UI animation (tạm thời)

  // debug xem có text không
  const option = this.page.locator(`text=${location}`).first();

  if (await option.count() === 0) {
    throw new Error(`Không tìm thấy location: ${location}`);
  }

  await option.waitFor({ state: 'visible' });
  await option.click();
}

  // Chọn ngày
  async selectDate(checkIn: string, checkOut: string) {
    await this.checkInInput.click();
    
    

    // chờ calendar load
    await this.page.locator('span').first().waitFor();

    // chọn check-in
    const checkInDate = this.page.locator('span')
      .filter({ hasText: checkIn })
      .first();

    await checkInDate.click();

    // chọn check-out
    const checkOutDate = this.page.locator('span')
      .filter({ hasText: checkOut })
      .nth(1);

    await checkOutDate.click();
  }

  // Chọn guest
  async selectGuest(target: number) {
  await this.guestDropdown.click();

  // locator nút +
  const plusBtn = this.page.locator('button:has-text("+")').first();

  // locator hiển thị số guest hiện tại
  const guestCount = this.page.locator('span').filter({ hasText: /^\d+$/ }).first();

  // lấy số hiện tại
  let current = parseInt(await guestCount.textContent() || '1');

  // click + cho đủ
  while (current < target) {
    await plusBtn.click();
    current++;
  }
}

  // Click search
  async clickSearch() {
    await this.searchButton.click();
  }

  async verifyRoomList() {
  await this.roomItem.first().waitFor({ state: 'visible' });

  const count = await this.roomItem.count();
  expect(count).toBeGreaterThan(0);
}

  // Full flow search
  async searchRoom(location: string, checkIn: string, checkOut: string, guest: string) {
    await this.selectLocation(location);
    await this.selectDate(checkIn, checkOut);
    await this.selectGuest(parseInt(guest));
    await this.clickSearch();
  }
}