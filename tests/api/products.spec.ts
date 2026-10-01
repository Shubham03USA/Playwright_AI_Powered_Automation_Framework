import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Product list should not be empty').toBeGreaterThan(0);

        for (const product of responseBody) {
            expect(product.id, 'Product should have an id').toBeTruthy();
            expect(product.title, 'Product should have a title').toBeTruthy();
            expect(product.price, 'Product should have a price').toBeTruthy();
            expect(product.category, 'Product should have a category').toBeTruthy();
            expect(product.image, 'Product should have an image').toBeTruthy();
        }

        console.log('✅ Retrieved all products');
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const product = await response.json();

        expect(product.id, 'Returned product ID should match the requested ID').toBe(PRODUCT_ID);
        expect(product.title, 'Product should have a title').toBeTruthy();
        expect(product.price, 'Product should have a price').toBeTruthy();
        expect(product.category, 'Product should have a category').toBeTruthy();
        expect(product.image, 'Product should have an image').toBeTruthy();

        console.log(`✅ Retrieved product with ID ${PRODUCT_ID}`);
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with Limit @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, `Returned count should match the requested limit ${LIMIT}`).toBe(LIMIT);

        console.log(`✅ Retrieved ${LIMIT} products`);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Ascending
    // ---------------------------------------------------------

    test('GET - Sort Products Ascending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((p: { id: number }) => p.id);
        const sortedIds = [...ids].sort((a: number, b: number) => a - b);

        expect(ids, 'Product IDs should be in ascending order').toEqual(sortedIds);

        console.log('✅ Products sorted ascending verified');
    });

    // ---------------------------------------------------------
    // GET - Sort Products Descending
    // ---------------------------------------------------------

    test('GET - Sort Products Descending @master @sanity @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((p: { id: number }) => p.id);
        const sortedIds = [...ids].sort((a: number, b: number) => b - a);

        expect(ids, 'Product IDs should be in descending order').toEqual(sortedIds);

        console.log('✅ Products sorted descending verified');
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All Product Categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Category list should not be empty').toBeGreaterThan(0);

        console.log('✅ Retrieved all product categories');
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by Category @master @sanity @api', async ({ request }) => {

        const category = 'electronics';
        const url = `${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category)}`;

        const response = await request.get(url);

        expect(response.status(), 'Expected status 200').toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'Response body should be an array').toBeTruthy();
        expect(responseBody.length, 'Products in the requested category should not be empty').toBeGreaterThan(0);

        for (const product of responseBody) {
            expect(product.category, 'Every product should belong to the requested category').toBe(category);
        }

        console.log(`✅ Retrieved products for category: ${category}`);
    });
});
