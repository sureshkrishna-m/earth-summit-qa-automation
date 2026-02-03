import { test, expect } from '../../fixtures/pageFixtures';

test('Planner: / - title present', async ({ page }) => {
  await page.goto('/');
  const resp = await page.goto('/');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /hyderabad - title present', async ({ page }) => {
  await page.goto('/hyderabad');
  const resp = await page.goto('/hyderabad');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /gandhinagar - title present', async ({ page }) => {
  await page.goto('/gandhinagar');
  const resp = await page.goto('/gandhinagar');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /new-delhi - title present', async ({ page }) => {
  await page.goto('/new-delhi');
  const resp = await page.goto('/new-delhi');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /agenda - title present', async ({ page }) => {
  await page.goto('/agenda');
  const resp = await page.goto('/agenda');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /speakers - title present', async ({ page }) => {
  await page.goto('/speakers');
  const resp = await page.goto('/speakers');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /partners - title present', async ({ page }) => {
  await page.goto('/partners');
  const resp = await page.goto('/partners');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

test('Planner: /gallery - title present', async ({ page }) => {
  await page.goto('/gallery');
  const resp = await page.goto('/gallery');
  expect(resp?.status()).toBeLessThan(400);
  await expect(page.locator('header, [role="banner"], .hero')).toBeVisible();
  const imgs = page.locator('img');
  expect(await imgs.count()).toBeGreaterThan(0);
});

