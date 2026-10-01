import { Page, Locator, expect } from '@playwright/test';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.heading = page.locator('h1:has-text("My Account")');
    }

    /**
     * Get account heading text
     * @returns Promise<string> - Account heading text
     */
    async getHeadingText(): Promise<string> {
        try {
            return await this.heading.textContent() || '';
        } catch (error) {
            console.log(`Error getting heading text: ${error}`);
            return '';
        }
    }

    /**
     * Verifies the my account page is displayed
     * @returns Promise<boolean> - true if the my account page is displayed
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.heading.isVisible();
        } catch (error) {
            console.log(`Error checking my account page: ${error}`);
            return false;
        }
    }
}
