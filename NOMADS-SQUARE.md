# Nomads registration in Square

The `/nomads` form sends one checkout to `/api/nomads/register`. No Supabase read or write is involved in this flow. Other event registration workflows still use their existing backend. Existing Supabase rows are preserved; they are not automatically imported into Square.

## What appears in Square

- **Not Now:** customer-linked $0 CAD order, a “Not Now / Free registration” line item with guest quantity, and zero-total settlement through PayOrder. No card is requested and no card payment is created.
- **Contribution:** the same free-registration line item plus one optional-contribution line item for the entire party, with a completed CAD payment linked to the order and customer.
- Both orders have scheduled PICKUP fulfillment for trailhead check-in on October 24 at 8 AM Atlantic. This enables visibility in Square Order Manager; the fulfillment note explains that this is hike check-in, not collection at a shop. The customer profile and recipient contain the email, and the order records guest count, notes, and marketing preference. Full notes are on the registration line item; the shorter fulfillment note is capped at Square’s 500-character limit.
- Search for an existing customer by email before creating a profile; existing profiles are not overwritten.

Only settled registrations count. An order created before a failed/abandoned card payment is not a confirmed registration. Staff should check the payment/settlement state, not simply count customer profiles or open orders.

## Configuration

Set `SQUARE_ACCESS_TOKEN` in Vercel Preview to the Sandbox token and in Production to a separate Production token. Preview also accepts the existing `Square_access_token` alias. Production deliberately does not fall back to that alias.

Public application/location IDs default to the IDs from PR #5. Optional `NEXT_PUBLIC_SQUARE_APPLICATION_ID` and `SQUARE_LOCATION_ID` overrides must match the selected environment. Vercel selects Sandbox for Preview and Production for Production. Local development defaults to Sandbox, with `SQUARE_ENVIRONMENT=production` available only as an explicit local override. Verify the defaults belong to the account associated with each token.

The access token needs Customers read/write, Orders read/write and Payments write permissions. Without a token both free and paid registration are unavailable because Square is now the registration store.

## Launch operations

Capacity is managed manually, not atomically enforced. Count guests on settled Square registrations **plus existing Supabase signups** toward the 40-person limit. Set `NOMADS_REGISTRATION_PAUSED=true` and redeploy to close registration. Do not launch this version if automatic capacity enforcement is required. The October 23, 8 PM Atlantic cutoff remains enforced by the server.

Trailhead emails and newsletter follow-up remain manual. Recording an opt-in in an order does not subscribe someone to a mailing service. No automated confirmation email or tax receipt has been added.

## Retry behavior

The browser retains the submission details and identifiers during retries and locks changes once the request is sent. Square customer, order, and settlement calls have separate stable idempotency keys. Network uncertainty retries the same payment token and key; a definite card decline permits a new token against the same registration order. Do not start a second checkout after an uncertain outcome; retry the original form or check Square first. Reloading the page loses the in-memory retry context.

## Required Sandbox acceptance checks before launch

1. Choose Not Now, submit test contact details, and confirm the on-page registration reference and the settled $0 order/customer in Sandbox. Confirm there is no card charge.
2. Submit a $1 custom contribution using Square’s published test Visa, future expiry, CVV 111 and a valid postal code. Confirm the registration and contribution are on the same order and linked payment.
3. Confirm the guest count, notes, email, marketing preference, and check-in fulfillment are visible to staff in the Dashboard.
4. Test a card decline and retry. Confirm no success is shown before payment completion and no duplicate settled registration is created.
5. Test a lost response and retry without reloading. Confirm one order/payment.
6. Set the pause flag and verify both choices close. Verify the server cutoff.

Unit/component tests mock Square. The browser suite also exercises both checkout choices on desktop and mobile with mocked Square responses; neither substitutes for these live Sandbox acceptance checks. No live payment or external customer record is created by the automated tests.

References: [Pay for Orders](https://developer.squareup.com/docs/orders-api/pay-for-orders), [Create Customer](https://developer.squareup.com/reference/square/customers-api/create-customer), [Sandbox payments](https://developer.squareup.com/docs/devtools/sandbox/payments).
