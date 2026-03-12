'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type RouteShellProps = {
  publicView: ReactNode
  adminView: ReactNode
}

export default function RouteShell({ publicView, adminView }: RouteShellProps) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  return <>{isAdminRoute ? adminView : publicView}</>
}
