import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Cart list should not be empty').toBeGreaterThan(0);

        console.log('✅ Retrieved all carts');
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const cart = await response.json();

        expect(cart.id, 'Returned cart ID should match the requested ID').toBe(CART_ID);
        expect(Array.isArray(cart.products), 'Cart should contain a products list').toBeTruthy();

        console.log(`✅ Retrieved cart with ID ${CART_ID}`);
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by Date Range @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();

        for (const cart of responseBody) {
            const cartDate = new Date(cart.date);
            expect(cartDate.getTime(), 'Cart date should be on or after the start date')
                .toBeGreaterThanOrEqual(new Date(START_DATE).getTime());
            expect(cartDate.getTime(), 'Cart date should be on or before the end date')
                .toBeLessThanOrEqual(new Date(END_DATE).getTime());
        }

        console.log(`✅ Retrieved carts within ${START_DATE} and ${END_DATE}`);
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'User should have at least one cart').toBeGreaterThan(0);

        for (const cart of responseBody) {
            expect(cart.userId, 'Every cart should belong to the requested user').toBe(USER_ID);
        }

        console.log(`✅ Retrieved carts for user ${USER_ID}`);
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with Limit @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Returned count should match the requested limit ${LIMIT}`).toBe(LIMIT);

        console.log(`✅ Retrieved ${LIMIT} carts`);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Ascending
    // ---------------------------------------------------------

    test('GET - Sort Carts Ascending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((c: { id: number }) => c.id);
        const sortedIds = [...ids].sort((a: number, b: number) => a - b);

        expect(ids, 'Cart IDs should be in ascending order').toEqual(sortedIds);

        console.log('✅ Carts sorted ascending verified');
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Descending
    // ---------------------------------------------------------

    test('GET - Sort Carts Descending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((c: { id: number }) => c.id);
        const sortedIds = [...ids].sort((a: number, b: number) => b - a);

        expect(ids, 'Cart IDs should be in descending order').toEqual(sortedIds);

        console.log('✅ Carts sorted descending verified');
    });
});
