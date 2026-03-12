import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/admin-auth'

const adminTheme: CSSProperties = {
  ['--site-bg' as string]: '#0b1120',
  ['--site-bg-soft' as string]: '#10192c',
  ['--site-panel' as string]: '#ffffff',
  ['--site-panel-soft' as string]: '#f2f6fb',
  ['--site-border' as string]: '#d7e1ee',
  ['--site-border-soft' as string]: 'rgba(215, 225, 238, 0.72)',
  ['--site-text' as string]: '#0f172a',
  ['--site-muted' as string]: '#5f6b7c',
  ['--site-dark' as string]: '#0f172a',
  ['--site-dark-soft' as string]: '#1e293b',
  ['--site-on-dark' as string]: '#f8fafc',
  ['--site-primary' as string]: '#0ea5e9',
  ['--site-primary-strong' as string]: '#0284c7',
  ['--site-primary-soft' as string]: 'rgba(14, 165, 233, 0.12)',
  ['--site-primary-glow' as string]: 'rgba(14, 165, 233, 0.16)',
  ['--site-accent' as string]: '#22c55e',
  ['--site-accent-soft' as string]: 'rgba(34, 197, 94, 0.14)',
  ['--site-focus' as string]: '#38bdf8',
  ['--site-header' as string]: 'rgba(9, 15, 27, 0.94)',
  ['--site-topbar-bg' as string]: 'rgba(9, 15, 27, 0.98)',
  ['--site-topbar-text' as string]: '#f8fafc',
  ['--site-navbar-bg' as string]: 'rgba(9, 15, 27, 0.92)',
  ['--site-navbar-text' as string]: '#ffffff',
  ['--site-panel-alpha' as string]: 'rgba(255, 255, 255, 0.98)',
  ['--site-panel-alpha-strong' as string]: 'rgba(255, 255, 255, 0.96)',
  ['--site-selection-bg' as string]: '#0ea5e9',
  ['--site-selection-text' as string]: '#ffffff',
  ['--site-radius' as string]: '1.25rem',
  ['--site-card-shadow' as string]: '0 20px 45px -30px rgba(15, 23, 42, 0.32)',
  ['--site-card-shadow-hover' as string]: '0 30px 60px -28px rgba(15, 23, 42, 0.42)',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authenticated = await isAdminAuthenticated()

  return (
    <div style={adminTheme} className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,#07101f_0%,#0d1728_100%)] text-[color:var(--site-on-dark)]">
      <div className="border-b border-white/10 bg-[color:var(--site-header)]/92 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-300">TB Control Center</p>
            <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">Admin Platform</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href="/" className="rounded-full border border-white/12 px-4 py-2 text-white/82 transition-colors hover:border-cyan-300 hover:text-cyan-200">
              Website
            </Link>
            {authenticated ? (
              <>
                <Link href="/admin/cms" className="rounded-full border border-white/12 px-4 py-2 text-white/82 transition-colors hover:border-cyan-300 hover:text-cyan-200">
                  CMS
                </Link>
                <Link href="/admin/chat" className="rounded-full bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-400">
                  Chat Inbox
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
