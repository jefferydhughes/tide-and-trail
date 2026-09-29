import { expect, test } from '@playwright/test'

// Square is mocked at the browser boundary. No customer or payment is created.
test.beforeEach(async ({ page }) => {
  await page.route('https://sandbox.web.squarecdn.com/v1/square.js', route => route.fulfill({
    contentType: 'application/javascript', body: `window.Square = { payments: () => ({ card: async () => ({ attach: async (element) => { element.textContent = 'Secure test card form'; }, tokenize: async (details) => details.billingContact && details.billingContact.email === 'hiker@example.ca' && details.billingContact.givenName === 'Test Hiker' ? ({ status: 'OK', token: 'sandbox-test-token' }) : ({ status: 'Invalid', errors: [{ field: 'verificationDetails.billingContact', type: 'VALIDATION_ERROR' }] }), destroy: async () => {} }) }) };`,
  }))
  await page.route('**/api/nomads/register', route => route.fulfill({ json: { ok: true, orderId: 'test-registration' } }))
  await page.goto('/nomads#register')
})

test('Not Now completes one free registration without card details', async ({ page }) => {
  await page.getByLabel('Name', { exact: true }).fill('Test Hiker')
  await page.getByLabel('Email', { exact: true }).fill('hiker@example.ca')
  await page.getByRole('button', { name: 'Not Now', exact: true }).click()
  await expect(page.getByLabel('Secure card details')).toHaveCount(0)
  const request = page.waitForRequest('**/api/nomads/register')
  await page.getByRole('button', { name: 'Complete free registration' }).click()
  expect((await request).postDataJSON()).toMatchObject({ name: 'Test Hiker', email: 'hiker@example.ca', amountCents: 0 })
  await expect(page.getByRole('status')).toContainText('Your registration is confirmed')
})

test('custom contribution submits contact details and card token together', async ({ page }) => {
  await page.getByLabel('Name', { exact: true }).fill('Test Hiker')
  await page.getByLabel('Email', { exact: true }).fill('hiker@example.ca')
  await page.getByLabel('Number of guests').selectOption('2')
  await page.getByRole('button', { name: 'Other amount' }).click()
  await page.getByLabel(/Your amount in CAD/).fill('1')
  await expect(page.getByLabel('Secure card details')).toBeVisible()
  const request = page.waitForRequest('**/api/nomads/register')
  await page.getByRole('button', { name: 'Register & contribute $1.00 CAD' }).click()
  expect((await request).postDataJSON()).toMatchObject({ name: 'Test Hiker', guests: 2, amountCents: 100, sourceId: 'sandbox-test-token' })
  await expect(page.getByRole('status')).toContainText('$1.00 CAD contribution')
})
