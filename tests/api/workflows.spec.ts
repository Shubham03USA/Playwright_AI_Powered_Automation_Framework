import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('End-to-End API Workflows', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    // ---------------------------------------------------------
    // Product CRUD Workflow
    // ---------------------------------------------------------

    test('Product CRUD Workflow @master @regression @api @end-to-end', async ({ request }) => {

        const payload = {
            title: 'Workflow Product',
            price: 99.99,
            description: 'Deterministic product used for the CRUD workflow',
            image: 'https://fakestoreapi.com/img/workflow-product.jpg',
            category: 'electronics'
        };
        const updatedPayload = {
            title: 'Updated Workflow Product',
            price: 129.99,
            description: 'Updated deterministic product for the CRUD workflow',
            image: 'https://fakestoreapi.com/img/workflow-product.jpg',
            category: 'electronics'
        };

        let productId = 0;

        await test.step('1) Create a product', async () => {
            const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });
            expect(response.status(), 'Expected status 201').toBe(201);
            const created = await response.json();
            expect(created.id, 'Created product should return an ID').toBeTruthy();
            productId = created.id;
        });

        await test.step('2) Update the product', async () => {
            const url = `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`;
            const response = await request.put(url, { data: updatedPayload });
            expect(response.status(), 'Expected status 200').toBe(200);
            const updated = await response.json();
            expect(updated.id, 'Returned product ID should match').toBe(productId);
            expect(updated.title, 'Response should contain the updated title').toBe(updatedPayload.title);
        });

        await test.step('3) Delete the product', async () => {
            const url = `${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`;
            const response = await request.delete(url);
            expect(response.status(), 'Expected status 200').toBe(200);
        });

        console.log(`✅ Product CRUD workflow completed using ID ${productId}`);
    });

    // ---------------------------------------------------------
    // User CRUD Workflow
    // ---------------------------------------------------------

    test('User CRUD Workflow @master @regression @api @end-to-end', async ({ request }) => {

        const payload = {
            email: 'workflow.user@example.com',
            username: 'workflowuser',
            password: 'w0rkfl0w123',
            name: {
                firstname: 'Workflow',
                lastname: 'User'
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
        const updatedPayload = {
            email: 'workflow.user.updated@example.com',
            username: 'workflowuser_updated',
            password: 'n3ww0rkfl0w123',
            name: {
                firstname: 'Workflow',
                lastname: 'User'
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

        let userId = 0;

        await test.step('1) Create a user', async () => {
            const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });
            expect(response.status(), 'Expected status 201').toBe(201);
            const created = await response.json();
            expect(created.id, 'Created user should return an ID').toBeTruthy();
            userId = created.id;
        });

        await test.step('2) Update the user', async () => {
            const url = `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`;
            const response = await request.put(url, { data: updatedPayload });
            expect(response.status(), 'Expected status 200').toBe(200);
            const updated = await response.json();
            expect(updated.username, 'Response should contain the updated username').toBe(updatedPayload.username);
        });

        await test.step('3) Delete the user', async () => {
            const url = `${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`;
            const response = await request.delete(url);
            expect(response.status(), 'Expected status 200').toBe(200);
        });

        console.log(`✅ User CRUD workflow completed using ID ${userId}`);
    });

    // ---------------------------------------------------------
    // Cart CRUD Workflow
    // ---------------------------------------------------------

    test('Cart CRUD Workflow @master @regression @api @end-to-end', async ({ request }) => {

        const payload = {
            userId: USER_ID,
            date: '2020-03-02',
            products: [
                { productId: 1, quantity: 4 },
                { productId: 2, quantity: 1 }
            ]
        };
        const updatedPayload = {
            userId: USER_ID,
            date: '2020-03-02',
            products: [
                { productId: 1, quantity: 10 }
            ]
        };

        let cartId = 0;

        await test.step('1) Create a cart', async () => {
            const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });
            expect(response.status(), 'Expected status 201').toBe(201);
            const created = await response.json();
            expect(created.id, 'Created cart should return an ID').toBeTruthy();
            expect(created.userId, 'Created cart should return the submitted user ID').toBe(USER_ID);
            expect(Array.isArray(created.products), 'Created cart should contain products').toBeTruthy();
            cartId = created.id;
        });

        await test.step('2) Update the cart', async () => {
            const url = `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`;
            const response = await request.put(url, { data: updatedPayload });
            expect(response.status(), 'Expected status 200').toBe(200);
            const updated = await response.json();
            expect(updated.products[0].quantity, 'Response should reflect the updated product quantity')
                .toBe(updatedPayload.products[0].quantity);
        });

        await test.step('3) Delete the cart', async () => {
            const url = `${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`;
            const response = await request.delete(url);
            expect(response.status(), 'Expected status 200').toBe(200);
        });

        console.log(`✅ Cart CRUD workflow completed using ID ${cartId}`);
    });
});
