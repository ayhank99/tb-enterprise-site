import * as githubStore from '@/lib/cms-store-github'
import * as fileStore from '@/lib/cms-store-file'
import * as postgresStore from '@/lib/cms-store-postgres'
import type { CmsStorageMode } from '@/lib/cms-types'

export type { CmsMediaFile, CmsMediaRecord, CmsState, CmsStorageMode, SaveCmsMediaInput } from '@/lib/cms-types'

const store = githubStore.isGithubCmsStoreConfigured()
  ? githubStore
  : postgresStore.isPostgresCmsStoreConfigured()
    ? postgresStore
    : fileStore

export const readCmsState = store.readCmsState
export const writeCmsState = store.writeCmsState
export const listCmsMediaFiles = store.listCmsMediaFiles
export const saveCmsMediaFile = store.saveCmsMediaFile
export const readCmsMediaFile = store.readCmsMediaFile
export const deleteCmsMediaFile = store.deleteCmsMediaFile

export function getCmsStorageMode(): CmsStorageMode {
  if (githubStore.isGithubCmsStoreConfigured()) {
    return 'github'
  }

  return postgresStore.isPostgresCmsStoreConfigured() ? 'postgres' : 'file'
}

export function isCmsPersistentStorageConfigured() {
  return getCmsStorageMode() !== 'file'
}
