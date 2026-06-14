# Stripe + Billing Setup

The payment flow uses **Stripe Checkout** (hosted) for subscriptions and credit
top-ups, with **Firestore** storing each user's plan + credit balance.
Fulfillment happens via a Stripe webhook.

## 1. Environment variables

Add these to `.env.local` (and later to Vercel → Project → Settings → Environment
Variables). See `.env.example` for the full list.

| Var | Where to get it |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (test key while testing) |
| `STRIPE_WEBHOOK_SECRET` | From the webhook endpoint / `stripe listen` (step 4) |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Firebase Console → Project settings → Service accounts → Generate new private key (paste JSON as one line, or base64) |
| `NEXT_PUBLIC_APP_URL` | Your site URL (e.g. `https://wackbehavior.vercel.app`) |

## 2. Enable Firestore

Firebase Console → **Firestore Database** → Create database (production mode).
Recommended security rules (the server uses the Admin SDK and bypasses these;
the client only reads its own doc):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false; // only the server (Admin SDK) writes billing data
    }
    match /stripe_events/{id} {
      allow read, write: if false;
    }
  }
}
```

## 3. Create Stripe products + prices

With `STRIPE_SECRET_KEY` set in `.env.local`:

```
npm run setup:stripe
```

This idempotently creates the plan/top-up Products & Prices (by `lookup_key`)
and the `NEW24` promo code. Safe to re-run.

## 4. Webhook

**Production:** Stripe → Developers → Webhooks → Add endpoint
`https://<your-domain>/api/stripe/webhook`. Subscribe to:
`checkout.session.completed`, `invoice.paid`,
`customer.subscription.updated`, `customer.subscription.deleted`.
Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

**Local testing:**
```
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Use the `whsec_...` it prints as `STRIPE_WEBHOOK_SECRET`.

## 5. Test

`npm run dev`, sign in, go to `/dashboard/plans`, click Upgrade/Buy. Use Stripe
test card `4242 4242 4242 4242`, any future expiry/CVC. After payment, the
dashboard credit balance updates from the webhook.

## Known follow-up

Annual subscriptions are billed yearly, so `invoice.paid` only fires once a
year — credits are granted at purchase and on each yearly renewal. To honor
"credits renew monthly" for annual plans, add a monthly Vercel Cron that refills
active annual subscriptions. Monthly plans already refill correctly each cycle.
