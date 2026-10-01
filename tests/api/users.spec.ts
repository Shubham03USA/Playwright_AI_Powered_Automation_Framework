import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'User list should not be empty').toBeGreaterThan(0);

        console.log('✅ Retrieved all users');
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const user = await response.json();

        expect(user.id, 'Returned user ID should match the requested ID').toBe(USER_ID);
        expect(user.email, 'User should have an email').toBeTruthy();
        expect(user.username, 'User should have a username').toBeTruthy();

        console.log(`✅ Retrieved user with ID ${USER_ID}`);
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with Limit @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Returned count should match the requested limit ${LIMIT}`).toBe(LIMIT);

        console.log(`✅ Retrieved ${LIMIT} users`);
    });

    // ---------------------------------------------------------
    // GET - Sort Users Ascending
    // ---------------------------------------------------------

    test('GET - Sort Users Ascending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((u: { id: number }) => u.id);
        const sortedIds = [...ids].sort((a: number, b: number) => a - b);

        expect(ids, 'User IDs should be in ascending order').toEqual(sortedIds);

        console.log('✅ Users sorted ascending verified');
    });

    // ---------------------------------------------------------
    // GET - Sort Users Descending
    // ---------------------------------------------------------

    test('GET - Sort Users Descending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((u: { id: number }) => u.id);
        const sortedIds = [...ids].sort((a: number, b: number) => b - a);

        expect(ids, 'User IDs should be in descending order').toEqual(sortedIds);

        console.log('✅ Users sorted descending verified');
    });
});
