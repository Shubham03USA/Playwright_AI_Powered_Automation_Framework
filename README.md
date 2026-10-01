# Playwright AI-Powered Automation Framework

An end-to-end test automation framework built with **Playwright + TypeScript**, covering **Web UI**, **REST API**, and **Database** testing. It is designed to be driven by AI coding agents (Claude Code, GitHub Copilot, CommandCode, OpenCode, etc.) using prompt files and a shared implementation context.

## Features

- **Web UI automation** using the Page Object Model (POM) and custom fixtures.
- **API automation** using Playwright's `request` fixture with centralized route constants and JSON schema validation.
- **Database testing** support via a `mysql2`-based query client.
- **Data-driven testing** with JSON / CSV / Excel test-data files.
- **Dynamic data generation** with Faker.js and fixed test-data helpers.
- **Multiple reporters**: console (list), HTML, JUnit XML, a custom HTML reporter, and Allure.
- **Tag-based test selection** (`@master`, `@sanity`, `@regression`, `@api`, `@web`, `@end-to-end`, …).
- **CI/CD** with a GitHub Actions workflow.

## Tech Stack

| Area | Tool |
| --- | --- |
| Test runner | `@playwright/test` |
| Language | TypeScript (strict mode) |
| UI pattern | Page Object Model + custom fixtures |
| Data generation | `@faker-js/faker` |
| JSON schema validation | `ajv` |
| Data readers | `csv-parse`, `xlsx` |
| Date/time | `luxon` |
| Accessibility | `@axe-core/playwright` |
| DB client | `mysql2` |
| Reporting | HTML, JUnit, custom reporter, `allure-playwright` |
| Environment | `dotenv` |

## Prerequisites

- [Node.js](https://nodejs.org/) (latest LTS)
- A code editor (e.g. [VS Code](https://code.visualstudio.com/))
- (Optional) [Allure CLI](https://allurereport.org/docs/install/) to generate Allure reports
- (Optional) MySQL for DB-backed tests

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Shubham03USA/Playwright_AI_Powered_Automation_Framework.git
   cd Playwright_AI_Powered_Automation_Framework
   ```

2. Install dependencies and Playwright browsers. On Windows you can run the provided setup script:

   ```bat
   env_setup.bat
   ```

   Or install manually:

   ```bash
   npm install
   npx playwright install
   ```

3. Create your `.env` file from the values described in [Configuration](#configuration). The `.env` file is **not** committed (it is in `.gitignore`) because it may contain credentials.

## Configuration

All environment-specific values and secrets live in `.env` (loaded via `dotenv`). Key variables:

| Variable | Purpose |
| --- | --- |
| `APP_ENV` | Environment name (`qa` / `prod` / `dev`) |
| `WEB_APP_URL` | Web application under test (OpenCart) |
| `APP_EMAIL`, `APP_PASSWORD` | Web app login credentials |
| `PRODUCT_NAME`, `PRODUCT_QUANTITY`, `TOTAL_PRICE` | Known product used by web tests |
| `API_BASE_URL` | Base URL of the REST API under test (FakeStore) |
| `USERNAME`, `PASSWORD`, `USER_ID` | API auth credentials and default user ID |
| `PRODUCT_ID`, `CART_ID`, `LIMIT` | Default resource IDs and limit |
| `START_DATE`, `END_DATE` | Date range for cart filtering |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` | MySQL connection |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Admin app login credentials |

## Project Structure

```
├── .github/workflows/           # GitHub Actions CI workflow
├── api/
│   ├── endpoints/routes.ts      # Centralized API endpoint constants
│   └── schemas/                 # JSON schemas for response validation
├── fixtures/
│   └── pageFixtures.ts          # Custom fixtures exposing Page Objects
├── pages/                       # Page Object classes (POM)
├── prompts/                     # Test-scenario prompt files (AI generation drivers)
├── testdata/                    # JSON / CSV / XLSX test-data files
├── tests/
│   ├── api/                     # REST API tests
│   ├── web/                     # Web UI tests
│   └── db/                      # Database-backed tests
├── utils/                       # Reusable utilities (data generator, reader, DB client, reporter, helper)
├── docs/                        # Detailed step-by-step framework guide
├── playwright.config.ts         # Playwright runner configuration
├── tsconfig.json                # TypeScript configuration
├── env_setup.bat                # One-shot dependency installer (Windows)
└── playwright-mcp-context.md    # Shared implementation context for AI agents
```

## Running Tests

The default run targets tests tagged `@master` (see `grep` in `playwright.config.ts`).

```bash
# Run the default suite (@master)
npx playwright test

# Run API tests only
npx playwright test tests/api
npx playwright test --grep @api

# Run web tests only
npx playwright test --grep @web

# Run a specific tag
npx playwright test --grep @sanity
npx playwright test --grep @regression
npx playwright test --grep @end-to-end

# Run in headed mode
npx playwright test --headed
```

## Reports

The framework produces several reports on each run:

| Report | Location | Notes |
| --- | --- | --- |
| Playwright HTML | `reports/` | Generated by the `html` reporter |
| JUnit XML | `reports/results.xml` | CI integration |
| Custom HTML | `custom-report/` | Generated by `utils/CustomReporter.ts` |
| Allure results | `allure-results/` | Generated by the `allure-playwright` reporter |

View the Playwright HTML report:

```bash
npx playwright show-report reports
```

Generate and open the Allure report (requires the Allure CLI):

```bash
npx allure generate ./allure-results -o ./allure-report --clean
npx allure open ./allure-report
```

## CI / CD

The `.github/workflows/playwright.yml` workflow runs the test suite on every push and pull request to `main`/`master`, installing dependencies and browsers, then uploading the HTML report as an artifact.

## Extending the Framework

New test scenarios are described in prompt files under `prompts/` and implemented following the conventions in `playwright-mcp-context.md`. The general workflow:

1. Add any new API endpoints to `api/endpoints/routes.ts`.
2. Add/update JSON schemas under `api/schemas/` when schema validation is needed.
3. Add Page Object classes under `pages/` and wire them in `fixtures/pageFixtures.ts` for new UI flows.
4. Add reusable helpers to `utils/` only when no existing utility covers the need.
5. Write the actual test specs under `tests/`.

See `docs/Framework-Step-By-Step.md` for a full step-by-step guide to building the framework.
