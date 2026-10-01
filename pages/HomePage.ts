import { Page, Locator, expect } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { CartPage } from './CartPage';
import { ProductDetailsPage } from './ProductDetailsPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly accountMenuToggle: Locator;
    private readonly linkRegister: Locator;
    private readonly linkLogin: Locator;
    private readonly linkLogout: Locator;
    private readonly linkCart: Locator;
    private readonly searchBox: Locator;
    private readonly searchButton: Locator;
    private readonly logo: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.accountMenuToggle = page.locator('#top a[data-bs-toggle="dropdown"]:has-text("My Account")');
        this.linkRegister = page.locator('#top a:text-is("Register")');
        this.linkLogin = page.locator('#top a:text-is("Login")');
        this.linkLogout = page.locator('#top a:text-is("Logout")');
        this.linkCart = page.locator('a[title="Shopping Cart"]');
        this.searchBox = page.locator('input[name="search"]');
        this.searchButton = page.locator('form[action*="search.redirect"] button[type="submit"]');
        this.logo = page.locator('img[title="Your Store"]');
    }

    /**
     * Opens the My Account dropdown menu in the header (idempotent)
     */
    async openAccountMenu(): Promise<void> {
        const isOpen = (await this.linkRegister.isVisible().catch(() => false))
            || (await this.linkLogin.isVisible().catch(() => false))
            || (await this.linkLogout.isVisible().catch(() => false));
        if (!isOpen) {
            await this.accountMenuToggle.click();
        }
    }

    /**
     * Navigate to register page
     * @returns Promise<RegisterPage> - Instance of the register page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.openAccountMenu();
        await this.linkRegister.click();
        await this.page.locator('#form-register').waitFor({ state: 'visible' });
        return new RegisterPage(this.page);
    }

    /**
     * Navigate to login page from header
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.openAccountMenu();
        await this.linkLogin.click();
        await this.page.locator('#form-login').waitFor({ state: 'visible' });
        return new LoginPage(this.page);
    }

    /**
     * Log out from the header account dropdown
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickLogout(): Promise<HomePage> {
        await this.openAccountMenu();
        await this.linkLogout.click();
        await this.page.waitForURL(/account\/logout/);
        return this;
    }

    /**
     * Navigate to cart page
     * @returns Promise<CartPage> - Instance of the cart page
     */
    async clickCart(): Promise<CartPage> {
        await this.linkCart.click();
        await this.page.locator('h1:has-text("Shopping Cart")').waitFor({ state: 'visible' });
        return new CartPage(this.page);
    }

    /**
     * Search for a product
     * @param productName - Product name to search
     */
    async searchProduct(productName: string): Promise<void> {
        await this.searchBox.fill(productName);
        await this.searchButton.click();
        await this.page.locator('.product-thumb').first().waitFor({ state: 'visible' });
    }

    /**
     * Open a product details page from the search results
     * @param productName - Exact product name to open
     * @returns Promise<ProductDetailsPage> - Instance of the product details page
     */
    async clickProduct(productName: string): Promise<ProductDetailsPage> {
        await this.page.locator('.product-thumb h4').getByRole('link', { name: productName, exact: true }).click();
        await this.page.locator('#button-cart').waitFor({ state: 'visible' });
        return new ProductDetailsPage(this.page);
    }

    /**
     * Verifies the user is logged out (Login link is available in the account menu)
     * @returns Promise<boolean> - true if the user is logged out
     */
    async isLoggedOut(): Promise<boolean> {
        try {
            await this.openAccountMenu();
            return await this.linkLogin.isVisible();
        } catch (error) {
            console.log(`Error checking logout state: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the home page is displayed
     * @returns Promise<boolean> - true if the home page is displayed
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            return await this.logo.isVisible();
        } catch (error) {
            console.log(`Error checking home page: ${error}`);
            return false;
        }
    }
}
