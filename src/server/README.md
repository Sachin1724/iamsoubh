# src/server — backend

Server-only code. Every file here imports `server-only`, so importing one from a
client component is a build error rather than a leaked service-role key.

| File | Holds |
| --- | --- |
| `clients.ts` | Supabase + Razorpay clients, server-side `PRICING`, `forceSoldOut`, `alert` |
| `email.ts` | Order email templates and the send-once-per-kind guard |
| `shiprocket.ts` | Shiprocket integration |

Route handlers in `src/app/api/**` stay thin: parse the request, call in here,
return a response. The database contract lives in `supabase/schema.sql`.

`src/lib` is the other half: code that is safe in the browser (`track`, `utm`,
`useStock`, `utils`).
