import { Locator, Page } from '@playwright/test'

export class HomePage {
    readonly page: Page

    // URL của trang chủ
    readonly baseURL = 'https://demo5.cybersoft.edu.vn/'
    // locator button avatar ở header
    readonly avatarBtn: Locator
    // locator button Đăng nhập ở header
    readonly loginMenuBtn: Locator

    constructor(page: Page) {
        this.page = page

        // button:has(img.h-10): tìm button có chứa img có class h-10
        this.avatarBtn = this.page.locator('button:has(img.h-10)')

        // nút đăng nhập trong menu user
        this.loginMenuBtn = this.page.getByRole('button', {name: 'Đăng nhập'})
    }

    // hàm mở trang chủ
    async open() {
        await this.page.goto(this.baseURL)
    }

    // hàm mở popup login
    async openLoginModal() {
        await this.avatarBtn.click()
        await this.loginMenuBtn.click()
    }
}