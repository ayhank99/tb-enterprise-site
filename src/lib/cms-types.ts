import type { SiteContent } from '@/lib/site-data'
import type { TemplateId } from '@/lib/templates'

export type CmsState = {
  activeTemplate: TemplateId
  content: SiteContent
  updatedAt: string
}

export type CmsStorageMode = 'file' | 'postgres'

export type CmsMediaFile = {
  name: string
  url: string
  size: number
  updatedAt: string
  contentType: string
}

export type CmsMediaRecord = CmsMediaFile & {
  buffer: Buffer
}

export type SaveCmsMediaInput = {
  originalName: string
  contentType: string
  buffer: Buffer
}
