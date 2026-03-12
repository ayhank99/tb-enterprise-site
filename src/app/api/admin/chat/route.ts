import { NextRequest, NextResponse } from 'next/server'
import { CMS_AUTH_COOKIE, createSessionValue } from '@/lib/admin-auth'
import {
  addAdminMessage,
  ChatConversationStatus,
  getAdminConversation,
  listAdminConversations,
  markConversationReadForAdmin,
  updateConversationStatus,
} from '@/lib/chat-store'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get(CMS_AUTH_COOKIE)?.value
  return session === createSessionValue()
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversations = await listAdminConversations()
  return NextResponse.json({
    conversations: conversations.map(getAdminConversation),
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body missing' }, { status: 400 })
  }

  const source = body as Record<string, unknown>
  const conversationId = typeof source.conversationId === 'string' ? source.conversationId.trim() : ''
  const message = typeof source.message === 'string' ? source.message : ''

  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation id missing' }, { status: 400 })
  }

  try {
    const conversation = await addAdminMessage(conversationId, message)
    return NextResponse.json({ conversation: getAdminConversation(conversation) })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Reply failed'
    const status = messageText.includes('not found') ? 404 : 400
    return NextResponse.json({ error: messageText }, { status })
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body missing' }, { status: 400 })
  }

  const source = body as Record<string, unknown>
  const conversationId = typeof source.conversationId === 'string' ? source.conversationId.trim() : ''
  const status = typeof source.status === 'string' ? source.status : undefined
  const markRead = source.markRead === true

  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation id missing' }, { status: 400 })
  }

  try {
    let conversation = null

    if (markRead) {
      conversation = await markConversationReadForAdmin(conversationId)
    }

    if (status === 'open' || status === 'closed') {
      conversation = await updateConversationStatus(conversationId, status as ChatConversationStatus)
    }

    if (!conversation) {
      return NextResponse.json({ error: 'No action requested' }, { status: 400 })
    }

    return NextResponse.json({ conversation: getAdminConversation(conversation) })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Update failed'
    const statusCode = messageText.includes('not found') ? 404 : 400
    return NextResponse.json({ error: messageText }, { status: statusCode })
  }
}
