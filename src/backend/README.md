# src/backend

Server-only code. Every file imports `server-only`, so pulling one into a client
component is a build error, not a leaked secret.

| File | Holds |
| --- | --- |
| `clients.ts` | Razorpay client, server-side `PRICING`, `forceSoldOut`, `alert` |
| `orders.ts` | Paid orders and the box count, read from Razorpay (cached 60s); admin CSV |
| `magic-address.ts` | Maps a Razorpay Magic Checkout order to our `PaidOrder` |
| `email.ts` | Order and admin email templates, sent through Resend |

Route handlers in `src/app/api/**` stay thin: parse the request, call in here,
return a response. They are the only way the browser reaches this folder.

## Layout of `src/`

| Folder | Role |
| --- | --- |
| `app/` | Next.js routing: pages and `api/` routes |
| `frontend/` | Everything that runs in the browser: `components/`, `data/`, `lib/` |
| `backend/` | This folder |
| `config/` | `site-config.ts`, shared by both sides (prices, copy, flags) |

`frontend/` must never import `backend/`; ESLint enforces it.
