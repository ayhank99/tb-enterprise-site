import path from 'path'
import { randomUUID } from 'crypto'
import { createDefaultCmsState, resolveCmsState } from '@/lib/cms-state-utils'
import {
  buildDatabaseCmsMediaUrl,
  getCmsMediaContentType,
  sanitizeCmsMediaBaseName,
  sortCmsMediaFiles,
} from '@/lib/cms-media-utils'
import type { CmsMediaFile, CmsMediaRecord, CmsState, SaveCmsMediaInput } from '@/lib/cms-types'

type GithubFileResponse = {
  type: 'file'
  name: string
  path: string
  sha: string
  size: number
  encoding?: string
  content?: string
}

type GithubDirectoryEntry = {
  type: 'file' | 'dir'
  name: string
  path: string
  sha: string
  size: number
}

type GithubCommitResponse = Array<{
  commit?: {
    committer?: {
      date?: string
    }
  }
}>

const GITHUB_TOKEN =
  process.env.GITHUB_CONTENTS_TOKEN?.trim() ||
  process.env.GITHUB_TOKEN?.trim() ||
  process.env.GH_TOKEN?.trim() ||
  ''

const GITHUB_OWNER = process.env.GITHUB_REPO_OWNER?.trim() || process.env.VERCEL_GIT_REPO_OWNER?.trim() || ''
const GITHUB_REPO = process.env.GITHUB_REPO_NAME?.trim() || process.env.VERCEL_GIT_REPO_SLUG?.trim() || ''
const GITHUB_BRANCH = process.env.GITHUB_REPO_BRANCH?.trim() || process.env.VERCEL_GIT_COMMIT_REF?.trim() || 'main'

const CMS_STATE_REPO_PATH = 'data/cms-state.json'
const MEDIA_REPO_DIRECTORY = 'public/uploads'

function getApiBase() {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents`
}

function getHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function githubRequest<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(text || `GitHub request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

function decodeGithubContent(content: string) {
  return Buffer.from(content.replace(/\n/g, ''), 'base64')
}

async function getRepoFile(filePath: string) {
  const url = `${getApiBase()}/${encodeURIComponent(filePath).replace(/%2F/g, '/')}?ref=${encodeURIComponent(GITHUB_BRANCH)}`
  return githubRequest<GithubFileResponse>(url)
}

async function putRepoFile(filePath: string, buffer: Buffer, message: string, sha?: string) {
  const url = `${getApiBase()}/${encodeURIComponent(filePath).replace(/%2F/g, '/')}`
  await githubRequest<unknown>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: buffer.toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  })
}

async function deleteRepoFile(filePath: string, message: string, sha: string) {
  const url = `${getApiBase()}/${encodeURIComponent(filePath).replace(/%2F/g, '/')}`
  await githubRequest<unknown>(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      branch: GITHUB_BRANCH,
      sha,
    }),
  })
}

async function getLatestCommitDate(filePath: string) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${encodeURIComponent(filePath)}&sha=${encodeURIComponent(GITHUB_BRANCH)}&per_page=1`

  try {
    const commits = await githubRequest<GithubCommitResponse>(url)
    return commits[0]?.commit?.committer?.date ?? new Date().toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export function isGithubCmsStoreConfigured() {
  return Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO)
}

export async function readCmsState(): Promise<CmsState> {
  try {
    const file = await getRepoFile(CMS_STATE_REPO_PATH)
    const json = decodeGithubContent(file.content ?? '').toString('utf8')
    return resolveCmsState(JSON.parse(json) as unknown)
  } catch {
    const fallback = createDefaultCmsState()
    await putRepoFile(CMS_STATE_REPO_PATH, Buffer.from(JSON.stringify(fallback, null, 2), 'utf8'), 'Initialize CMS state')
    return fallback
  }
}

export async function writeCmsState(input: Partial<CmsState>): Promise<CmsState> {
  const current = await readCmsState().catch(() => createDefaultCmsState())
  const merged = resolveCmsState({
    ...current,
    ...input,
    activeTemplate: input.activeTemplate ?? current.activeTemplate,
    content: input.content ?? current.content,
    updatedAt: new Date().toISOString(),
  })

  let sha: string | undefined

  try {
    sha = (await getRepoFile(CMS_STATE_REPO_PATH)).sha
  } catch {
    sha = undefined
  }

  await putRepoFile(CMS_STATE_REPO_PATH, Buffer.from(JSON.stringify(merged, null, 2), 'utf8'), 'Update CMS content', sha)
  return merged
}

export async function listCmsMediaFiles(): Promise<CmsMediaFile[]> {
  const url = `${getApiBase()}/${MEDIA_REPO_DIRECTORY}?ref=${encodeURIComponent(GITHUB_BRANCH)}`
  let items: GithubDirectoryEntry[]

  try {
    items = await githubRequest<GithubDirectoryEntry[]>(url)
  } catch {
    return []
  }

  const media = await Promise.all(
    items
      .filter((entry) => entry.type === 'file')
      .map(async (entry) => ({
        name: entry.name,
        url: buildDatabaseCmsMediaUrl(entry.name),
        size: entry.size,
        updatedAt: await getLatestCommitDate(entry.path),
        contentType: getCmsMediaContentType(entry.name),
      }))
  )

  return sortCmsMediaFiles(media)
}

export async function saveCmsMediaFile(input: SaveCmsMediaInput): Promise<CmsMediaFile> {
  const originalName = path.basename(input.originalName)
  const extension = path.extname(originalName).toLowerCase()
  const baseName = sanitizeCmsMediaBaseName(path.basename(originalName, extension)) || 'media'
  const filename = `${baseName}-${randomUUID().slice(0, 8)}${extension}`
  const repoPath = `${MEDIA_REPO_DIRECTORY}/${filename}`
  const updatedAt = new Date().toISOString()

  await putRepoFile(repoPath, input.buffer, `Upload media ${filename}`)

  return {
    name: filename,
    url: buildDatabaseCmsMediaUrl(filename),
    size: input.buffer.byteLength,
    updatedAt,
    contentType: input.contentType || getCmsMediaContentType(filename),
  }
}

export async function readCmsMediaFile(filename: string): Promise<CmsMediaRecord | null> {
  const safeName = path.basename(filename)
  const repoPath = `${MEDIA_REPO_DIRECTORY}/${safeName}`

  try {
    const file = await getRepoFile(repoPath)
    const buffer = decodeGithubContent(file.content ?? '')

    return {
      name: safeName,
      url: buildDatabaseCmsMediaUrl(safeName),
      size: file.size,
      updatedAt: await getLatestCommitDate(repoPath),
      contentType: getCmsMediaContentType(safeName),
      buffer,
    }
  } catch {
    return null
  }
}

export async function deleteCmsMediaFile(filename: string) {
  const safeName = path.basename(filename)
  const repoPath = `${MEDIA_REPO_DIRECTORY}/${safeName}`
  const current = await getRepoFile(repoPath)
  await deleteRepoFile(repoPath, `Delete media ${safeName}`, current.sha)
}
