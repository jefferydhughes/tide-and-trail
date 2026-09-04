import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/',
  '/about',
  '/adventure-board/new',
  '/community',
  '/drop',
  '/events',
  '/gear-conditions',
  '/gear-room',
  '/membership',
  '/newsletter',
  '/nomads',
  '/privacy',
  '/rent',
  '/rent/request?kit=Footpath%20Essential',
  '/repair',
  '/sell',
  '/shop',
  '/terms',
]

test('all public pages render without broken assets, console errors, or horizontal overflow', async ({ page }) => {
  test.setTimeout(90_000)
  const consoleErrors: string[] = []
  const failedResources: string[] = []

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('response', response => {
    const type = response.request().resourceType()
    if (response.status() >= 400 && ['document', 'image', 'stylesheet', 'script', 'font'].includes(type)) {
      failedResources.push(`${response.status()} ${response.url()}`)
    }
  })

  for (const route of publicRoutes) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBeLessThan(400)
    await expect(page.locator('h1'), `${route} should have a visible page heading`).toBeVisible()
    const viewport = await page.locator('body').evaluate(element => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(viewport.scrollWidth, `${route} should not overflow its ${viewport.clientWidth}px viewport`).toBeLessThanOrEqual(viewport.clientWidth)
  }

  expect(failedResources).toEqual([])
  expect(consoleErrors.filter(error => !error.includes('status of 401 (Unauthorized)'))).toEqual([])
})

for (const route of ['/', '/sell', '/shop', '/nomads', '/gear-room']) {
  test(`visual evidence ${route}`, async ({ page }, testInfo) => {
    await page.goto(route)
    await expect(page.locator('h1')).toBeVisible()
    const name = route === '/' ? 'home' : route.slice(1)
    await page.screenshot({
      path: `.gstack/qa-reports/screenshots/${name}-${testInfo.project.name}.png`,
      fullPage: true,
    })
  })
}
