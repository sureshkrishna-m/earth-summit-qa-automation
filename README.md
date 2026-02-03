# Earth Summit QA Automation

Playwright + TypeScript test suite (Page Object Model + Fixtures)

Quick start:

1. npm install
2. npx playwright install
3. npm test

Structure:
- tests/ - test suites organized by feature
- page-objects/ - POM classes
- testdata/ - JSON test data (forms, etc.)

Notes:
- Registration/form submission tests are included as skipped by default; they will not run until you give permission.
