import { redirect } from 'next/navigation'
import AdminCmsEditor from '@/components/admin/AdminCmsEditor'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { readCmsState } from '@/lib/cms-store'

export default async function AdminCmsPage() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    redirect('/admin')
  }

  const state = await readCmsState()

  return <AdminCmsEditor initialState={state} />
}

