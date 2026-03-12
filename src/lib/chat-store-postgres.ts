import { randomUUID } from 'crypto'
import { Pool, type PoolClient } from 'pg'
import type { ChatConversation, ChatConversationStatus, ChatMessage, ChatMessageAuthor, ChatVisitor, EnsureConversationInput, VisitorMessageInput } from '@/lib/chat-model'
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

type ConversationRow = {
  id: string
  visitor_token: string
  status: ChatConversationStatus
  created_at: Date | string
  updated_at: Date | string
  last_message_at: Date | string
  unread_for_admin: number
  unread_for_visitor: number
  visitor_name: string
  visitor_email: string
  visitor_phone: string
}

type MessageRow = {
  id: string
  conversation_id: string
  author: ChatMessageAuthor
  text: string
  created_at: Date | string
}

const CHAT_DATABASE_URL = process.env.CHAT_DATABASE_URL?.trim() ?? ''

let pool: Pool | null = null
let schemaReady: Promise<void> | null = null

export function isPostgresChatStoreConfigured() {
  return Boolean(CHAT_DATABASE_URL)
}

function toIso(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return new Date(value).toISOString()
}

function createPool() {
  const useSsl =
    process.env.CHAT_DATABASE_SSL === 'true' ||
    (!process.env.CHAT_DATABASE_SSL && !/localhost|127\.0\.0\.1/i.test(CHAT_DATABASE_URL))

  return new Pool({
    connectionString: CHAT_DATABASE_URL,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  })
}

function getPool() {
  if (!CHAT_DATABASE_URL) {
    throw new Error('CHAT_DATABASE_URL is not configured')
  }

  if (!pool) {
    pool = createPool()
  }

  return pool
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const currentPool = getPool()

      await currentPool.query(`
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id UUID PRIMARY KEY,
          visitor_token TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL,
          last_message_at TIMESTAMPTZ NOT NULL,
          unread_for_admin INTEGER NOT NULL DEFAULT 0,
          unread_for_visitor INTEGER NOT NULL DEFAULT 0,
          visitor_name TEXT NOT NULL DEFAULT '',
          visitor_email TEXT NOT NULL DEFAULT '',
          visitor_phone TEXT NOT NULL DEFAULT ''
        );

        CREATE INDEX IF NOT EXISTS chat_conversations_last_message_idx
          ON chat_conversations (last_message_at DESC);

        CREATE TABLE IF NOT EXISTS chat_messages (
          id UUID PRIMARY KEY,
          conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
          author TEXT NOT NULL CHECK (author IN ('visitor', 'admin', 'system')),
          text TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE INDEX IF NOT EXISTS chat_messages_conversation_created_idx
          ON chat_messages (conversation_id, created_at ASC);
      `)
    })()
  }

  await schemaReady
}

function rowToVisitor(row: ConversationRow): ChatVisitor {
  return {
    name: row.visitor_name ?? '',
    email: row.visitor_email ?? '',
    phone: row.visitor_phone ?? '',
  }
}

function rowToMessage(row: MessageRow): ChatMessage {
  return {
    id: row.id,
    author: row.author,
    text: row.text,
    createdAt: toIso(row.created_at),
  }
}

function rowToConversation(row: ConversationRow, messages: ChatMessage[]): ChatConversation {
  return {
    id: row.id,
    visitorToken: row.visitor_token,
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    lastMessageAt: toIso(row.last_message_at),
    unreadForAdmin: Number(row.unread_for_admin ?? 0),
    unreadForVisitor: Number(row.unread_for_visitor ?? 0),
    visitor: rowToVisitor(row),
    messages,
  }
}

async function fetchMessagesByConversationIds(client: PoolClient, conversationIds: string[]) {
  if (conversationIds.length === 0) {
    return new Map<string, ChatMessage[]>()
  }

  const result = await client.query<MessageRow>(
    `
      SELECT id, conversation_id, author, text, created_at
      FROM chat_messages
      WHERE conversation_id = ANY($1::uuid[])
      ORDER BY created_at ASC
    `,
    [conversationIds]
  )

  const grouped = new Map<string, ChatMessage[]>()

  for (const row of result.rows) {
    const current = grouped.get(row.conversation_id) ?? []
    current.push(rowToMessage(row))
    grouped.set(row.conversation_id, current)
  }

  return grouped
}

