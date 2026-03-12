'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SiteContent } from '@/lib/site-data'
import { withSiteBasePath } from '@/lib/site-paths'

type ChatAuthor = 'visitor' | 'admin' | 'system'

type ChatMessage = {
  id: string
  author: ChatAuthor
  text: string
  createdAt: string
}

type ChatVisitor = {
  name: string
  email: string
  phone: string
}

type PublicConversation = {
  id: string
  status: 'open' | 'closed'
  unreadForVisitor: number
  visitor: ChatVisitor
  messages: ChatMessage[]
}

type ChatResponse = {
  conversationId: string
  token: string
  conversation: PublicConversation
}

type ChatSession = {
  conversationId: string
  token: string
}

type SiteChatWidgetProps = {
  company: SiteContent['company']
  variant?: 'launcher' | 'page'
}

const CHAT_ENDPOINT = withSiteBasePath('/api/chat/session')
const SESSION_STORAGE_KEY = 'tb_chat_session_v1'

const fallbackMessages: ChatMessage[] = [
  {
    id: 'welcome',
    author: 'system',
    text: 'Hej, er der noget vi kan hjælpe med?',
    createdAt: new Date(0).toISOString(),
  },
]

function readStoredSession(): ChatSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)

    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<ChatSession>

    if (typeof parsed.conversationId !== 'string' || typeof parsed.token !== 'string') {
      return null
    }

    return {
      conversationId: parsed.conversationId,
      token: parsed.token,
    }
  } catch {
    return null
  }
}

