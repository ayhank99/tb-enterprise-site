'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { withSiteBasePath } from '@/lib/site-paths'

const ADMIN_LOGIN_ENDPOINT = withSiteBasePath('/api/admin/login')

export default function AdminLoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const showEnvironmentHint = Boolean(error?.includes('CMS_PASSWORD'))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(ADMIN_LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        setError(data.error ?? 'Login fejlede')
        setIsSubmitting(false)
        return
      }

      router.push('/admin/cms')
      router.refresh()
    } catch {
      setError('Login fejlede')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel-card mx-auto max-w-md space-y-5 p-8">
      <div>
        <p className="section-eyebrow">Kunde adgang</p>
        <h1 className="mt-2 font-display text-3xl">Admin login</h1>
      </div>

      {showEnvironmentHint ? (
        <p className="rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Hvis login ikke virker på Vercel, skal `CMS_PASSWORD` være oprettet i projektets Environment Variables.
        </p>
      ) : null}

      <div>
        <label htmlFor="password" className="form-label">
          Adgangskode
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-4 py-3"
          autoComplete="current-password"
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
        {isSubmitting ? 'Logger ind...' : 'Log ind'}
      </button>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </form>
  )
}
