import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('JSON Schema Validation Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv({ allErrors: true });

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('Product Response Schema @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const product = await response.json();
        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(product);

        expect(isValid, `Product response does not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log('✅ Product response matches the expected schema');
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('User Response Schema @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const user = await response.json();
        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(user);

        expect(isValid, `User response does not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log('✅ User response matches the expected schema');
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('Cart Response Schema @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const cart = await response.json();
        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(schema);
        const isValid = validate(cart);

        expect(isValid, `Cart response does not match schema: ${JSON.stringify(validate.errors)}`).toBeTruthy();

        console.log('✅ Cart response matches the expected schema');
    });
});
