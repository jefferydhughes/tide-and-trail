// These IDs are sent to Square's browser SDK and are safe to include in source.
// The access token is never included here or sent to the browser.
const sandbox = {
  applicationId: 'sandbox-sq0idb-x5do4VWRyqfDy4Z0_OYG9w',
  locationId: 'LJET0JS7QNG1G7299',
  environment: 'sandbox' as const,
  apiUrl: 'https://connect.squareupsandbox.com/v2/payments',
}

const production = {
  applicationId: 'sq0idp-8UyRmaeYeUtIGjyOzJxu5g',
  locationId: 'LCR57XM7BE5N1',
  environment: 'production' as const,
  apiUrl: 'https://connect.squareup.com/v2/payments',
}

export function squareConfig() {
  return process.env.VERCEL_ENV === 'production' ? production : sandbox
}

export function squareAccessToken() {
  // Temporary compatibility with the name already saved in Vercel Preview.
  return process.env.SQUARE_ACCESS_TOKEN || process.env.Square_access_token
}
