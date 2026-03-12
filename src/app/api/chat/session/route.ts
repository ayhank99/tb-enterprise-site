import { NextRequest, NextResponse } from 'next/server'
import {
  addVisitorMessage,
  ensureConversation,
  getConversationForVisitor,
  getPublicConversation,
  markConversationReadForVisitor,
} from '@/lib/chat-store'

export const runtime = 'nodejs'

function normalizeVisitor(source: Record<string, unknown>) {
  return {
    name: typeof source.name === 'string' ? source.name : '',
    email: typeof source.email === 'string' ? source.email : '',
    phone: typeof source.phone === 'string' ? source.phone : '',
  }
}

function createResponsePayload(conversation: Awaited<ReturnType<typeof ensureConversation>>) {
  return {
    conversationId: conversation.id,
    token: conversation.visitorToken,
    conversation: getPublicConversation(conversation),
  }
}

export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get('conversationId')?.trim()
  const token = request.nextUrl.searchParams.get('token')?.trim()

  if (!conversationId || !token) {
    return NextResponse.json({ error: 'Missing conversation access' }, { status: 400 })
  }

  const conversation = await getConversationForVisitor(conversationId, token)

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  const updated = (await markConversationReadForVisitor(conversationId, token)) ?? conversation
  return NextResponse.json(createResponsePayload(updated))
}

export async function POST(request: NextRequest) {
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
  const visitor = normalizeVisitor(source)
  const conversationId = typeof source.conversationId === 'string' ? source.conversationId : undefined
  const token = typeof source.token === 'string' ? source.token : undefined
  const text = typeof source.message === 'string' ? source.message : ''

  let conversation = await ensureConversation({
    conversationId,
    token,
    visitor,
  })

  if (text.trim()) {
    conversation = await addVisitorMessage({
      conversationId: conversation.id,
      token: conversation.visitorToken,
      visitor,
      text,
    })
  }

  const updated = (await markConversationReadForVisitor(conversation.id, conversation.visitorToken)) ?? conversation
  return NextResponse.json(createResponsePayload(updated))
}