async function hydrateConversationRows(client: PoolClient, rows: ConversationRow[]) {
  const messagesByConversation = await fetchMessagesByConversationIds(
    client,
    rows.map((row) => row.id)
  )

  return rows.map((row) => rowToConversation(row, messagesByConversation.get(row.id) ?? []))
}

async function fetchConversationForVisitorInternal(client: PoolClient, conversationId: string, token: string) {
  const result = await client.query<ConversationRow>(
    `
      SELECT *
      FROM chat_conversations
      WHERE id = $1 AND visitor_token = $2
      LIMIT 1
    `,
    [conversationId, token]
  )

  if (!result.rowCount) {
    return null
  }

  const conversations = await hydrateConversationRows(client, result.rows)
  return conversations[0] ?? null
}

async function fetchConversationForAdminInternal(client: PoolClient, conversationId: string) {
  const result = await client.query<ConversationRow>(
    `
      SELECT *
      FROM chat_conversations
      WHERE id = $1
      LIMIT 1
    `,
    [conversationId]
  )

  if (!result.rowCount) {
    return null
  }

  const conversations = await hydrateConversationRows(client, result.rows)
  return conversations[0] ?? null
}

export async function ensureConversation(input: EnsureConversationInput) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    await client.query('BEGIN')

    if (input.conversationId && input.token) {
      const existingResult = await client.query<ConversationRow>(
        `
          SELECT *
          FROM chat_conversations
          WHERE id = $1 AND visitor_token = $2
          LIMIT 1
          FOR UPDATE
        `,
        [input.conversationId, input.token]
      )

      if (existingResult.rowCount) {
        const current = existingResult.rows[0]
        const mergedVisitor = mergeVisitor(rowToVisitor(current), input.visitor)

        await client.query(
          `
            UPDATE chat_conversations
            SET visitor_name = $3,
                visitor_email = $4,
                visitor_phone = $5
            WHERE id = $1 AND visitor_token = $2
          `,
          [input.conversationId, input.token, mergedVisitor.name, mergedVisitor.email, mergedVisitor.phone]
        )

        const conversation = await fetchConversationForVisitorInternal(client, input.conversationId, input.token)
        await client.query('COMMIT')
        return conversation as ChatConversation
      }
    }

    const createdAt = nowIso()
    const conversationId = randomUUID()
    const visitorToken = createVisitorToken()
    const visitor = normalizeVisitor(input.visitor)
    const welcomeMessage = createSystemMessage(WELCOME_MESSAGE)

    await client.query(
      `
        INSERT INTO chat_conversations (
          id, visitor_token, status, created_at, updated_at, last_message_at,
          unread_for_admin, unread_for_visitor, visitor_name, visitor_email, visitor_phone
        )
        VALUES ($1, $2, 'open', $3, $3, $3, 0, 0, $4, $5, $6)
      `,
      [conversationId, visitorToken, createdAt, visitor.name, visitor.email, visitor.phone]
    )

    await client.query(
      `
        INSERT INTO chat_messages (id, conversation_id, author, text, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [welcomeMessage.id, conversationId, welcomeMessage.author, welcomeMessage.text, welcomeMessage.createdAt]
    )

    const conversation = await fetchConversationForVisitorInternal(client, conversationId, visitorToken)
    await client.query('COMMIT')
    return conversation as ChatConversation
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function getConversationForVisitor(conversationId: string, token: string) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    return await fetchConversationForVisitorInternal(client, conversationId, token)
  } finally {
    client.release()
  }
}

export async function addVisitorMessage(input: VisitorMessageInput) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    await client.query('BEGIN')

    const currentResult = await client.query<ConversationRow>(
      `
        SELECT *
        FROM chat_conversations
        WHERE id = $1 AND visitor_token = $2
        LIMIT 1
        FOR UPDATE
      `,
      [input.conversationId, input.token]
    )

    if (!currentResult.rowCount) {
      throw new Error('Conversation not found')
    }

    const message = createUserMessage('visitor', input.text)

    if (!message.text) {
      throw new Error('Message is empty')
    }

    const current = currentResult.rows[0]
    const mergedVisitor = mergeVisitor(rowToVisitor(current), input.visitor)

    await client.query(
      `
        INSERT INTO chat_messages (id, conversation_id, author, text, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [message.id, input.conversationId, message.author, message.text, message.createdAt]
    )

    await client.query(
      `
        UPDATE chat_conversations
        SET status = 'open',
            updated_at = $3,
            last_message_at = $3,
            unread_for_admin = unread_for_admin + 1,
            visitor_name = $4,
            visitor_email = $5,
            visitor_phone = $6
        WHERE id = $1 AND visitor_token = $2
      `,
      [input.conversationId, input.token, message.createdAt, mergedVisitor.name, mergedVisitor.email, mergedVisitor.phone]
    )

    const conversation = await fetchConversationForVisitorInternal(client, input.conversationId as string, input.token as string)
    await client.query('COMMIT')
    return conversation as ChatConversation
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function listAdminConversations() {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    const result = await client.query<ConversationRow>(
      `
        SELECT *
        FROM chat_conversations
        ORDER BY last_message_at DESC
      `
    )

    const conversations = await hydrateConversationRows(client, result.rows)
    return sortConversations(conversations)
  } finally {
    client.release()
  }
}

