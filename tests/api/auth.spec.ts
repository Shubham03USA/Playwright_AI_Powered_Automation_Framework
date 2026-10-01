import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.FAKESTORE_USERNAME || '';
    const PASSWORD = process.env.FAKESTORE_PASSWORD || '';

    // ---------------------------------------------------------
    // POST - Login (Successful)
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD }
        });

        expect(response.status(), 'Expected status 201 for successful login').toBe(201);

        const responseBody = await response.json();

        expect(responseBody.token, 'Response should contain a token').toBeTruthy();
        expect(typeof responseBody.token, 'Token should be a string').toBe('string');
        expect(responseBody.token.length, 'Token should be a non-empty string').toBeGreaterThan(0);

        console.log('✅ Successful login verified');
    });

    // ---------------------------------------------------------
    // POST - Login (Invalid)
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: 'invalid_user', password: 'invalid_password' }
        });

        expect(response.status(), 'Expected status 401 for invalid login').toBe(401);

        const responseText = await response.text();

        expect(responseText, 'Expected the invalid login error message').toContain('username or password is incorrect');

        console.log('✅ Invalid login rejection verified');
    });
});
