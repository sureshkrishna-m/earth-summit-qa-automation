# Earth Summit QA Automation

Playwright + TypeScript test suite implementing the Page Object Model (POM) pattern with Playwright fixtures for easy, parallelizable test composition.

---

## 🚀 Quick start

1. Install dependencies
   - npm install
2. Install Playwright browsers
   - npx playwright install
3. Run tests
   - npm test
   - npm run test:headed (headed)
   - npm run test:ci (CI-friendly output)

> Tip: Use `npx playwright show-report` after a run to open the HTML report.

---

## 🔧 Project structure

- `tests/` — test suites organized by feature (navigation, event content, registration, responsive, media, partners, etc.)
- `fixtures/` — Playwright fixtures and exported `test` and `expect` helpers (`pageFixtures.ts`) supplying page objects
- `page-objects/` — Page Object Model classes (e.g., `HomePage`, `HyderabadPage`, `RegistrationForm`)
- `testdata/` — JSON fixtures for form data and invalid cases
- `playwright.config.ts` — Playwright configuration (browser projects, baseURL, reporters, capabilities)
- `.github/workflows/playwright.yml` — GitHub Actions workflow for running Playwright tests

---

## ✅ Test design & behaviors

- Tests use the POM pattern and Playwright fixtures to avoid manual page class instantiation in each test.
- The suite is configured to run tests in parallel (`fullyParallel: true` with fixture-safe design).
- Selectors favor stable locators: `getByRole`, `getByText`, and data attributes where available.
- Form submission / lead-generation tests are present but **skipped by default** to avoid accidental submissions. See the "Enabling sensitive tests" section below for details.

---

## 📋 Running tests locally

- Run the full suite (headless): `npm test`
- Run a single test file: `npx playwright test tests/navigation.spec.ts`
- Run with a specific project (e.g., chromium): `npx playwright test -p chromium`
- Run with headed mode and tracing: `npx playwright test --headed --trace=on`

Parallelism & workers: Playwright will use an intelligent default worker count. Control it with `-w` or the `workers` setting in `playwright.config.ts`.

---

## 🛡️ CI

A GitHub Actions workflow is included at `.github/workflows/playwright.yml` to run the test matrix in CI on pushes and PRs.

Recommended CI improvements (optional):
- Cache `node_modules` and Playwright browsers for faster runs
- Upload Playwright reports and test artifacts on failures
- Use matrix strategy for browser combinations when needed

---

## 🔒 Enabling sensitive tests (forms / submissions)

Registration and lead-generation tests are intentionally skipped by default to avoid sending real data. To enable them safely:

1. Create a test account / sandbox endpoint if available.
2. Add environment variables or a `.env.test` file (do *not* commit credentials).
3. Remove or change the `test.describe.skip(...)` wrapper in `tests/registration.spec.ts` and add a gating check (e.g., only run when `process.env.ENABLE_REG_TESTS === 'true'`).

Example guard:

```ts
if (!process.env.ENABLE_REG_TESTS) test.skip('Registration tests are disabled');
```

---

## 🧭 Playwright Planner & test generation

This project was scaffolded with a mix of hand-written tests and generated test ideas. You can use Playwright's Planner/Generator to capture additional scenarios and/or update tests. Generated tests should be reviewed and merged carefully.

---

## 🧰 Development tips

- Keep selectors stable: prefer `getByRole`, `text=`, or `data-testid` attributes
- Use fixtures for shared state and to create small, focused tests
- Keep POM methods expressive (e.g., `home.goto()`, `registration.fillForm(data)`) and avoid assertions inside POM methods unless they represent guaranteed page state

---

## 📦 Repo

Repository: https://github.com/sureshkrishna-m/earth-summit-qa-automation

---
