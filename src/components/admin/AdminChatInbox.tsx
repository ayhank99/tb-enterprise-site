'use client'

import Link from 'next/link'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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

type AdminConversation = {
  id: string
  status: 'open' | 'closed'
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  unreadForAdmin: number
  unreadForVisitor: number
  visitor: ChatVisitor
  messages: ChatMessage[]
}

type AdminChatInboxProps = {
  initialConversations: AdminConversation[]
}

const ADMIN_CHAT_ENDPOINT = withSiteBasePath('/api/admin/chat')
const ADMIN_LOGOUT_ENDPOINT = withSiteBasePath('/api/admin/logout')

function formatStamp(value: string) {
  try {
    return new Intl.DateTimeFormat('da-DK', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getConversationTitle(conversation: AdminConversation) {
  if (conversation.visitor.name) {
    return conversation.visitor.name
  }

  if (conversation.visitor.email) {
    return conversation.visitor.email
  }

  if (conversation.visitor.phone) {
    return conversation.visitor.phone
  }

  return 'Ny besøgende'
}

export default function AdminChatInbox({ initialConversations }: AdminChatInboxProps) {
  const router = useRouter()
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0] ?? null,
    [conversations, selectedId]
  )
  const selectedConversationId = selectedConversation?.id ?? ''
  const selectedConversationUnread = selectedConversation?.unreadForAdmin ?? 0

  useEffect(() => {
    if (!selectedConversation && conversations[0]) {
      setSelectedId(conversations[0].id)
      return
    }

    if (selectedConversation) {
      setSelectedId(selectedConversation.id)
    }
  }, [conversations, selectedConversation])

  const fetchConversations = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const response = await fetch(ADMIN_CHAT_ENDPOINT, { cache: 'no-store' })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      if (!response.ok) {
        throw new Error('Chat inbox kunne ikke opdateres')
      }

      const data = (await response.json()) as { conversations: AdminConversation[] }
      setConversations(data.conversations)
      setError(null)
    } catch {
      setError('Chat inbox kunne ikke opdateres.')
    } finally {
      setIsRefreshing(false)
    }
  }, [router])

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchConversations()
    }, 4000)

    return () => window.clearInterval(interval)
  }, [fetchConversations])

  useEffect(() => {
    if (!selectedConversationId || selectedConversationUnread === 0) {
      return
    }

    void (async () => {
      try {
        await fetch(ADMIN_CHAT_ENDPOINT, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: selectedConversationId,
            markRead: true,
          }),
        })
      } catch {
        return
      }
    })()
  }, [selectedConversationId, selectedConversationUnread])

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedConversation || !message.trim()) {
      return
    }

    setIsSending(true)

    try {
      const response = await fetch(ADMIN_CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          message,
        }),
      })

      if (response.status === 401) {
        router.push('/admin')
        return
      }

      if (!response.ok) {
        throw new Error('Svar kunne ikke sendes')
      }

      const data = (await response.json()) as { conversation: AdminConversation }
      setConversations((current) => {
        const remaining = current.filter((item) => item.id !== data.conversation.id)
        return [data.conversation, ...remaining]
      })
      setSelectedId(data.conversation.id)
      setMessage('')
      setError(null)
    } catch {
      setError('Svar kunne ikke sendes.')
    } finally {
      setIsSending(false)
    }
  }

  async function handleStatusToggle() {
    if (!selectedConversation) {
      return
    }

    const nextStatus = selectedConversation.status === 'open' ? 'closed' : 'open'

    try {
      const response = await fetch(ADMIN_CHAT_ENDPOINT, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          status: nextStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Status kunne ikke opdateres')
      }

      const data = (await response.json()) as { conversation: AdminConversation }
      setConversations((current) =>
        current.map((conversation) => (conversation.id === data.conversation.id ? data.conversation : conversation))
      )
    } catch {
      setError('Status kunne ikke opdateres.')
    }
  }

  async function handleLogout() {
    try {
      await fetch(ADMIN_LOGOUT_ENDPOINT, { method: 'POST' })
    } finally {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <section className="section-soft py-10">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="panel-card mb-6 space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-eyebrow">Eget chatmodul</p>
              <h1 className="mt-1 font-display text-3xl text-[color:var(--site-text)]">Chat inbox</h1>
              <p className="mt-2 text-sm text-[color:var(--site-muted)]">
                Her håndterer du website-chatten uden tredjepartsleverandører.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/cms" className="btn-secondary">
                Til CMS
              </Link>
              <button type="button" onClick={() => void fetchConversations()} className="btn-secondary">
                {isRefreshing ? 'Opdaterer...' : 'Opdater'}
              </button>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                Log ud
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="panel-card overflow-hidden p-0">
            <div className="border-b border-[color:var(--site-border)] px-5 py-4">
              <p className="text-sm font-semibold text-[color:var(--site-text)]">Samtaler ({conversations.length})</p>
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="px-5 py-6 text-sm text-[color:var(--site-muted)]">Ingen chats endnu.</div>
              ) : (
                conversations.map((conversation) => {
                  const latestMessage = conversation.messages[conversation.messages.length - 1]
                  const active = conversation.id === selectedConversation?.id

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => setSelectedId(conversation.id)}
                      className={`flex w-full flex-col gap-2 border-b border-[color:var(--site-border)] px-5 py-4 text-left transition-colors ${
                        active ? 'bg-[color:var(--site-primary-soft)]' : 'bg-white hover:bg-[color:var(--site-panel-soft)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[color:var(--site-text)]">{getConversationTitle(conversation)}</p>
                          <p className="mt-1 text-xs text-[color:var(--site-muted)]">{formatStamp(conversation.lastMessageAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                              conversation.status === 'open'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {conversation.status === 'open' ? 'Open' : 'Closed'}
                          </span>
                          {conversation.unreadForAdmin > 0 ? (
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[color:var(--site-primary)] px-1.5 text-[11px] font-bold text-white">
                              {conversation.unreadForAdmin}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <p className="line-clamp-2 text-xs text-[color:var(--site-muted)]">{latestMessage?.text ?? 'Ingen beskeder endnu.'}</p>
                    </button>
                  )
                })
              )}
            </div>
          </aside>

          <div className="panel-card min-w-0 overflow-hidden p-0">
            {selectedConversation ? (
              <>
                <div className="border-b border-[color:var(--site-border)] bg-white px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-2xl text-[color:var(--site-text)]">{getConversationTitle(selectedConversation)}</h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${
                            selectedConversation.status === 'open'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {selectedConversation.status === 'open' ? 'Aktiv' : 'Lukket'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--site-muted)]">
                        <span>ID: {selectedConversation.id.slice(0, 8)}</span>
                        {selectedConversation.visitor.phone ? <span>Telefon: {selectedConversation.visitor.phone}</span> : null}
                        {selectedConversation.visitor.email ? <span>E-mail: {selectedConversation.visitor.email}</span> : null}
                      </div>
                    </div>

                    <button type="button" onClick={handleStatusToggle} className="btn-secondary">
                      {selectedConversation.status === 'open' ? 'Luk samtale' : 'Genåbn samtale'}
                    </button>
                  </div>
                </div>

                <div className="max-h-[58vh] space-y-3 overflow-y-auto bg-[color:var(--site-panel-soft)] px-5 py-5">
                  {selectedConversation.messages.map((item) => {
                    const isAdmin = item.author === 'admin'
                    const isVisitor = item.author === 'visitor'
                    const bubbleClass = isAdmin
                      ? 'ml-auto bg-[color:var(--site-primary)] text-white'
                      : isVisitor
                        ? 'bg-[color:var(--site-dark)] text-white'
                        : 'bg-white text-[color:var(--site-text)] ring-1 ring-[color:var(--site-border)]'

                    return (
                      <div key={item.id} className={`max-w-[80%] ${isAdmin ? 'ml-auto text-right' : ''}`}>
                        <div className={`rounded-[1.2rem] px-4 py-3 text-sm leading-relaxed shadow-sm ${bubbleClass}`}>
                          {item.text}
                        </div>
                        <p className="mt-1 text-[11px] text-[color:var(--site-muted)]">{formatStamp(item.createdAt)}</p>
                      </div>
                    )
                  })}
                </div>

                <form onSubmit={handleReply} className="border-t border-[color:var(--site-border)] bg-white px-5 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={3}
                      placeholder="Skriv dit svar her..."
                      className="min-h-[4.25rem] flex-1 resize-none rounded-[1.1rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-4 py-3 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !message.trim()}
                      className="btn-primary h-auto disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[10rem]"
                    >
                      {isSending ? 'Sender...' : 'Send svar'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="px-6 py-10 text-sm text-[color:var(--site-muted)]">Vælg en samtale fra listen for at starte.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
