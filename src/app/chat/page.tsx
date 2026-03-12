import type { Metadata } from 'next'
import SiteChatWidget from '@/components/chat/SiteChatWidget'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Skriv direkte til TB Entreprise via vores eget chatmodul.',
  alternates: {
    canonical: withSiteBasePath('/chat'),
  },
}

export default async function ChatPage() {
  const state = await readCmsState()

  return <SiteChatWidget company={state.content.company} variant="page" />
}
