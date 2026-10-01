import dotenv from 'dotenv';
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { RegisterSuccessPage } from '../pages/RegisterSuccessPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';

dotenv.config();

// Define the custom fixtures type
type PageFixtures = {
    homePage: HomePage;
    loginPage: LoginPage;
    registerPage: RegisterPage;
    registerSuccessPage: RegisterSuccessPage;
    myAccountPage: MyAccountPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
};

// Extend the base test with our custom fixtures
export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(process.env.WEB_APP_URL || 'http://localhost/opencart/opencart-4.1.0.3/upload/');
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    registerSuccessPage: async ({ page }, use) => {
        await use(new RegisterSuccessPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
});

export { expect } from '@playwright/test';