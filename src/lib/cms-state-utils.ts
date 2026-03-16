import { resolveSiteContent } from '@/lib/site-data'
import { DEFAULT_TEMPLATE_ID, resolveTemplateId } from '@/lib/templates'
import type { CmsState } from '@/lib/cms-types'

export function createDefaultCmsState(): CmsState {
  return {
    activeTemplate: DEFAULT_TEMPLATE_ID,
    content: resolveSiteContent({}),
    updatedAt: new Date().toISOString(),
  }
}

export function resolveCmsState(raw: unknown): CmsState {
  const source = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {}

  return {
    activeTemplate: resolveTemplateId(typeof source.activeTemplate === 'string' ? source.activeTemplate : null),
    content: resolveSiteContent(source.content),
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  }
}
