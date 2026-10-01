import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;
    private readonly productName: Locator;
    private readonly productQuantity: Locator;
    private readonly productPrice: Locator;
    private readonly productTotal: Locator;
    private readonly cartTotal: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.cartHeading = page.locator('h1:has-text("Shopping Cart")');
        this.productName = page.locator('#shopping-cart tbody tr td.text-start a');
        this.productQuantity = page.locator('input[name="quantity"]');
        this.productPrice = page.locator('#shopping-cart tbody tr td.text-end').nth(0);
        this.productTotal = page.locator('#shopping-cart tbody tr td.text-end').nth(1);
        this.cartTotal = page.locator('#shopping-cart tfoot tr:has(strong:text-is("Total")) td.text-end:last-child');
    }

    /**
     * Get cart heading text
     * @returns Promise<string> - Cart heading text
     */
    async getCartHeadingText(): Promise<string> {
        try {
            return await this.cartHeading.textContent() || '';
        } catch (error) {
            console.log(`Error getting cart heading text: ${error}`);
            return '';
        }
    }

    /**
     * Get product name
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        try {
            return await this.productName.textContent() || '';
        } catch (error) {
            console.log(`Error getting product name: ${error}`);
            return '';
        }
    }

    /**
     * Get product quantity
     * @returns Promise<string> - Product quantity
     */
    async getProductQuantity(): Promise<string> {
        try {
            return await this.productQuantity.inputValue();
        } catch (error) {
            console.log(`Error getting product quantity: ${error}`);
            return '';
        }
    }

    /**
     * Get product unit price
     * @returns Promise<string> - Product unit price
     */
    async getProductPrice(): Promise<string> {
        try {
            return await this.productPrice.textContent() || '';
        } catch (error) {
            console.log(`Error getting product price: ${error}`);
            return '';
        }
    }

    /**
     * Get product line total
     * @returns Promise<string> - Product line total
     */
    async getProductTotal(): Promise<string> {
        try {
            return await this.productTotal.textContent() || '';
        } catch (error) {
            console.log(`Error getting product total: ${error}`);
            return '';
        }
    }

    /**
     * Get cart grand total
     * @returns Promise<string> - Cart grand total
     */
    async getCartTotal(): Promise<string> {
        try {
            return await this.cartTotal.textContent() || '';
        } catch (error) {
            console.log(`Error getting cart total: ${error}`);
            return '';
        }
    }

    /**
     * Verifies the cart page is displayed
     * @returns Promise<boolean> - true if the cart page is displayed
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            return await this.cartHeading.isVisible();
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }
}
