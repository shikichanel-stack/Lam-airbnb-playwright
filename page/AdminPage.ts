import { Locator, Page } from "@playwright/test";

export class AdminPage {
    readonly page: Page

    readonly sidebarMenu: Locator

    readonly userManagermentMenu: Locator

    readonly locationManagementMenu: Locator

    readonly roomManagementMenu: Locator

    readonly bookingManagementMenu: Locator

    constructor(page: Page) {
        this.page = page

        this.sidebarMenu = this.page.locator('ul[role="menu"]')

        this.userManagermentMenu = this.page.getByRole('link', {name: 'Quản lý người dùng'})
        this.locationManagementMenu = this.page.getByRole('link', {name: 'Quản lý vị trí'})
        this.roomManagementMenu = this.page.getByRole('link', {name: 'Quản lý Room'})
        this.bookingManagementMenu = this.page.getByRole('link', {name: 'Quản lý Booking'})
    }


    
}