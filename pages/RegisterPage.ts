import { Page, Locator, expect } from '@playwright/test';
import { RegisterSuccessPage } from './RegisterSuccessPage';

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly privacyPolicyCheckbox: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.firstNameInput = page.locator('input[name="firstname"]');
        this.lastNameInput = page.locator('input[name="lastname"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
        this.continueButton = page.locator('#form-register button[type="submit"]');
    }

    /**
     * Register a new customer
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email
     * @param password - Customer password
     * @returns Promise<RegisterSuccessPage> - Instance of the register success page
     */
    async register(firstName: string, lastName: string, email: string, password: string): Promise<RegisterSuccessPage> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.privacyPolicyCheckbox.check();
        await this.continueButton.click();
        await this.page.locator('h1:has-text("Your Account Has Been Created!")').waitFor({ state: 'visible', timeout: 15000 });
        return new RegisterSuccessPage(this.page);
    }

    /**
     * Verifies the register page is displayed
     * @returns Promise<boolean> - true if the register page is displayed
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            return await this.page.locator('#form-register').isVisible();
        } catch (error) {
            console.log(`Error checking register page: ${error}`);
            return false;
        }
    }
}
