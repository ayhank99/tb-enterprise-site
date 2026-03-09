import { NextRequest, NextResponse } from 'next/server'
import { quoteSchema } from '@/lib/quote-schema'
import { checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ugyldigt request format' }, { status: 400 })
  }

  const parsed = quoteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validering fejlede',
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  const { website, ...payload } = parsed.data

  if (website && website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  const clientIp = forwardedFor?.split(',')[0]?.trim() ?? 'unknown'
  const rateLimit = checkRateLimit(clientIp)

  if (!rateLimit.ok) {
    return NextResponse.json(
      {
        error: 'For mange foresporgsler. Prov igen senere.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
        },
      }
    )
  }

  console.log('[quote-request:local-dev]', {
    ...payload,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json(
    {
      ok: true,
      message: 'Udviklingsmiljo: formularen er valideret. Production skal bruge quote-handler.php til rigtig mail.',
    },
    { status: 200 }
  )
}
