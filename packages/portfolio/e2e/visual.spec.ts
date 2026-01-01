import { expect, test } from '@playwright/test'

test.describe('Visual regression tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
  })

  test('Hero section', async ({ page }) => {
    const hero = page.locator('#hero')
    await expect(hero).toBeVisible()
    await expect(hero).toHaveScreenshot('hero.png')
  })

  test('Projects section', async ({ page }) => {
    const projects = page.locator('#projects')
    await projects.scrollIntoViewIfNeeded()
    await expect(projects).toBeVisible()
    await expect(projects).toHaveScreenshot('projects.png')
  })

  test('Testimonials section', async ({ page }) => {
    const testimonials = page.locator('#testimonials')
    await testimonials.scrollIntoViewIfNeeded()
    await expect(testimonials).toBeVisible()
    await expect(testimonials).toHaveScreenshot('testimonials.png')
  })

  test('About section', async ({ page }) => {
    const about = page.locator('#about')
    await about.scrollIntoViewIfNeeded()
    await expect(about).toBeVisible()
    await expect(about).toHaveScreenshot('about.png')
  })

  test('Full page', async ({ page }) => {
    // Extra wait for full page stability (animations, lazy loading)
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('full-page.png', {
      fullPage: true,
      timeout: 30000,
    })
  })
})
