import { Page, Locator, expect } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('#form-login button[type="submit"]');
        this.errorMessage = page.locator('.alert.alert-danger');
    }

    /**
     * Login with email and password
     * @param email - User email
     * @param password - User password
     * @returns Promise<MyAccountPage> - Instance of the my account page
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.page.locator('h1:has-text("My Account")').waitFor({ state: 'visible' });
        return new MyAccountPage(this.page);
    }

    /**
     * Get error message
     * @returns Promise<string> - Error message text
     */
    async getErrorMessage(): Promise<string> {
        try {
            return await this.errorMessage.textContent() || '';
        } catch (error) {
            console.log(`Error getting error message: ${error}`);
            return '';
        }
    }

    /**
     * Verifies the login page is displayed
     * @returns Promise<boolean> - true if the login page is displayed
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.page.locator('#form-login').isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }
}
