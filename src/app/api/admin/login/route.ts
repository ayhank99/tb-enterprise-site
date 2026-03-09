import { NextRequest, NextResponse } from 'next/server'
import { CMS_AUTH_COOKIE, createSessionValue, isCmsPasswordConfigured, verifyPassword } from '@/lib/admin-auth'

export const runtime = 'nodejs'

type LoginBody = {
  password?: string
}

export async function POST(request: NextRequest) {
  if (!isCmsPasswordConfigured()) {
    return NextResponse.json(
      {
        error: 'CMS-adgang er ikke konfigureret på serveren. Tilføj CMS_PASSWORD i Vercel Project Settings og deploy igen.',
      },
      { status: 500 }
    )
  }

  let body: LoginBody

  try {
    body = (await request.json()) as LoginBody
  } catch {
    return NextResponse.json({ error: 'Ugyldigt request format' }, { status: 400 })
  }

  const password = body.password?.trim() ?? ''

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Forkert adgangskode' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(CMS_AUTH_COOKIE, createSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  })

  return response
}
