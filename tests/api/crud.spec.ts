import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

// -------------------------------------------------------------
// Products CRUD
// -------------------------------------------------------------

test.describe('Products CRUD Tests', () => {

    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = {
            title: 'Test Product',
            price: 109.95,
            description: 'A deterministic product used for CRUD testing',
            image: 'https://fakestoreapi.com/img/test-product.jpg',
            category: 'electronics'
        };

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status(), 'Expected status 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'Created product should return an ID').toBeTruthy();
        expect(created.title, 'Created product should return the submitted title').toBe(payload.title);
        expect(created.price, 'Created product should return the submitted price').toBe(payload.price);
        expect(created.category, 'Created product should return the submitted category').toBe(payload.category);

        console.log(`✅ Created product with ID ${created.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = {
            title: 'Updated Test Product',
            price: 149.99,
            description: 'Updated deterministic product for CRUD testing',
            image: 'https://fakestoreapi.com/img/test-product.jpg',
            category: 'electronics'
        };
        const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Expected status 200').toBe(200);

        const updated = await response.json();

        expect(updated.id, 'Returned product ID should match the requested ID').toBe(PRODUCT_ID);
        expect(updated.title, 'Response should contain the updated title').toBe(payload.title);
        expect(updated.price, 'Response should contain the updated price').toBe(payload.price);

        console.log(`✅ Updated product with ID ${PRODUCT_ID}`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted product should return its ID').toBe(PRODUCT_ID);

        console.log(`✅ Deleted product with ID ${PRODUCT_ID}`);
    });
});

// -------------------------------------------------------------
// Users CRUD
// -------------------------------------------------------------

test.describe('Users CRUD Tests', () => {

    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = {
            email: 'john.doe@example.com',
            username: 'johndoe',
            password: 'p@ssw0rd123',
            name: {
                firstname: 'John',
                lastname: 'Doe'
            },
            address: {
                city: 'kilcoole',
                street: '7835 new road',
                number: 3,
                zipcode: '12926-3874',
                geolocation: {
                    lat: '-37.3159',
                    long: '81.1496'
                }
            },
            phone: '1-570-236-7033'
        };

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status(), 'Expected status 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'Created user should return a generated ID').toBeTruthy();

        console.log(`✅ Created user with ID ${created.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const payload = {
            email: 'john.doe.updated@example.com',
            username: 'johndoe_updated',
            password: 'newp@ssw0rd123',
            name: {
                firstname: 'John',
                lastname: 'Doe'
            },
            address: {
                city: 'kilcoole',
                street: '7835 new road',
                number: 3,
                zipcode: '12926-3874',
                geolocation: {
                    lat: '-37.3159',
                    long: '81.1496'
                }
            },
            phone: '1-570-236-7033'
        };
        const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Expected status 200').toBe(200);

        const updated = await response.json();

        expect(updated.username, 'Response should contain the updated username').toBe(payload.username);

        console.log(`✅ Updated user with ID ${USER_ID}`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted user should return its ID').toBe(USER_ID);

        console.log(`✅ Deleted user with ID ${USER_ID}`);
    });
});

// -------------------------------------------------------------
// Carts CRUD
// -------------------------------------------------------------

test.describe('Carts CRUD Tests', () => {

    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = {
            userId: USER_ID,
            date: '2020-03-02',
            products: [
                { productId: 1, quantity: 4 },
                { productId: 2, quantity: 1 }
            ]
        };

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status(), 'Expected status 201').toBe(201);

        const created = await response.json();

        expect(created.id, 'Created cart should return an ID').toBeTruthy();
        expect(created.userId, 'Created cart should return the submitted user ID').toBe(USER_ID);
        expect(Array.isArray(created.products), 'Created cart should contain products').toBeTruthy();
        expect(created.products.length, 'Created cart should contain the submitted products').toBeGreaterThan(0);

        console.log(`✅ Created cart with ID ${created.id}`);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        // Change the first product's quantity from 4 to 10
        const payload = {
            userId: USER_ID,
            date: '2020-03-02',
            products: [
                { productId: 1, quantity: 10 }
            ]
        };
        const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.put(url, { data: payload });

        expect(response.status(), 'Expected status 200').toBe(200);

        const updated = await response.json();

        expect(updated.products[0].quantity, 'Response should reflect the updated product quantity')
            .toBe(payload.products[0].quantity);

        console.log(`✅ Updated cart with ID ${CART_ID}`);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`;

        const response = await request.delete(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const deleted = await response.json();

        expect(deleted.id, 'Deleted cart should return its ID').toBe(CART_ID);

        console.log(`✅ Deleted cart with ID ${CART_ID}`);
    });
});
