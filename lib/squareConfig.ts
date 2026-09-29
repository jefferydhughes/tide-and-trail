// Public SDK identifiers; access tokens stay server-side.
export function squareConfig() {
  const environment = process.env.VERCEL_ENV === 'production' ? 'production'
    : process.env.VERCEL_ENV === 'preview' ? 'sandbox'
    : process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
  const production = environment === 'production'
  return {
    environment,
    applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || (production ? 'sq0idp-8UyRmaeYeUtIGjyOzJxu5g' : 'sandbox-sq0idb-x5do4VWRyqfDy4Z0_OYG9w'),
    locationId: process.env.SQUARE_LOCATION_ID || (production ? 'LCR57XM7BE5N1' : 'LJET0JS7QNG1G7299'),
    apiUrl: production ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com',
  }
}
export function squareAccessToken() {
  return process.env.SQUARE_ACCESS_TOKEN || (squareConfig().environment === 'sandbox' ? process.env.Square_access_token : undefined)
}
export function nomadsSquareReady() {
  return Boolean(squareAccessToken()) && process.env.NOMADS_REGISTRATION_PAUSED !== 'true'
}
