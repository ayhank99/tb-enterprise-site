import { promises as fs } from 'fs'
import path from 'path'
import { defaultSiteContent, resolveSiteContent, SiteContent } from '@/lib/site-data'
import { DEFAULT_TEMPLATE_ID, TemplateId } from '@/lib/templates'

export type CmsState = {
  activeTemplate: TemplateId
  content: SiteContent
  updatedAt: string
}

const DATA_DIRECTORY = path.join(process.cwd(), 'data')
const CMS_STATE_PATH = path.join(DATA_DIRECTORY, 'cms-state.json')

function createDefaultState(): CmsState {
  return {
    activeTemplate: DEFAULT_TEMPLATE_ID,
    content: defaultSiteContent,
    updatedAt: new Date().toISOString(),
  }
}

function resolveCmsState(raw: unknown): CmsState {
  const source = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {}

  return {
    activeTemplate: DEFAULT_TEMPLATE_ID,
    content: resolveSiteContent(source.content),
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : new Date().toISOString(),
  }
}

async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true })
}

export async function readCmsState(): Promise<CmsState> {
  try {
    const file = await fs.readFile(CMS_STATE_PATH, 'utf8')
    return resolveCmsState(JSON.parse(file) as unknown)
  } catch {
    const fallback = createDefaultState()
    await ensureDataDirectory()
    await fs.writeFile(CMS_STATE_PATH, JSON.stringify(fallback, null, 2), 'utf8')
    return fallback
  }
}

export async function writeCmsState(input: Partial<CmsState>): Promise<CmsState> {
  await ensureDataDirectory()

  const current = await readCmsState().catch(() => createDefaultState())
  const merged = resolveCmsState({
    ...current,
    ...input,
    content: input.content ?? current.content,
    updatedAt: new Date().toISOString(),
  })

  await fs.writeFile(CMS_STATE_PATH, JSON.stringify(merged, null, 2), 'utf8')
  return merged
}
