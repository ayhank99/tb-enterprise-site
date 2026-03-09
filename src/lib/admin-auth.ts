import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const CMS_AUTH_COOKIE = 'tb_cms_auth'
const DEFAULT_PASSWORD = 'tbgruppen-2026-change-this'

function getConfiguredPassword() {
  const configuredPassword = process.env.CMS_PASSWORD?.trim()

  if (configuredPassword) {
    return configuredPassword
  }

  return process.env.NODE_ENV === 'production' ? '' : DEFAULT_PASSWORD
}

export function isCmsPasswordConfigured() {
  return getConfiguredPassword().length > 0
}

function createDigest(input: string) {
  return createHash('sha256').update(input).digest('hex')
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)

  if (left.length !== right.length) {
    return false
  }

  return timingSafeEqual(left, right)
}

export function createSessionValue() {
  return createDigest(`cms:${getConfiguredPassword()}`)
}

export function verifyPassword(password: string) {
  const configuredPassword = getConfiguredPassword()

  if (!configuredPassword) {
    return false
  }

  return safeCompare(createDigest(password), createDigest(configuredPassword))
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get(CMS_AUTH_COOKIE)?.value

  if (!session) {
    return false
  }

  return safeCompare(session, createSessionValue())
}
