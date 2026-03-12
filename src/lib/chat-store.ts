import { createHash, randomUUID } from 'crypto'
import fs from 'fs/promises'
import path from 'path'

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

type ChatState = {
  conversations: ChatConversation[]
}

type EnsureConversationInput = {
  conversationId?: string
  token?: string
  visitor?: Partial<ChatVisitor>
}

type VisitorMessageInput = EnsureConversationInput & {
  text: string
}

const DATA_DIRECTORY = path.join(process.cwd(), 'data')
const CHAT_STATE_PATH = path.join(DATA_DIRECTORY, 'chat-state.json')
const WELCOME_MESSAGE = 'Hej, er der noget vi kan hjælpe med?'

function nowIso() {
  return new Date().toISOString()
}

function createVisitorToken() {
  return createHash('sha256').update(`${randomUUID()}:${Date.now()}`).digest('hex')
}

function normalizeText(text: string) {
  return text.replace(/\r\n/g, '\n').trim().slice(0, 2000)
}

function normalizeVisitorField(value: string | undefined, maxLength: number) {
  return (value ?? '').trim().slice(0, maxLength)
}

function normalizeVisitor(input?: Partial<ChatVisitor>): ChatVisitor {
  return {
    name: normalizeVisitorField(input?.name, 120),
    email: normalizeVisitorField(input?.email, 160),
    phone: normalizeVisitorField(input?.phone, 80),
  }
}

function mergeVisitor(current: ChatVisitor, incoming?: Partial<ChatVisitor>) {
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

function createSystemMessage(text: string): ChatMessage {
  return {
    id: randomUUID(),
    author: 'system',
    text,
    createdAt: nowIso(),
  }
}

function createUserMessage(author: ChatMessageAuthor, text: string): ChatMessage {
  return {
    id: randomUUID(),
    author,
    text: normalizeText(text),
    createdAt: nowIso(),
  }
}

function createDefaultState(): ChatState {
  return {
    conversations: [],
  }
}

async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true })
}

async function writeChatState(state: ChatState) {
  await ensureDataDirectory()
  await fs.writeFile(CHAT_STATE_PATH, JSON.stringify(state, null, 2), 'utf8')
}

export async function readChatState(): Promise<ChatState> {
  try {
    const file = await fs.readFile(CHAT_STATE_PATH, 'utf8')
    const parsed = JSON.parse(file) as Partial<ChatState>

    return {
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
    }
  } catch {
    const fallback = createDefaultState()
    await writeChatState(fallback)
    return fallback
  }
}

function findConversationIndex(state: ChatState, conversationId: string, token?: string) {
  return state.conversations.findIndex(
    (conversation) => conversation.id === conversationId && (token ? conversation.visitorToken === token : true)
  )
}

function sortConversations(conversations: ChatConversation[]) {
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

export async function ensureConversation(input: EnsureConversationInput) {
  const state = await readChatState()

  if (input.conversationId && input.token) {
    const existingIndex = findConversationIndex(state, input.conversationId, input.token)

    if (existingIndex >= 0) {
      const current = state.conversations[existingIndex]
      const merged: ChatConversation = {
        ...current,
        visitor: mergeVisitor(current.visitor, input.visitor),
      }

      state.conversations[existingIndex] = merged
      await writeChatState(state)
      return merged
    }
  }

  const createdAt = nowIso()
  const conversation: ChatConversation = {
    id: randomUUID(),
    visitorToken: createVisitorToken(),
    status: 'open',
    createdAt,
    updatedAt: createdAt,
    lastMessageAt: createdAt,
    unreadForAdmin: 0,
    unreadForVisitor: 0,
    visitor: normalizeVisitor(input.visitor),
    messages: [createSystemMessage(WELCOME_MESSAGE)],
  }

  state.conversations.unshift(conversation)
  await writeChatState(state)
  return conversation
}

export async function getConversationForVisitor(conversationId: string, token: string) {
  const state = await readChatState()
  const index = findConversationIndex(state, conversationId, token)

  if (index < 0) {
    return null
  }

  return state.conversations[index]
}

export async function addVisitorMessage(input: VisitorMessageInput) {
  const state = await readChatState()
  const index = input.conversationId && input.token ? findConversationIndex(state, input.conversationId, input.token) : -1

  if (index < 0) {
    throw new Error('Conversation not found')
  }

  const message = createUserMessage('visitor', input.text)

  if (!message.text) {
    throw new Error('Message is empty')
  }

  const current = state.conversations[index]
  const updatedAt = message.createdAt
  const next: ChatConversation = {
    ...current,
    status: 'open',
    updatedAt,
    lastMessageAt: updatedAt,
    unreadForAdmin: current.unreadForAdmin + 1,
    visitor: mergeVisitor(current.visitor, input.visitor),
    messages: [...current.messages, message],
  }

  state.conversations[index] = next
  await writeChatState(state)
  return next
}

export async function listAdminConversations() {
  const state = await readChatState()
  return sortConversations(state.conversations)
}

export async function addAdminMessage(conversationId: string, text: string) {
  const state = await readChatState()
  const index = findConversationIndex(state, conversationId)

  if (index < 0) {
    throw new Error('Conversation not found')
  }

  const message = createUserMessage('admin', text)

  if (!message.text) {
    throw new Error('Message is empty')
  }

  const current = state.conversations[index]
  const updatedAt = message.createdAt
  const next: ChatConversation = {
    ...current,
    updatedAt,
    lastMessageAt: updatedAt,
    unreadForAdmin: 0,
    unreadForVisitor: current.unreadForVisitor + 1,
    messages: [...current.messages, message],
  }

  state.conversations[index] = next
  await writeChatState(state)
  return next
}

export async function updateConversationStatus(conversationId: string, status: ChatConversationStatus) {
  const state = await readChatState()
  const index = findConversationIndex(state, conversationId)

  if (index < 0) {
    throw new Error('Conversation not found')
  }

  const current = state.conversations[index]
  const next: ChatConversation = {
    ...current,
    status,
    updatedAt: nowIso(),
  }

  state.conversations[index] = next
  await writeChatState(state)
  return next
}

export async function markConversationReadForAdmin(conversationId: string) {
  const state = await readChatState()
  const index = findConversationIndex(state, conversationId)

  if (index < 0) {
    return null
  }

  const current = state.conversations[index]

  if (current.unreadForAdmin === 0) {
    return current
  }

  const next: ChatConversation = {
    ...current,
    unreadForAdmin: 0,
    updatedAt: nowIso(),
  }

  state.conversations[index] = next
  await writeChatState(state)
  return next
}

export async function markConversationReadForVisitor(conversationId: string, token: string) {
  const state = await readChatState()
  const index = findConversationIndex(state, conversationId, token)

  if (index < 0) {
    return null
  }

  const current = state.conversations[index]

  if (current.unreadForVisitor === 0) {
    return current
  }

  const next: ChatConversation = {
    ...current,
    unreadForVisitor: 0,
    updatedAt: nowIso(),
  }

  state.conversations[index] = next
  await writeChatState(state)
  return next
}