export async function addAdminMessage(conversationId: string, text: string) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    await client.query('BEGIN')

    const currentResult = await client.query<ConversationRow>(
      `
        SELECT *
        FROM chat_conversations
        WHERE id = $1
        LIMIT 1
        FOR UPDATE
      `,
      [conversationId]
    )

    if (!currentResult.rowCount) {
      throw new Error('Conversation not found')
    }

    const message = createUserMessage('admin', text)

    if (!message.text) {
      throw new Error('Message is empty')
    }

    await client.query(
      `
        INSERT INTO chat_messages (id, conversation_id, author, text, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [message.id, conversationId, message.author, message.text, message.createdAt]
    )

    await client.query(
      `
        UPDATE chat_conversations
        SET updated_at = $2,
            last_message_at = $2,
            unread_for_admin = 0,
            unread_for_visitor = unread_for_visitor + 1
        WHERE id = $1
      `,
      [conversationId, message.createdAt]
    )

    const conversation = await fetchConversationForAdminInternal(client, conversationId)
    await client.query('COMMIT')
    return conversation as ChatConversation
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function updateConversationStatus(conversationId: string, status: ChatConversationStatus) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    const updatedAt = nowIso()

    const result = await client.query<ConversationRow>(
      `
        UPDATE chat_conversations
        SET status = $2,
            updated_at = $3
        WHERE id = $1
        RETURNING *
      `,
      [conversationId, status, updatedAt]
    )

    if (!result.rowCount) {
      throw new Error('Conversation not found')
    }

    const conversations = await hydrateConversationRows(client, result.rows)
    return conversations[0] as ChatConversation
  } finally {
    client.release()
  }
}

export async function markConversationReadForAdmin(conversationId: string) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    await client.query(
      `
        UPDATE chat_conversations
        SET unread_for_admin = 0,
            updated_at = $2
        WHERE id = $1
      `,
      [conversationId, nowIso()]
    )

    return await fetchConversationForAdminInternal(client, conversationId)
  } finally {
    client.release()
  }
}

export async function markConversationReadForVisitor(conversationId: string, token: string) {
  await ensureSchema()
  const client = await getPool().connect()

  try {
    await client.query(
      `
        UPDATE chat_conversations
        SET unread_for_visitor = 0,
            updated_at = $3
        WHERE id = $1 AND visitor_token = $2
      `,
      [conversationId, token, nowIso()]
    )

    return await fetchConversationForVisitorInternal(client, conversationId, token)
  } finally {
    client.release()
  }
}
