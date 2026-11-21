import { notFound, redirect } from 'next/navigation'
import { canManage, getSessionProfile } from '@/lib/auth'
import { CRUD_CONFIGS } from '@/lib/crud-config'
import CrudManager from '@/components/crud/crud-manager'

export const dynamic = 'force-dynamic'

export default async function EntityDashboardPage({
  params,
}: {
  params: Promise<{ entity: string }>
}) {
  const { entity } = await params
  const session = await getSessionProfile()
  if (!session) redirect('/login')

  const config = CRUD_CONFIGS[entity]
  if (!config) notFound()

  if (!canManage(session.profile.role, config.minRole)) redirect('/dashboard')

  return <CrudManager configKey={entity} role={session.profile.role} />
}
