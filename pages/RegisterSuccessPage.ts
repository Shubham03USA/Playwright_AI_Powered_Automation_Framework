import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from './HomePage';

export class RegisterSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly successHeading: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.successHeading = page.locator('h1:has-text("Your Account Has Been Created!")');
        this.continueButton = page.locator('a:text-is("Continue")');
    }

    /**
     * Verifies the registration was successful
     * @returns Promise<boolean> - true if the success heading is displayed
     */
    async isRegistrationSuccessful(): Promise<boolean> {
        try {
            return await this.successHeading.isVisible();
        } catch (error) {
            console.log(`Error checking registration success: ${error}`);
            return false;
        }
    }

    /**
     * Click continue button
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.continueButton.click();
        return new HomePage(this.page);
    }
}
