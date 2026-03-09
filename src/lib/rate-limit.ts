const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

type Entry = {
  count: number
  resetAt: number
}

const ipStore = new Map<string, Entry>()

export function checkRateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const current = ipStore.get(ip)

  if (!current || current.resetAt <= now) {
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, retryAfter: 0 }
  }

  if (current.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000)
    return { ok: false, retryAfter: Math.max(retryAfter, 1) }
  }

  current.count += 1
  return { ok: true, retryAfter: 0 }
}
