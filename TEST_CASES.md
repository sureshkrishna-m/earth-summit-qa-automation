# Earth Summit — Test Cases (22 Scenarios)

This document lists the 22 test scenarios requested, with a short description, expected behaviour, the corresponding implemented test file (if present), and a compact Playwright/TypeScript test boilerplate for each.

> Note: Registration / lead-generation tests are present but **skipped by default** to avoid accidental submissions. Enable them only after providing permission or a test sandbox account.

---

## 1. Navigation & Header Functionality ✅

1. Verify Home Page Loading
   - Description: Ensure the home page loads successfully (HTTP 200) and hero/banner is visible.
   - File: `tests/navigation.spec.ts`
   - Boilerplate:

```ts
test('Home Page loads with HTTP 200 and hero visible', async ({ page, home }) => {
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await home.isHeroVisible();
});
```

2. Navigation Bar Integrity
   - Description: Click header links for Hyderabad, Gandhinagar, New Delhi and verify correct URLs.
   - File: `tests/navigation.spec.ts`

```ts
test('Navigation Bar links to city pages (Hyderabad, Gandhinagar, New Delhi)', async ({ page, home }) => {
  await home.goto();
  await home.clickHyderabad();
  await expect(page).toHaveURL(/\/hyderabad/i);
  // repeat for others
});
```

3. Dropdown Menu Interaction
   - Description: Hover/click "Agenda" or "Speakers" and ensure sub-options appear. Skip if not present.
   - File: `tests/navigation.spec.ts`

4. Logo Redirection
   - Description: Clicking the Earth Summit logo from a subpage redirects to `/`.
   - File: `tests/navigation.spec.ts`

```ts
test('Logo redirects to Home from subpages', async ({ page, home }) => {
  await page.goto('/partners');
  await home.clickLogo();
  await expect(page).toHaveURL(/\/$/);
});
```

---

## 2. Event Information & Content ✅

5. Multi-City Page Consistency
   - Description: City pages show correct venue metadata (e.g., HITEX Exhibition Centre for Hyderabad).
   - File: `tests/event.spec.ts`

6. Agenda Search/Filter
   - Description: If agenda search exists, search for "AgriTech" and validate results. Skips when control absent.
   - File: `tests/event.spec.ts`

7. Speaker Profile Modal
   - Description: Click speaker item and verify modal or details with bio and session info.
   - File: `tests/event.spec.ts`

8. Agenda PDF Download
   - Description: Verify "Download Agenda" link points to a PDF and the response is not 4xx/5xx.
   - File: `tests/event.spec.ts`

---

## 3. Registration & Lead Generation (Critical) ⚠️ (skipped by default)

9. Partner/Exhibitor Form Submission
   - Description: Fill "Partners with us" with valid data and verify success message.
   - File: `tests/registration.spec.ts` (skipped)

10. Form Field Validation (Mandatory)
    - Description: Submit without required fields and check for error messages.
    - File: `tests/registration.spec.ts` (skipped)

11. Email Format Validation
    - Description: Enter invalid email and verify validation blocks submission.
    - File: `tests/registration.spec.ts` (skipped)

12. Mobile Number Validation
    - Description: Ensure phone field validates numeric-only / correct length (e.g., 10 digits).
    - File: `tests/registration.spec.ts` (skipped)

_Private notes_: These tests are currently wrapped in `test.describe.skip()` to prevent accidental external submissions. To enable, implement a guard such as `if (!process.env.ENABLE_REG_TESTS) test.skip();` and run only with env var set.

---

## 4. User Experience & Responsiveness ✅

13. Responsive Design (Mobile)
    - Description: Emulate iPhone 13 and check hamburger menu appears and functions.
    - File: `tests/responsive.spec.ts`

14. Responsive Design (Tablet)
    - Description: Emulate iPad and verify agenda tracks collapse into single column.
    - File: `tests/responsive.spec.ts`

15. Internal Link Verification
    - Description: Crawl footer links (Terms, Privacy) and ensure no 404 responses.
    - File: `tests/responsive.spec.ts`

16. Social Media Redirection
    - Description: Verify social icons link to expected domains (LinkedIn/Twitter/X).
    - File: `tests/responsive.spec.ts`

---

## 5. Media & Dynamic Elements ✅

17. Gallery Image Loading
    - Description: `/gallery` should load at least 5 images visible in DOM.
    - File: `tests/media.spec.ts`

18. Video Embed Playback
    - Description: If videos present, ensure iframe `src` contains a valid YouTube/Vimeo URL.
    - File: `tests/media.spec.ts`

19. Lazy Loading Check
    - Description: Scroll through long pages (e.g., `/speakers`) and ensure images load when in viewport.
    - File: `tests/media.spec.ts`

---

## 6. Specialized Scenarios (Edge Cases) ✅

20. City-Specific Pricing Table
    - Description: On `/partners`, verify "Startup Street" pricing differs for single vs multi-summit packages.
    - File: `tests/partners.spec.ts`

21. Terms & Conditions Checkbox
    - Description: Confirm the T&C checkbox must be checked before submit becomes enabled or submission is blocked.
    - File: `tests/partners.spec.ts`

22. External Redirect Security
    - Description: Verify external organizer links (IAMAI, NABARD) open in a new tab (`target="_blank"`).
    - File: `tests/partners.spec.ts`

---

## Status Summary

| # | Scenario | Implemented | File |
|---:|---|:---:|---|
| 1 | Home page load & hero | ✅ | `tests/navigation.spec.ts` |
| 2 | Header nav links | ✅ | `tests/navigation.spec.ts` |
| 3 | Dropdown menu interaction | ✅ | `tests/navigation.spec.ts` |
| 4 | Logo redirection | ✅ | `tests/navigation.spec.ts` |
| 5 | City page metadata | ✅ | `tests/event.spec.ts` |
| 6 | Agenda search/filter | ✅ (skip if absent) | `tests/event.spec.ts` |
| 7 | Speaker modal | ✅ (skip if absent) | `tests/event.spec.ts` |
| 8 | Agenda PDF | ✅ | `tests/event.spec.ts` |
| 9 | Partner form submission | ⚠️ SKIPPED | `tests/registration.spec.ts` |
| 10 | Form required validation | ⚠️ SKIPPED | `tests/registration.spec.ts` |
| 11 | Email format validation | ⚠️ SKIPPED | `tests/registration.spec.ts` |
| 12 | Mobile number validation | ⚠️ SKIPPED | `tests/registration.spec.ts` |
| 13 | Mobile responsiveness | ✅ | `tests/responsive.spec.ts` |
| 14 | Tablet responsiveness | ✅ | `tests/responsive.spec.ts` |
| 15 | Footer link crawl | ✅ | `tests/responsive.spec.ts` |
| 16 | Social icons | ✅ | `tests/responsive.spec.ts` |
| 17 | Gallery images | ✅ | `tests/media.spec.ts` |
| 18 | Video embeds | ✅ (skip if absent) | `tests/media.spec.ts` |
| 19 | Lazy loading | ✅ | `tests/media.spec.ts` |
| 20 | City pricing table | ✅ | `tests/partners.spec.ts` |
| 21 | T&C checkbox | ✅ | `tests/partners.spec.ts` |
| 22 | External redirect new tab | ✅ | `tests/partners.spec.ts` |

---

## How to use this file

- Use the provided boilerplate snippets to create or extend tests.
- Keep POM methods expressive and assertion-free (assertions live in tests).
- For sensitive tests (registration), gate them with environment variables and use a test account.

---
