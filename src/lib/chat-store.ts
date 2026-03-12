import * as fileStore from '@/lib/chat-store-file'
import * as postgresStore from '@/lib/chat-store-postgres'

export * from '@/lib/chat-model'

const store = postgresStore.isPostgresChatStoreConfigured() ? postgresStore : fileStore

export const ensureConversation = store.ensureConversation
export const getConversationForVisitor = store.getConversationForVisitor
export const addVisitorMessage = store.addVisitorMessage
export const listAdminConversations = store.listAdminConversations
export const addAdminMessage = store.addAdminMessage
export const updateConversationStatus = store.updateConversationStatus
export const markConversationReadForAdmin = store.markConversationReadForAdmin
export const markConversationReadForVisitor = store.markConversationReadForVisitor
