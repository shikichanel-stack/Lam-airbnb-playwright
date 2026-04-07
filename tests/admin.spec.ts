import test, { expect } from "@playwright/test";
import { HomePage } from "../page/homePage";
import { LoginModal } from "../page/loginModal";
import { adminAccount } from "../data/account";
import { AdminPage } from "../page/AdminPage";

test.describe('Admin page', () => {

    // beforeEach
    test.beforeEach(async ({page}) => {

        // 1. mở trang chủ
        const homePage = new HomePage(page)
        await homePage.open()

        // 2. mở popup login
        await homePage.openLoginModal()

        // 3. login với account admin
        const loginModal = new LoginModal(page)
        await loginModal.login(adminAccount.email, adminAccount.password)

        // 4. mở menu user và click vào menu To page admin
        await homePage.avatarBtn.click()
        const adminMenuItem = page.getByRole('link', {name: 'To page admin'})
        await adminMenuItem.click()

    })

    test("test case 1: kiểm tra URL sau khi vào trang admind", async ({page}) => {
        const adminPage = new AdminPage(page)

        // xác nhận URL sau khi vào trang admin
        await expect(page).toHaveURL(/\/admin$/) // URL phải kết thúc bằng /admin
        await expect(adminPage.userManagermentMenu).toBeVisible()
        await expect(adminPage.locationManagementMenu).toBeVisible()
        await expect(adminPage.roomManagementMenu).toBeVisible()
        await expect(adminPage.bookingManagementMenu).toBeVisible()
        
    })

})