function writeStoredSession(session: ChatSession | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function formatMessageTime(value: string) {
  try {
    return new Intl.DateTimeFormat('da-DK', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

function getInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item.charAt(0).toUpperCase())
      .join('') || 'TB'
  )
}

export default function SiteChatWidget({ company, variant = 'launcher' }: SiteChatWidgetProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState<ChatSession | null>(null)
  const [conversation, setConversation] = useState<PublicConversation | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const isPage = variant === 'page'
  const hiddenOnRoute = !isPage && (pathname.startsWith('/admin') || pathname === '/chat')

  const messages = useMemo(() => conversation?.messages ?? fallbackMessages, [conversation])
  const unreadForVisitor = conversation?.unreadForVisitor ?? 0
  const sessionConversationId = session?.conversationId ?? ''
  const sessionToken = session?.token ?? ''

  useEffect(() => {
    if (hiddenOnRoute) {
      return
    }

    const stored = readStoredSession()

    if (stored) {
      setSession(stored)
    }
  }, [hiddenOnRoute])

  useEffect(() => {
    if (!conversation) {
      return
    }

    setName(conversation.visitor.name)
    setEmail(conversation.visitor.email)
    setPhone(conversation.visitor.phone)
  }, [conversation])

  useEffect(() => {
    if (!isPage && !open) {
      return
    }

    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [isPage, messages.length, open])

  const loadConversation = useCallback(async (activeSession: ChatSession) => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams({
        conversationId: activeSession.conversationId,
        token: activeSession.token,
      })

      const response = await fetch(`${CHAT_ENDPOINT}?${params.toString()}`, {
        cache: 'no-store',
      })

      if (response.status === 404) {
        writeStoredSession(null)
        setSession(null)
        setConversation(null)
        return
      }

      if (!response.ok) {
        throw new Error('Chatten kunne ikke opdateres')
      }

      const data = (await response.json()) as ChatResponse
      const nextSession = {
        conversationId: data.conversationId,
        token: data.token,
      }

      setConversation(data.conversation)
      setSession(nextSession)
      writeStoredSession(nextSession)
      setError(null)
    } catch {
      setError('Chatten kunne ikke opdateres lige nu.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!sessionConversationId || !sessionToken || hiddenOnRoute) {
      return
    }

    void loadConversation({
      conversationId: sessionConversationId,
      token: sessionToken,
    })
  }, [hiddenOnRoute, loadConversation, sessionConversationId, sessionToken])

  useEffect(() => {
    if (!sessionConversationId || !sessionToken || hiddenOnRoute) {
      return
    }

    const activeSession = {
      conversationId: sessionConversationId,
      token: sessionToken,
    }

    const interval = window.setInterval(() => {
      void loadConversation(activeSession)
    }, isPage ? 4000 : 12000)

    return () => window.clearInterval(interval)
  }, [hiddenOnRoute, isPage, loadConversation, sessionConversationId, sessionToken])

  if (hiddenOnRoute) {
    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      return
    }

    setIsSending(true)
    setError(null)

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: session?.conversationId,
          token: session?.token,
          name,
          email,
          phone,
          message: trimmedMessage,
        }),
      })

      if (!response.ok) {
        throw new Error('Beskeden kunne ikke sendes')
      }

      const data = (await response.json()) as ChatResponse
      const nextSession = {
        conversationId: data.conversationId,
        token: data.token,
      }

      setSession(nextSession)
      writeStoredSession(nextSession)
      setConversation(data.conversation)
      setMessage('')
      setError(null)
    } catch {
      setError('Beskeden kunne ikke sendes. Prøv igen om et øjeblik.')
    } finally {
      setIsSending(false)
    }
  }

  if (!isPage) {
    return (
      <div className="fixed bottom-20 right-4 z-[60] sm:bottom-24 sm:right-6">
        {open ? (
          <div className="w-[min(calc(100vw-1rem),24rem)] overflow-hidden rounded-[1.8rem] border border-[color:var(--site-border)] bg-white shadow-[0_32px_70px_-32px_rgba(31,37,29,0.55)] sm:w-[24rem]">
            <div className="relative overflow-hidden bg-[color:var(--site-primary)] px-4 py-4 text-white">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-sm font-bold">
                    {getInitials(company.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold">{company.name}</p>
                    <p className="text-xs text-white/82">Skriv direkte til os her.</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Luk chat"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/16"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-[24rem] min-h-[18rem] space-y-3 overflow-y-auto bg-[color:var(--site-panel)] px-4 py-4">
              {messages.map((item) => {
                const isVisitor = item.author === 'visitor'
                const isAdmin = item.author === 'admin'
                const bubbleClass = isVisitor
                  ? 'ml-auto bg-[color:var(--site-dark)] text-white'
                  : isAdmin
                    ? 'bg-[color:var(--site-primary)] text-white'
                    : 'bg-[color:var(--site-bg-soft)] text-[color:var(--site-text)] ring-1 ring-[color:var(--site-border)]'

                return (
                  <div key={item.id} className={`max-w-[85%] ${isVisitor ? 'ml-auto text-right' : ''}`}>
                    <div className={`rounded-[1.2rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleClass}`}>
                      {item.text}
                    </div>
                    <p className="mt-1 text-[11px] text-[color:var(--site-muted)]">{formatMessageTime(item.createdAt)}</p>
                  </div>
                )
              })}

              {isLoading ? <p className="text-xs text-[color:var(--site-muted)]">Opdaterer chat...</p> : null}
              <div ref={endRef} />
            </div>

            <div className="border-t border-[color:var(--site-border)] bg-white px-4 py-4">
              <button
                type="button"
                onClick={() => setDetailsOpen((current) => !current)}
                className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--site-primary-strong)]"
              >
                {detailsOpen ? 'Skjul kontaktinfo' : 'Tilføj kontaktinfo'}
              </button>

              {detailsOpen ? (
                <div className="mb-3 grid gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Navn"
                    className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2.5 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                  />
                  <div className="grid gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="E-mail"
                      className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2.5 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="Telefon"
                      className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2.5 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                    />
                  </div>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Skriv din besked her..."
                  rows={2}
                  className="min-h-[3.25rem] flex-1 resize-none rounded-[1.1rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-3 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                />
                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-white transition-colors hover:bg-[color:var(--site-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2 11 13" />
                    <path d="m22 2-7 20-4-9-9-4Z" />
                  </svg>
                </button>
              </form>

              {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative inline-flex items-center gap-3 rounded-full bg-[color:var(--site-primary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-18px_rgba(83,184,91,0.72)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--site-primary-strong)]"
          >
            {unreadForVisitor > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[color:var(--site-dark)] px-1.5 text-[11px] font-bold text-white">
                {unreadForVisitor}
              </span>
            ) : null}
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/16">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span>Chat med os</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <section className="section-block bg-[color:var(--site-bg-soft)]">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-eyebrow">Direkte chat</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.05em] text-[color:var(--site-text)]">
              Skriv direkte med os
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--site-muted)]">
              Dette er virksomhedens eget chatmodul. Din samtale bliver sendt direkte til vores interne inbox.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="btn-secondary">
              Til forsiden
            </Link>
            <Link href={company.phoneHref} className="btn-primary">
              Ring {company.phoneDisplay}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-white shadow-[0_32px_70px_-32px_rgba(31,37,29,0.35)]">
          <div className="relative overflow-hidden bg-[color:var(--site-primary)] px-5 py-5 text-white sm:px-6">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-sm font-bold">
                  {getInitials(company.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold">{company.name}</p>
                  <p className="text-sm text-white/82">Skriv din besked her. Vi svarer hurtigst muligt.</p>
                </div>
              </div>

              <div className="rounded-full border border-white/22 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
                {conversation?.status === 'closed' ? 'Samtalen er lukket' : 'Chat er åben'}
              </div>
            </div>
          </div>

          <div className="border-b border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.15rem] border border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)] px-3 py-2 text-xs text-[color:var(--site-muted)]">
              <span>{conversation ? 'Samtalen er aktiv' : 'Ny chat klar'}</span>
              <Link href="/privatlivspolitik" className="font-semibold text-[color:var(--site-primary-strong)] hover:text-[color:var(--site-primary)]">
                Privatlivspolitik
              </Link>
            </div>
          </div>

          <div className="max-h-[32rem] min-h-[24rem] space-y-3 overflow-y-auto bg-[color:var(--site-panel)] px-4 py-5 sm:px-6">
            {messages.map((item) => {
              const isVisitor = item.author === 'visitor'
              const isAdmin = item.author === 'admin'
              const bubbleClass = isVisitor
                ? 'ml-auto bg-[color:var(--site-dark)] text-white'
                : isAdmin
                  ? 'bg-[color:var(--site-primary)] text-white'
                  : 'bg-[color:var(--site-bg-soft)] text-[color:var(--site-text)] ring-1 ring-[color:var(--site-border)]'

              return (
                <div key={item.id} className={`max-w-[85%] ${isVisitor ? 'ml-auto text-right' : ''}`}>
                  <div className={`rounded-[1.2rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleClass}`}>
                    {item.text}
                  </div>
                  <p className="mt-1 text-[11px] text-[color:var(--site-muted)]">{formatMessageTime(item.createdAt)}</p>
                </div>
              )
            })}

            {isLoading ? <p className="text-xs text-[color:var(--site-muted)]">Opdaterer chat...</p> : null}
            <div ref={endRef} />
          </div>

          <div className="bg-white px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setDetailsOpen((current) => !current)}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--site-primary-strong)]"
            >
              {detailsOpen ? 'Skjul kontaktinfo' : 'Tilføj kontaktinfo'}
            </button>

            {detailsOpen ? (
              <div className="mb-3 grid gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Navn"
                  className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2.5 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                />
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="E-mail"
                    className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2.5 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Telefon"
                    className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2.5 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                  />
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Skriv din besked her..."
                rows={3}
                className="min-h-[4rem] flex-1 resize-none rounded-[1.1rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-3 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
              />
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-white transition-colors hover:bg-[color:var(--site-primary-strong)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 20-4-9-9-4Z" />
                </svg>
              </button>
            </form>

            {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}
