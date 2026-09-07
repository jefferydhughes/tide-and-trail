import { expect, test } from '@playwright/test'
test('homepage serves HTML and React Server Component navigation requests', async ({ request }) => {
  const document = await request.get('/')
  expect(document.status()).toBe(200)
  expect(await document.text()).toContain('Good gear.')

  const navigation = await request.get('/?_rsc=homepage-regression', {
    headers: { RSC: '1' },
  })
  expect(navigation.status()).toBe(200)
  expect(navigation.headers()['content-type']).toContain('text/x-component')
  expect(await navigation.text()).toContain('Good gear.')
})
test('primary navigation reaches core MVP routes',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{level:1,name:'Good gear. Another adventure.'})).toBeVisible();for(const path of ['/shop','/sell','/rent','/events','/nomads','/community']){await page.goto(path);await expect(page.locator('h1')).toBeVisible();expect(await page.locator('body').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)}})
test('mobile menu exposes core navigation',async({page,isMobile})=>{test.skip(!isMobile);await page.goto('/');await page.getByRole('button',{name:'Menu'}).click();const header=page.getByRole('banner');await expect(header.getByRole('link',{name:'Nomads Café'})).toBeVisible();await header.getByRole('link',{name:'Sell Gear'}).click();await expect(page).toHaveURL(/\/sell$/)})
test('rental CTA opens a working request form',async({page})=>{await page.goto('/rent');await page.getByRole('link',{name:'Reserve this kit'}).first().click();await expect(page.getByRole('heading',{name:'Reserve your trail kit.'})).toBeVisible();await expect(page.getByText('Footpath Essential',{exact:true})).toBeVisible()})
