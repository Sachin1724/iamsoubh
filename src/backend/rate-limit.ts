import "server-only";

// ponytail: per-instance memory, so it slows one abuser rather than stopping a
// distributed flood; Vercel Firewall rate limiting covers that.
const buckets = new Map<string, number[]>();

/** True when `ip` has made more than `limit` calls to `name` inside `windowMs`. */
export function tooMany(name: string, ip: string, limit: number, windowMs = 600_000) {
  const key = `${name}:${ip}`;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 10_000) buckets.clear();
  return recent.length > limit;
}

export const clientIp = (req: Request) =>
  req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
