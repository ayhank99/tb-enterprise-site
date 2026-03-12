import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import type { ChatConversation, ChatConversationStatus, EnsureConversationInput, VisitorMessageInput } from '@/lib/chat-model'
import {
  createSystemMessage,
  createUserMessage,
  createVisitorToken,
  mergeVisitor,
  normalizeVisitor,
  nowIso,
  sortConversations,
  WELCOME_MESSAGE,
} from '@/lib/chat-model'

type ChatState = {
  conversations: ChatConversation[]
}

const DATA_DIRECTORY = process.env.VERCEL ? path.join(os.tmpdir(), 'tbentreprise-data') : path.join(process.cwd(), 'data')
const CHAT_STATE_PATH = path.join(DATA_DIRECTORY, 'chat-state.json')

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

async function readChatState(): Promise<ChatState> {
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
