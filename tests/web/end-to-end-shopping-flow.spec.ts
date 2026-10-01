import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @sanity @end-to-end', async ({ homePage, registerPage, registerSuccessPage, loginPage, myAccountPage, productDetailsPage, cartPage }) => {
    // Generate unique customer data once, reused for registration and login
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const password = RandomDataUtil.getPassword();

    const product = Helper.getProductDetails();
    const productName = product.productName;
    const productQuantity = product.productQuantity;
    const totalPrice = product.totalPrice;

    // Step 1: Open the application
    await test.step('1) Open the application', async () => {
        const isHomePage = await homePage.isHomePageExists();
        expect(isHomePage).toBeTruthy();
        console.log('✅ Home page loaded successfully');
    });

    // Step 2: Register a new customer using dynamically generated unique data
    await test.step('2) Register a new customer', async () => {
        await homePage.clickRegister();
        await registerPage.register(firstName, lastName, email, password);
        console.log('✅ Registration submitted successfully');
    });

    // Step 3: Verify successful registration
    await test.step('3) Verify successful registration', async () => {
        const isRegistered = await registerSuccessPage.isRegistrationSuccessful();
        expect(isRegistered).toBeTruthy();
        console.log('✅ Registration verified successfully');
    });

    // Step 4: Log out
    await test.step('4) Log out', async () => {
        await homePage.clickLogout();
        const isLoggedOut = await homePage.isLoggedOut();
        expect(isLoggedOut).toBeTruthy();
        console.log('✅ Logout completed successfully');
    });

    // Step 5: Log in again using the newly created credentials
    await test.step('5) Log in with the new credentials', async () => {
        await homePage.clickLogin();
        await loginPage.login(email, password);
        const isLoggedIn = await myAccountPage.isMyAccountPageExists();
        expect(isLoggedIn).toBeTruthy();
        console.log('✅ Login completed successfully');
    });

    // Step 6: Verify successful authentication
    await test.step('6) Verify successful authentication', async () => {
        const headingText = await myAccountPage.getHeadingText();
        expect(headingText).toContain('My Account');
        console.log('✅ Authentication verified successfully');
    });

    // Step 7: Search for a known product
    await test.step('7) Search for a known product', async () => {
        await homePage.searchProduct(productName);
        console.log(`✅ Product search completed for: ${productName}`);
    });

    // Step 8: Open the product details page
    await test.step('8) Open the product details page', async () => {
        await homePage.clickProduct(productName);
        const productDetailsPageExists = await productDetailsPage.isProductDetailsPageExists();
        expect(productDetailsPageExists).toBeTruthy();
        console.log('✅ Product details page opened successfully');
    });

    // Step 9: Add the product to the cart
    await test.step('9) Add the product to the cart', async () => {
        await productDetailsPage.setQuantity(productQuantity);
        await productDetailsPage.addToCart();

        const successMessage = await productDetailsPage.getSuccessMessage();
        expect(successMessage).toContain(`You have added ${productName} to your shopping cart!`);
        console.log('✅ Product added to cart successfully');
    });

    // Step 10: Open the shopping cart
    await test.step('10) Open the shopping cart', async () => {
        await homePage.clickCart();
        const cartPageExists = await cartPage.isCartPageExists();
        expect(cartPageExists).toBeTruthy();
        console.log('✅ Shopping cart opened successfully');
    });

    // Step 11: Verify the correct product
    await test.step('11) Verify the correct product', async () => {
        const cartProductName = await cartPage.getProductName();
        expect(cartProductName).toContain(productName);
        console.log('✅ Product verification successful');
    });

    // Step 12: Verify the quantity
    await test.step('12) Verify the quantity', async () => {
        const cartProductQuantity = await cartPage.getProductQuantity();
        expect(cartProductQuantity).toBe(productQuantity);
        console.log('✅ Quantity verification successful');
    });

    // Step 13: Verify the product price
    await test.step('13) Verify the product price', async () => {
        const cartProductPrice = await cartPage.getProductPrice();
        expect(cartProductPrice).toContain(totalPrice);
        console.log('✅ Product price verification successful');
    });

    // Step 14: Verify the applicable cart total
    await test.step('14) Verify the applicable cart total', async () => {
        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toContain(totalPrice);
        console.log('✅ Cart total verification successful');
    });

    // Step 15: Verify that the complete journey finishes without errors
    await test.step('15) Verify complete journey success', async () => {
        console.log('✅ ✔️ End-to-End Shopping Flow completed successfully!');
    });
});
