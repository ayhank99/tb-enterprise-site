import { NextResponse } from 'next/server'
import { CMS_AUTH_COOKIE } from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(CMS_AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}

