import { createHash, randomUUID } from 'crypto'

export type ChatMessageAuthor = 'visitor' | 'admin' | 'system'
export type ChatConversationStatus = 'open' | 'closed'

export type ChatVisitor = {
  name: string
  email: string
  phone: string
}

export type ChatMessage = {
  id: string
  author: ChatMessageAuthor
  text: string
  createdAt: string
}

export type ChatConversation = {
  id: string
  visitorToken: string
  status: ChatConversationStatus
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  unreadForAdmin: number
  unreadForVisitor: number
  visitor: ChatVisitor
  messages: ChatMessage[]
}

export type EnsureConversationInput = {
  conversationId?: string
  token?: string
  visitor?: Partial<ChatVisitor>
}

export type VisitorMessageInput = EnsureConversationInput & {
  text: string
}

export const WELCOME_MESSAGE = 'Hej, er der noget vi kan hjælpe med?'

export function nowIso() {
  return new Date().toISOString()
}

export function createVisitorToken() {
  return createHash('sha256').update(`${randomUUID()}:${Date.now()}`).digest('hex')
}

export function normalizeText(text: string) {
  return text.replace(/\r\n/g, '\n').trim().slice(0, 2000)
}

export function normalizeVisitorField(value: string | undefined, maxLength: number) {
  return (value ?? '').trim().slice(0, maxLength)
}

export function normalizeVisitor(input?: Partial<ChatVisitor>): ChatVisitor {
  return {
    name: normalizeVisitorField(input?.name, 120),
    email: normalizeVisitorField(input?.email, 160),
    phone: normalizeVisitorField(input?.phone, 80),
  }
}

export function mergeVisitor(current: ChatVisitor, incoming?: Partial<ChatVisitor>) {
  if (!incoming) {
    return current
  }

  const next = normalizeVisitor(incoming)

  return {
    name: next.name || current.name,
    email: next.email || current.email,
    phone: next.phone || current.phone,
  }
}

export function createSystemMessage(text: string): ChatMessage {
  return {
    id: randomUUID(),
    author: 'system',
    text,
    createdAt: nowIso(),
  }
}

export function createUserMessage(author: ChatMessageAuthor, text: string): ChatMessage {
  return {
    id: randomUUID(),
    author,
    text: normalizeText(text),
    createdAt: nowIso(),
  }
}

export function sortConversations(conversations: ChatConversation[]) {
  return [...conversations].sort((left, right) => right.lastMessageAt.localeCompare(left.lastMessageAt))
}

export function getPublicConversation(conversation: ChatConversation) {
  return {
    id: conversation.id,
    status: conversation.status,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    lastMessageAt: conversation.lastMessageAt,
    unreadForVisitor: conversation.unreadForVisitor,
    visitor: conversation.visitor,
    messages: conversation.messages,
  }
}

export function getAdminConversation(conversation: ChatConversation) {
  return {
    id: conversation.id,
    status: conversation.status,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    lastMessageAt: conversation.lastMessageAt,
    unreadForAdmin: conversation.unreadForAdmin,
    unreadForVisitor: conversation.unreadForVisitor,
    visitor: conversation.visitor,
    messages: conversation.messages,
  }
}
