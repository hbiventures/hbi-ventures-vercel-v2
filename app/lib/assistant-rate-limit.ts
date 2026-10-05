import { createHash } from "node:crypto";

const buckets = new Map<string, { count: number; expires: number }>();
function quotaCredentials() {
  // Keep each provider's URL/token together; never mix partial configurations.
  if (process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN };
  }
  return { url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN };
}

export function assistantQuotaConfigured() {
  const { url, token } = quotaCredentials();
  return Boolean(url && token);
}

/** Shared REST Redis when configured; fail closed in production rather than claim local quotas are global. */
export async function assistantRateLimit(request: Request, channel: "chat" | "voice") {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `hbi:${channel}:${createHash("sha256").update(ip).digest("hex")}:${Math.floor(Date.now() / 600000)}`;
  const maximum = channel === "voice" ? 3 : 20;
  const { url, token } = quotaCredentials();
  if (url && token) {
    try {
      const response = await fetch(url.replace(/\/$/, ""), { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(["EVAL", "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],660) end; return n", 1, key]), signal: AbortSignal.timeout(3000) });
      const result = await response.json();
      if (!response.ok || !Number.isInteger(result.result)) return "unavailable";
      return result.result > maximum ? "limited" : "ok";
    } catch { return "unavailable"; }
  }
  if (process.env.NODE_ENV === "production") return "unavailable";
  const now = Date.now();
  for (const [id, bucket] of buckets) if (bucket.expires < now) buckets.delete(id);
  if (buckets.size > 10000) return "limited";
  const bucket = buckets.get(key) ?? { count: 0, expires: now + 660000 };
  bucket.count++; buckets.set(key, bucket);
  return bucket.count > maximum ? "limited" : "ok";
}
