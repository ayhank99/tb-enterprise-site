import { cp, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const EXCLUDED_TOP_LEVEL = new Set(['.git', '.next', 'dist', 'node_modules', '.preview-build-temp'])

function normalizeBasePath(value) {
  const trimmed = typeof value === 'string' ? value.trim() : ''

  if (!trimmed || trimmed === '/') {
    return ''
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '')
}

function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code ?? 'unknown'}`))
    })

    child.on('error', reject)
  })
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDirectory, '..')
const tempRoot = path.join(repoRoot, '.preview-build-temp')
const distRoot = path.join(repoRoot, 'dist')
const previewOutput = path.join(distRoot, 'cloud-preview')
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_SITE_BASE_PATH)

await rm(tempRoot, { recursive: true, force: true })
await rm(previewOutput, { recursive: true, force: true })
await mkdir(tempRoot, { recursive: true })

const repoEntries = await readdir(repoRoot, { withFileTypes: true })

for (const entry of repoEntries) {
  if (EXCLUDED_TOP_LEVEL.has(entry.name)) {
    continue
  }

  await cp(path.join(repoRoot, entry.name), path.join(tempRoot, entry.name), { recursive: true })
}

await rm(path.join(tempRoot, 'src', 'app', 'admin'), { recursive: true, force: true })
await rm(path.join(tempRoot, 'src', 'app', 'api'), { recursive: true, force: true })

await mkdir(distRoot, { recursive: true })

await runCommand(process.execPath, [path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'], {
  cwd: tempRoot,
  env: {
    ...process.env,
    NEXT_EXPORT_STATIC: 'true',
    NEXT_PUBLIC_SITE_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_IS_PREVIEW: 'true',
    NEXT_PUBLIC_CMS_ENABLED: 'false',
    NEXT_PUBLIC_DISABLE_QUOTE_SUBMIT: process.env.NEXT_PUBLIC_DISABLE_QUOTE_SUBMIT || 'true',
  },
})

await cp(path.join(tempRoot, 'out'), previewOutput, { recursive: true })
await rm(tempRoot, { recursive: true, force: true })

console.log(`Static preview build ready in ${previewOutput}`)
