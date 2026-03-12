import { redirect } from 'next/navigation'
import AdminChatInbox from '@/components/admin/AdminChatInbox'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { getAdminConversation, listAdminConversations } from '@/lib/chat-store'

export default async function AdminChatPage() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    redirect('/admin')
  }

  const conversations = (await listAdminConversations()).map(getAdminConversation)

  return <AdminChatInbox initialConversations={conversations} />
}
