import { Locator, Page } from "@playwright/test";

export class LoginModal {
    readonly page: Page;

    // popup login
    readonly modal: Locator;

    readonly emailInput: Locator;

    readonly passwordInput: Locator;

    readonly loginBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.ant-modal-content');
        // cách 1: có id thì dùng #id
        this.emailInput = page.locator('#email');
        // cách 2: tìm theo attribute name
        // this.emailInput = page.locator('[name="email"]');
        this.passwordInput = page.locator('#password');
        // cách 2: getByRole
        // this.passwordInput = page.getByRole('textbox', { name: 'Password' });
         this.loginBtn = this.modal.getByRole('button', {name: 'Đăng nhập'});
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
        
    }

}