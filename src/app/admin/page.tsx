import { redirect } from 'next/navigation'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated()

  if (authenticated) {
    redirect('/admin/cms')
  }

  return (
    <section className="section-soft py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-10">
        <AdminLoginForm />
      </div>
    </section>
  )
}

