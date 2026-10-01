import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailsPage {
    private readonly page: Page;

    // Locators
    private readonly productName: Locator;
    private readonly productPrice: Locator;
    private readonly productQuantityInput: Locator;
    private readonly addToCartButton: Locator;
    private readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productName = page.locator('h1');
        this.productPrice = page.locator('.price-new');
        this.productQuantityInput = page.locator('input[name="quantity"]');
        this.addToCartButton = page.locator('#button-cart');
        this.successMessage = page.locator('.alert.alert-success');
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
     * Get product price
     * @returns Promise<string> - Product price
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
     * Set product quantity
     * @param quantity - Product quantity
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.productQuantityInput.fill(quantity);
    }

    /**
     * Add product to cart
     * @returns Promise<ProductDetailsPage> - Instance of the product details page
     */
    async addToCart(): Promise<ProductDetailsPage> {
        await this.addToCartButton.click();
        await this.successMessage.waitFor({ state: 'visible', timeout: 15000 });
        return this;
    }

    /**
     * Get success message
     * @returns Promise<string> - Success message text
     */
    async getSuccessMessage(): Promise<string> {
        try {
            return await this.successMessage.textContent() || '';
        } catch (error) {
            console.log(`Error getting success message: ${error}`);
            return '';
        }
    }

    /**
     * Verifies the product details page is displayed
     * @returns Promise<boolean> - true if the product details page is displayed
     */
    async isProductDetailsPageExists(): Promise<boolean> {
        try {
            return await this.productName.isVisible();
        } catch (error) {
            console.log(`Error checking product details page: ${error}`);
            return false;
        }
    }
}
