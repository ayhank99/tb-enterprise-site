'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { CmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import {
  defaultSiteContent,
  resolveSiteContent,
  type HomeSection,
  type HomeSectionType,
  type NarrativeContent,
  type SiteContent,
} from '@/lib/site-data'

type AdminCmsEditorProps = {
  initialState: CmsState
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

type TabId =
  | 'company'
  | 'home'
  | 'services'
  | 'gallery'
  | 'pages'
  | 'navigation'
  | 'quote'
  | 'media'
  | 'advanced'

type MediaFile = {
  name: string
  url: string
  size: number
  updatedAt: string
}

type MediaKind = 'image' | 'video' | 'other'

type MediaOption = {
  label: string
  helper: string
  url: string
  kind: MediaKind
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'company', label: 'Virksomhed & SEO' },
  { id: 'home', label: 'Forside' },
  { id: 'services', label: 'Ydelser' },
  { id: 'gallery', label: 'Galleri' },
  { id: 'pages', label: 'Sider' },
  { id: 'navigation', label: 'Menu' },
  { id: 'quote', label: 'Tilbudsformular' },
  { id: 'media', label: 'Mediebibliotek' },
  { id: 'advanced', label: 'Avanceret JSON' },
]

const homeSectionCatalog: Record<
  HomeSectionType,
  {
    label: string
    description: string
    preview: string
    variants: string[]
  }
> = {
  hero: {
    label: 'Hero',
    description: 'Første visuelle sektion med hovedbudskab og primære CTA-knapper.',
    preview: 'linear-gradient(125deg,#101827 0%,#1f2a44 52%,#4f6aa4 100%)',
    variants: [],
  },
  trustStrip: {
    label: 'Intro & kontakt',
    description: 'Builderz-inspireret velkomstblok med kontaktbjælke, intro og billedsektion.',
    preview: 'linear-gradient(125deg,#f4f6fb 0%,#e3e9f8 100%)',
    variants: [],
  },
  servicesGrid: {
    label: 'Ydelsesgrid',
    description: 'Servicekort med ikon, billede og micro-CTA.',
    preview: 'linear-gradient(125deg,#ffffff 0%,#eff4ff 48%,#d7e3ff 100%)',
    variants: ['A', 'B', 'C'],
  },
  projectsGallery: {
    label: 'Projektgalleri',
    description: 'Visuel projektvæg med hover overlay og klikbar projektflade.',
    preview: 'linear-gradient(125deg,#1b2238 0%,#2e3f6a 46%,#607fba 100%)',
    variants: ['masonry', 'grid', 'carousel'],
  },
  process: {
    label: 'Hvorfor vælge os',
    description: 'Fordelssektion med fremhævede styrker omkring et centralt billede.',
    preview: 'linear-gradient(125deg,#fff7e7 0%,#f7e2b6 50%,#e4b85a 100%)',
    variants: ['steps', 'timeline'],
  },
  testimonials: {
    label: 'Anmeldelser',
    description: 'Kundeudtalelser som kort eller horisontal slider.',
    preview: 'linear-gradient(125deg,#f4f7fb 0%,#d9e5ff 50%,#a2b9f3 100%)',
    variants: ['cards', 'slider'],
  },
  ctaBanner: {
    label: 'CTA banner',
    description: 'Afsluttende konverteringssektion med split eller centreret layout.',
    preview: 'linear-gradient(125deg,#0f1425 0%,#223158 46%,#ff6a3e 100%)',
    variants: ['split', 'centered'],
  },
}

const orderedHomeSectionTypes: HomeSectionType[] = ['hero', 'trustStrip', 'servicesGrid', 'projectsGallery', 'process', 'testimonials', 'ctaBanner']
const ADMIN_STATE_ENDPOINT = withSiteBasePath('/api/admin/state')
const ADMIN_LOGOUT_ENDPOINT = withSiteBasePath('/api/admin/logout')
const ADMIN_MEDIA_ENDPOINT = withSiteBasePath('/api/admin/media')

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function linesToArray(value: string): string[] {
  return value
    .split(/\r?\n/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getMediaKind(url: string): MediaKind {
  const cleanUrl = url.split('?')[0]?.toLowerCase() ?? ''

  if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanUrl)) return 'image'
  if (/\.(mp4|webm|mov|m4v)$/i.test(cleanUrl)) return 'video'

  return 'other'
}

function ensureHomeSections(sections: HomeSection[] | undefined): HomeSection[] {
  if (sections && sections.length > 0) {
    return sections
  }

  return deepClone(defaultSiteContent.pages.home.sections)
}

type InputProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'url' | 'tel'
  list?: string
}

function TextInput({ label, value, onChange, placeholder, type = 'text', list }: InputProps) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="text-sm font-semibold text-[color:var(--site-text)]">{label}</span>
      <input
        type={type}
        value={value}
        list={list}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
      />
    </label>
  )
}

type TextAreaProps = {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}

function TextArea({ label, value, onChange, rows = 4, placeholder }: TextAreaProps) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="text-sm font-semibold text-[color:var(--site-text)]">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
      />
    </label>
  )
}

type NarrativeFieldsProps = {
  value: NarrativeContent
  onChange: (value: NarrativeContent) => void
}

function NarrativeFields({ value, onChange }: NarrativeFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Overlinje" value={value.eyebrow} onChange={(next) => onChange({ ...value, eyebrow: next })} />
        <TextInput label="Overskrift" value={value.title} onChange={(next) => onChange({ ...value, title: next })} />
      </div>
      <TextArea label="Indledning" rows={4} value={value.intro} onChange={(next) => onChange({ ...value, intro: next })} />
      <div className="grid gap-4 md:grid-cols-2">
        <TextArea
          label="Afsnit (et pr. linje)"
          rows={6}
          value={value.paragraphs.join('\n')}
          onChange={(next) => onChange({ ...value, paragraphs: linesToArray(next) })}
        />
        <TextArea
          label="Highlights (en pr. linje)"
          rows={6}
          value={value.highlights.join('\n')}
          onChange={(next) => onChange({ ...value, highlights: linesToArray(next) })}
        />
      </div>
    </div>
  )
}

type MediaPickerFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: MediaOption[]
  placeholder?: string
  kind: 'image' | 'video'
}

function MediaThumb({ option, alt }: { option: MediaOption; alt: string }) {
  const previewUrl = withSiteBasePath(option.url)

  if (option.kind === 'video') {
    return (
      <video className="h-full w-full object-cover" muted playsInline preload="metadata">
        <source src={previewUrl} />
      </video>
    )
  }

  return <Image src={previewUrl} alt={alt} fill sizes="220px" className="object-cover" />
}

function CurrentMediaPreview({ value, label, kind }: { value: string; label: string; kind: 'image' | 'video' }) {
  const previewUrl = withSiteBasePath(value)

  return (
    <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)]">
      {kind === 'video' ? (
        <video className="h-full w-full object-cover" muted playsInline preload="metadata">
          <source src={previewUrl} />
        </video>
      ) : (
        <Image src={previewUrl} alt={label} fill sizes="96px" className="object-cover" />
      )}
    </div>
  )
}

function MediaPickerField({ label, value, onChange, options, placeholder, kind }: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false)
  const listId = kind === 'video' ? 'media-video-list' : 'media-image-list'
  const pickerTitle = kind === 'video' ? 'Videovælger' : 'Billedvælger'
  const pickerHelp =
    kind === 'video'
      ? 'Vælg en video fra mediebiblioteket eller indsæt en direkte video-URL.'
      : 'Vælg et billede fra mediebiblioteket eller eksisterende galleri.'
  const activeLabel = kind === 'video' ? 'Aktiv video' : 'Aktivt billede'
  const emptyLabel = kind === 'video' ? 'Der er endnu ingen videoer i biblioteket.' : 'Der er endnu ingen billeder i biblioteket eller galleriet.'

  return (
    <div className="space-y-3">
      <TextInput label={label} value={value} list={listId} placeholder={placeholder} onChange={onChange} />

      <div className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--site-muted)]">{pickerTitle}</p>
            <p className="mt-1 text-sm text-[color:var(--site-muted)]">{pickerHelp}</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-[color:var(--site-border)] px-3 py-2 text-xs font-semibold text-[color:var(--site-text)]"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? 'Skjul vælger' : 'Åbn vælger'}
          </button>
        </div>

        {value ? (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-3">
            <CurrentMediaPreview value={value} label={label} kind={kind} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--site-muted)]">{activeLabel}</p>
              <p className="mt-1 truncate text-sm text-[color:var(--site-text)]">{value}</p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700"
              onClick={() => onChange('')}
            >
              Ryd
            </button>
          </div>
        ) : null}

        {open ? (
          options.length > 0 ? (
            <div className="mt-3 max-h-[28rem] overflow-y-auto pr-1">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {options.map((option) => {
                const active = option.url === value

                return (
                  <button
                    key={`${option.helper}-${option.url}`}
                    type="button"
                    onClick={() => onChange(option.url)}
                    className={`overflow-hidden rounded-xl border text-left transition-all ${
                      active
                        ? 'border-[color:var(--site-primary)] bg-[color:var(--site-primary-soft)]'
                        : 'border-[color:var(--site-border)] bg-[color:var(--site-panel)] hover:border-[color:var(--site-primary)]'
                    }`}
                  >
                    <div className="relative h-28 overflow-hidden bg-[color:var(--site-panel-soft)]">
                      <MediaThumb option={option} alt={option.label} />
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="truncate text-sm font-semibold text-[color:var(--site-text)]">{option.label}</p>
                      <p className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--site-muted)]">{option.helper}</p>
                    </div>
                  </button>
                )
                })}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[color:var(--site-muted)]">{emptyLabel}</p>
          )
        ) : null}
      </div>
    </div>
  )
}

function ImagePickerField(props: Omit<MediaPickerFieldProps, 'kind'>) {
  return <MediaPickerField {...props} kind="image" />
}

function VideoPickerField(props: Omit<MediaPickerFieldProps, 'kind'>) {
  return <MediaPickerField {...props} kind="video" />
}

type BoxProps = {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
}

function EditorBox({ title, children, actions }: BoxProps) {
  return (
    <section className="panel-card min-w-0 space-y-4 overflow-hidden p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-2xl text-[color:var(--site-text)]">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  )
}

export default function AdminCmsEditor({ initialState }: AdminCmsEditorProps) {
  const router = useRouter()
  const [draft, setDraft] = useState<CmsState>(initialState)
  const [activeTab, setActiveTab] = useState<TabId>('company')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(initialState.content, null, 2))
  const [savedSnapshot, setSavedSnapshot] = useState(
    JSON.stringify({ activeTemplate: initialState.activeTemplate, content: initialState.content })
  )

  const currentSnapshot = useMemo(
    () => JSON.stringify({ activeTemplate: draft.activeTemplate, content: draft.content }),
    [draft]
  )
  const isDirty = currentSnapshot !== savedSnapshot

  const imageOptions = useMemo(() => {
    const seen = new Set<string>()
    const items: MediaOption[] = []

    for (const file of mediaFiles) {
      if (getMediaKind(file.url) !== 'image') continue
      if (seen.has(file.url)) continue
      seen.add(file.url)
      items.push({
        label: file.name,
        helper: 'Mediebibliotek',
        url: file.url,
        kind: 'image',
      })
    }

    for (const brandAsset of [
      { url: draft.content.company.logoUrl, label: 'Logo til mørk baggrund' },
      { url: draft.content.company.logoUrlOnLight, label: 'Logo til lys baggrund' },
    ]) {
      if (!brandAsset.url || seen.has(brandAsset.url)) continue
      seen.add(brandAsset.url)
      items.push({
        label: brandAsset.label,
        helper: 'Brand',
        url: brandAsset.url,
        kind: 'image',
      })
    }

    for (const image of draft.content.galleryImages) {
      if (!image.src || seen.has(image.src)) continue
      seen.add(image.src)
      items.push({
        label: image.title ?? image.alt ?? 'Galleri billede',
        helper: 'Galleri',
        url: image.src,
        kind: 'image',
      })
    }

    return items
  }, [draft.content.company.logoUrl, draft.content.company.logoUrlOnLight, draft.content.galleryImages, mediaFiles])
  const videoOptions = useMemo(
    () =>
      mediaFiles
        .filter((file) => getMediaKind(file.url) === 'video')
        .map((file) => ({
          label: file.name,
          helper: 'Mediebibliotek',
          url: file.url,
          kind: 'video' as const,
        })),
    [mediaFiles]
  )
  const mediaUrlOptions = useMemo(() => {
    const seen = new Set<string>()
    const items: MediaOption[] = []

    for (const option of [...imageOptions, ...videoOptions]) {
      if (seen.has(option.url)) continue
      seen.add(option.url)
      items.push(option)
    }

    return items
  }, [imageOptions, videoOptions])
  const homeSections = ensureHomeSections(draft.content.pages.home.sections)

  const mutateState = (updater: (state: CmsState) => void) => {
    setDraft((previous) => {
      const next = deepClone(previous)
      updater(next)
      return next
    })
    setSaveStatus('idle')
  }

  const mutateContent = (updater: (content: SiteContent) => void) => {
    mutateState((next) => {
      updater(next.content)
    })
  }

  const refreshState = async () => {
    setError(null)
    setNotice(null)

    try {
      const response = await fetch(ADMIN_STATE_ENDPOINT, {
        method: 'GET',
      })

      if (response.status === 401) {
        router.push('/admin')
        router.refresh()
        return
      }

      if (!response.ok) {
        throw new Error('Kunne ikke hente status')
      }

      const next = (await response.json()) as CmsState
      setDraft(next)
      setJsonDraft(JSON.stringify(next.content, null, 2))
      setSavedSnapshot(JSON.stringify({ activeTemplate: next.activeTemplate, content: next.content }))
      setNotice('Seneste data fra serveren er indlæst.')
    } catch {
      setError('CMS-data kunne ikke indlæses.')
    }
  }

  const handleSave = async (event?: FormEvent) => {
    event?.preventDefault()
    setError(null)
    setNotice(null)
    setSaveStatus('saving')

    try {
      const response = await fetch(ADMIN_STATE_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeTemplate: draft.activeTemplate,
          content: draft.content,
        }),
      })

      if (response.status === 401) {
        router.push('/admin')
        router.refresh()
        return
      }

      if (!response.ok) {
        throw new Error('Gemning mislykkedes')
      }

      const saved = (await response.json()) as CmsState
      setDraft(saved)
      setJsonDraft(JSON.stringify(saved.content, null, 2))
      setSavedSnapshot(JSON.stringify({ activeTemplate: saved.activeTemplate, content: saved.content }))
      setSaveStatus('saved')
      setNotice('Ændringerne er gemt.')
    } catch {
      setSaveStatus('error')
      setError('Der opstod en fejl under gemning.')
    }
  }

  const handleLogout = async () => {
    setError(null)
    try {
      await fetch(ADMIN_LOGOUT_ENDPOINT, { method: 'POST' })
    } finally {
      router.push('/admin')
      router.refresh()
    }
  }

  const loadMedia = async () => {
    setMediaLoading(true)
    setError(null)

    try {
      const response = await fetch(ADMIN_MEDIA_ENDPOINT, { method: 'GET' })

      if (response.status === 401) {
        router.push('/admin')
        router.refresh()
        return
      }

      if (!response.ok) {
        throw new Error('Kunne ikke hente medier')
      }

      const payload = (await response.json()) as { media?: MediaFile[] }
      setMediaFiles(payload.media ?? [])
    } catch {
      setError('Medielisten kunne ikke indlæses.')
    } finally {
      setMediaLoading(false)
    }
  }

  useEffect(() => {
    void loadMedia()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const uploadMedia = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    setError(null)
    setNotice(null)

    try {
      const response = await fetch(ADMIN_MEDIA_ENDPOINT, {
        method: 'POST',
        body: formData,
      })

      if (response.status === 401) {
        router.push('/admin')
        router.refresh()
        return
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error ?? 'Upload mislykkedes')
      }

      setNotice('Mediet er uploadet.')
      await loadMedia()
      event.target.value = ''
    } catch (uploadError) {
      const text = uploadError instanceof Error ? uploadError.message : 'Upload mislykkedes.'
      setError(text)
    } finally {
      setUploading(false)
    }
  }

  const deleteMedia = async (filename: string) => {
    if (!window.confirm(`Vil du slette filen "${filename}"?`)) {
      return
    }

    setError(null)
    setNotice(null)

    try {
      const response = await fetch(`${ADMIN_MEDIA_ENDPOINT}?file=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })

      if (response.status === 401) {
        router.push('/admin')
        router.refresh()
        return
      }

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(payload.error ?? 'Sletning mislykkedes')
      }

      setNotice('Filen er slettet.')
      await loadMedia()
    } catch (deleteError) {
      const text = deleteError instanceof Error ? deleteError.message : 'Filen kunne ikke slettes.'
      setError(text)
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setNotice(`Kopieret: ${url}`)
    } catch {
      setError('URL kunne ikke kopieres.')
    }
  }

  const applyJsonToDraft = () => {
    try {
      const parsed = JSON.parse(jsonDraft) as unknown
      const resolved = resolveSiteContent(parsed)

      mutateContent((content) => {
        Object.assign(content, resolved)
      })
      setNotice('JSON er anvendt på kladden.')
      setError(null)
    } catch {
      setError('JSON er ugyldig. Ret den før du fortsætter.')
    }
  }

  const resetToDefaults = () => {
    if (!window.confirm('Vil du nulstille alt indhold til standardværdier?')) {
      return
    }

    mutateContent((content) => {
      Object.assign(content, deepClone(defaultSiteContent))
    })
    setNotice('Indholdet er nulstillet til standard. Husk at gemme.')
    setError(null)
    setJsonDraft(JSON.stringify(defaultSiteContent, null, 2))
  }

  return (
    <div className="section-soft w-full overflow-x-hidden py-10">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="panel-card mb-6 space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-eyebrow">Kun for administrator</p>
              <h1 className="mt-1 font-display text-3xl text-[color:var(--site-text)]">CMS redigeringspanel</h1>
              <p className="mt-2 text-sm text-[color:var(--site-muted)]">
                Her kan du administrere skabeloner, menu, sider, tekster og billeder.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={refreshState} className="btn-secondary">
                Opdater fra server
              </button>
              <button type="button" onClick={resetToDefaults} className="btn-secondary">
                Nulstil til standard
              </button>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                Log ud
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Gemmer...' : 'Gem'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`rounded-full px-3 py-1 font-semibold ${isDirty ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {isDirty ? 'Ikke-gemte ændringer' : 'Synkroniseret med gemt version'}
            </span>
            {saveStatus === 'saved' ? <span className="text-emerald-700">Seneste gemning lykkedes.</span> : null}
            {error ? <span className="text-rose-700">{error}</span> : null}
            {!error && notice ? <span className="text-sky-700">{notice}</span> : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="panel-card h-fit min-w-0 p-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id === 'advanced') {
                      setJsonDraft(JSON.stringify(draft.content, null, 2))
                    }
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-[color:var(--site-primary)] text-white'
                      : 'text-[color:var(--site-text)] hover:bg-[color:var(--site-panel-soft)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <form onSubmit={handleSave} className="min-w-0 space-y-6">
            {activeTab === 'company' ? (
              <>
                <EditorBox title="Virksomhedsoplysninger">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Firmanavn" value={draft.content.company.name} onChange={(value) => mutateContent((c) => (c.company.name = value))} />
                    <TextInput label="Telefonnummer (vist)" value={draft.content.company.phoneDisplay} onChange={(value) => mutateContent((c) => (c.company.phoneDisplay = value))} />
                    <TextInput label="Telefonlink (tel:)" value={draft.content.company.phoneHref} onChange={(value) => mutateContent((c) => (c.company.phoneHref = value))} />
                    <TextInput label="E-mail" type="email" value={draft.content.company.email} onChange={(value) => mutateContent((c) => (c.company.email = value))} />
                    <TextInput label="Adresse" value={draft.content.company.address} onChange={(value) => mutateContent((c) => (c.company.address = value))} />
                    <TextInput label="CVR" value={draft.content.company.cvr} onChange={(value) => mutateContent((c) => (c.company.cvr = value))} />
                    <TextInput label="Åbningstider" value={draft.content.company.openingHours} onChange={(value) => mutateContent((c) => (c.company.openingHours = value))} />
                  </div>
                  <ImagePickerField
                    label="Logo til mørke områder"
                    value={draft.content.company.logoUrl}
                    options={imageOptions}
                    onChange={(value) => mutateContent((c) => (c.company.logoUrl = value))}
                  />
                  <ImagePickerField
                    label="Logo til lyse / gule områder"
                    value={draft.content.company.logoUrlOnLight}
                    options={imageOptions}
                    onChange={(value) => mutateContent((c) => (c.company.logoUrlOnLight = value))}
                  />
                  <TextArea
                    label="Serviceområder (en pr. linje)"
                    rows={4}
                    value={draft.content.company.serviceAreas.join('\n')}
                    onChange={(value) => mutateContent((c) => (c.company.serviceAreas = linesToArray(value)))}
                  />
                </EditorBox>

                <EditorBox title="SEO-indstillinger">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Websteds-URL" type="url" value={draft.content.seo.siteUrl} onChange={(value) => mutateContent((c) => (c.seo.siteUrl = value))} />
                    <TextInput label="Sprogkode" value={draft.content.seo.locale} onChange={(value) => mutateContent((c) => (c.seo.locale = value))} />
                  </div>
                  <TextInput label="Metatitel" value={draft.content.seo.title} onChange={(value) => mutateContent((c) => (c.seo.title = value))} />
                  <TextArea label="Metabeskrivelse" value={draft.content.seo.description} onChange={(value) => mutateContent((c) => (c.seo.description = value))} rows={4} />
                </EditorBox>
              </>
            ) : null}

            {activeTab === 'home' ? (
              <>
                <EditorBox title="Topsektion">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Overlinje" value={draft.content.hero.eyebrow} onChange={(value) => mutateContent((c) => (c.hero.eyebrow = value))} />
                    <TextInput label="Primær knaptekst" value={draft.content.hero.primaryCtaLabel} onChange={(value) => mutateContent((c) => (c.hero.primaryCtaLabel = value))} />
                    <TextInput label="Primær knaplink" value={draft.content.hero.primaryCtaHref} onChange={(value) => mutateContent((c) => (c.hero.primaryCtaHref = value))} />
                    <TextInput label="Sekundær knaptekst" value={draft.content.hero.secondaryCtaLabel} onChange={(value) => mutateContent((c) => (c.hero.secondaryCtaLabel = value))} />
                    <TextInput label="Sekundær knaplink" value={draft.content.hero.secondaryCtaHref} onChange={(value) => mutateContent((c) => (c.hero.secondaryCtaHref = value))} />
                  </div>
                  <label className="block max-w-md space-y-2">
                    <span className="text-sm font-semibold text-[color:var(--site-text)]">Baggrundstype</span>
                    <select
                      value={draft.content.hero.backgroundType}
                      onChange={(event) => mutateContent((c) => (c.hero.backgroundType = event.target.value as 'image' | 'video'))}
                      className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                    >
                      <option value="image">Billede</option>
                      <option value="video">Video</option>
                    </select>
                  </label>
                  <ImagePickerField
                    label={draft.content.hero.backgroundType === 'video' ? 'Poster / fallback billede' : 'Baggrundsbillede URL'}
                    value={draft.content.hero.backgroundImage}
                    options={imageOptions}
                    onChange={(value) => mutateContent((c) => (c.hero.backgroundImage = value))}
                  />
                  {draft.content.hero.backgroundType === 'video' ? (
                    <VideoPickerField
                      label="Baggrundsvideo URL"
                      value={draft.content.hero.backgroundVideo}
                      options={videoOptions}
                      onChange={(value) => mutateContent((c) => (c.hero.backgroundVideo = value))}
                    />
                  ) : null}
                  {draft.content.hero.backgroundType === 'video' ? (
                    <p className="text-sm text-[color:var(--site-muted)]">
                      Videoen afspilles automatisk, muted og i loop. Billedet bruges som poster og fallback.
                    </p>
                  ) : null}
                  <TextInput label="Overskrift i topsektion" value={draft.content.hero.title} onChange={(value) => mutateContent((c) => (c.hero.title = value))} />
                  <TextArea label="Beskrivelse i topsektion" rows={5} value={draft.content.hero.text} onChange={(value) => mutateContent((c) => (c.hero.text = value))} />
                </EditorBox>

                <EditorBox title="Forside sektioner">
                  <p className="text-sm text-[color:var(--site-muted)]">
                    Her styrer du rækkefølge, aktivering og layout-variant for hver sektion på forsiden.
                  </p>

                  <div className="space-y-3">
                    {homeSections.map((section, index) => {
                      const meta = homeSectionCatalog[section.type]
                      const variantValue = section.variant ?? meta.variants[0] ?? ''

                      return (
                        <article key={`${section.type}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-4">
                          <div className="grid gap-3 md:grid-cols-[120px_1fr]">
                            <div className="h-20 rounded-xl border border-[color:var(--site-border)]" style={{ background: meta.preview }} />
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-semibold text-[color:var(--site-text)]">{meta.label}</h3>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="rounded-lg border border-[color:var(--site-border)] px-2 py-1 text-xs font-semibold"
                                    disabled={index === 0}
                                    onClick={() =>
                                      mutateContent((c) => {
                                        const sections = ensureHomeSections(c.pages.home.sections)
                                        const [current] = sections.splice(index, 1)
                                        sections.splice(index - 1, 0, current)
                                        c.pages.home.sections = sections
                                      })
                                    }
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    className="rounded-lg border border-[color:var(--site-border)] px-2 py-1 text-xs font-semibold"
                                    disabled={index === homeSections.length - 1}
                                    onClick={() =>
                                      mutateContent((c) => {
                                        const sections = ensureHomeSections(c.pages.home.sections)
                                        const [current] = sections.splice(index, 1)
                                        sections.splice(index + 1, 0, current)
                                        c.pages.home.sections = sections
                                      })
                                    }
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>
                              <p className="mt-1 text-xs text-[color:var(--site-muted)]">{meta.description}</p>

                              <div className="mt-3 grid gap-3 md:grid-cols-2">
                                <label className="flex items-center gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] px-3 py-2 text-sm font-semibold">
                                  <input
                                    type="checkbox"
                                    checked={section.enabled}
                                    onChange={(event) =>
                                      mutateContent((c) => {
                                        const sections = ensureHomeSections(c.pages.home.sections)
                                        sections[index].enabled = event.target.checked
                                        c.pages.home.sections = sections
                                      })
                                    }
                                    className="h-4 w-4 accent-[color:var(--site-primary)]"
                                  />
                                  Aktivér sektion
                                </label>

                                {meta.variants.length > 0 ? (
                                  <label className="block space-y-2">
                                    <span className="text-sm font-semibold text-[color:var(--site-text)]">Variant</span>
                                    <select
                                      value={variantValue}
                                      onChange={(event) =>
                                        mutateContent((c) => {
                                          const sections = ensureHomeSections(c.pages.home.sections)
                                          sections[index].variant = event.target.value
                                          c.pages.home.sections = sections
                                        })
                                      }
                                      className="w-full rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm text-[color:var(--site-text)] outline-none focus:border-[color:var(--site-focus)]"
                                    >
                                      {meta.variants.map((variant) => (
                                        <option key={variant} value={variant}>
                                          {variant}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                ) : (
                                  <div className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] px-3 py-2 text-sm text-[color:var(--site-muted)]">
                                    Denne sektion bruger standard-variant.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {orderedHomeSectionTypes
                      .filter((type) => !homeSections.some((section) => section.type === type))
                      .map((type) => (
                        <button
                          key={type}
                          type="button"
                          className="btn-secondary"
                          onClick={() =>
                            mutateContent((c) => {
                              const sections = ensureHomeSections(c.pages.home.sections)
                              sections.push({
                                type,
                                enabled: true,
                                variant: homeSectionCatalog[type].variants[0],
                              })
                              c.pages.home.sections = sections
                            })
                          }
                        >
                          Tilføj {homeSectionCatalog[type].label}
                        </button>
                      ))}
                  </div>
                </EditorBox>

                <EditorBox title="Tekstblokke på forsiden">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {(['services', 'process', 'projects', 'testimonials', 'about'] as const).map((key) => (
                      <div key={key} className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] p-4">
                        <h3 className="font-semibold capitalize text-[color:var(--site-text)]">{key}</h3>
                        <div className="mt-3 space-y-3">
                          <TextInput
                            label="Overlinje"
                            value={draft.content.pages.home[key].eyebrow ?? ''}
                            onChange={(value) => mutateContent((c) => (c.pages.home[key].eyebrow = value))}
                          />
                          <TextInput
                            label="Overskrift"
                            value={draft.content.pages.home[key].title}
                            onChange={(value) => mutateContent((c) => (c.pages.home[key].title = value))}
                          />
                          <TextArea
                            label="Indledning"
                            rows={3}
                            value={draft.content.pages.home[key].intro}
                            onChange={(value) => mutateContent((c) => (c.pages.home[key].intro = value))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </EditorBox>

                <EditorBox title="Tillidspunkter og virksomhedshistorie">
                  <TextArea
                    label="Tillidspunkter (en pr. linje)"
                    rows={5}
                    value={draft.content.trustPoints.join('\n')}
                    onChange={(value) => mutateContent((c) => (c.trustPoints = linesToArray(value)))}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Overskrift til virksomhedshistorie" value={draft.content.companyStory.title} onChange={(value) => mutateContent((c) => (c.companyStory.title = value))} />
                    <TextArea label="Indledning til virksomhedshistorie" rows={4} value={draft.content.companyStory.intro} onChange={(value) => mutateContent((c) => (c.companyStory.intro = value))} />
                  </div>
                  <TextArea
                    label="Punkter i virksomhedshistorie (en pr. linje)"
                    rows={5}
                    value={draft.content.companyStory.points.join('\n')}
                    onChange={(value) => mutateContent((c) => (c.companyStory.points = linesToArray(value)))}
                  />
                </EditorBox>

                <EditorBox title="CTA-boks på forsiden">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput label="Overlinje" value={draft.content.pages.home.aboutCta.eyebrow} onChange={(value) => mutateContent((c) => (c.pages.home.aboutCta.eyebrow = value))} />
                    <TextInput label="Overskrift" value={draft.content.pages.home.aboutCta.title} onChange={(value) => mutateContent((c) => (c.pages.home.aboutCta.title = value))} />
                    <TextInput label="Primær tekst" value={draft.content.pages.home.aboutCta.primaryLabel} onChange={(value) => mutateContent((c) => (c.pages.home.aboutCta.primaryLabel = value))} />
                    <TextInput label="Sekundær tekst" value={draft.content.pages.home.aboutCta.secondaryLabel} onChange={(value) => mutateContent((c) => (c.pages.home.aboutCta.secondaryLabel = value))} />
                  </div>
                  <TextArea label="Tekst" value={draft.content.pages.home.aboutCta.text} onChange={(value) => mutateContent((c) => (c.pages.home.aboutCta.text = value))} rows={4} />
                </EditorBox>

                <EditorBox title="Forside - tekstblok nederst">
                  <NarrativeFields
                    value={draft.content.pages.home.narrative}
                    onChange={(value) => mutateContent((c) => (c.pages.home.narrative = value))}
                  />
                </EditorBox>
              </>
            ) : null}

            {activeTab === 'services' ? (
              <>
                <EditorBox title="Ydelser sideoverskrift">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Overlinje"
                      value={draft.content.pages.services.eyebrow ?? ''}
                      onChange={(value) => mutateContent((c) => (c.pages.services.eyebrow = value))}
                    />
                    <TextInput
                      label="Overskrift"
                      value={draft.content.pages.services.title}
                      onChange={(value) => mutateContent((c) => (c.pages.services.title = value))}
                    />
                  </div>
                  <TextArea
                    label="Indledning"
                    rows={4}
                    value={draft.content.pages.services.intro}
                    onChange={(value) => mutateContent((c) => (c.pages.services.intro = value))}
                  />
                </EditorBox>

                <EditorBox title="Ydelser - tekstblok nederst">
                  <NarrativeFields
                    value={draft.content.pages.services.narrative}
                    onChange={(value) => mutateContent((c) => (c.pages.services.narrative = value))}
                  />
                </EditorBox>

                <EditorBox
                  title="Ydelseskort"
                  actions={
                    <button
                      type="button"
                      onClick={() =>
                        mutateContent((c) => {
                          const nextIndex = c.services.length + 1
                          c.services.push({
                            slug: `service-${nextIndex}`,
                            title: `Ny ydelse ${nextIndex}`,
                            icon: `${nextIndex}`.padStart(2, '0'),
                            short: 'Kort beskrivelse',
                            description: 'Uddybende beskrivelse',
                            includes: ['Punkt 1'],
                            idealFor: ['Anvendelsesområde 1'],
                            image: '',
                          })
                        })
                      }
                      className="btn-secondary"
                    >
                      Tilføj ydelse
                    </button>
                  }
                >
                  <div className="space-y-5">
                    {draft.content.services.map((service, index) => (
                      <article key={`${service.slug}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-[color:var(--site-text)]">Ydelse #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() =>
                              mutateContent((c) => {
                                c.services.splice(index, 1)
                              })
                            }
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                          >
                            Slet
                          </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <TextInput
                            label="Overskrift"
                            value={service.title}
                            onChange={(value) => mutateContent((c) => (c.services[index].title = value))}
                          />
                          <div className="space-y-2">
                            <TextInput
                              label="URL-segment"
                              value={service.slug}
                              onChange={(value) => mutateContent((c) => (c.services[index].slug = slugify(value)))}
                            />
                            <button
                              type="button"
                              className="rounded-lg bg-[color:var(--site-primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--site-primary-strong)]"
                              onClick={() => mutateContent((c) => (c.services[index].slug = slugify(c.services[index].title)))}
                            >
                              Opret slug fra overskrift
                            </button>
                          </div>
                          <TextInput
                            label="Kort beskrivelse til kort"
                            value={service.short}
                            onChange={(value) => mutateContent((c) => (c.services[index].short = value))}
                          />
                          <TextInput
                            label="Ikon (fx BR, IN)"
                            value={service.icon ?? ''}
                            onChange={(value) => mutateContent((c) => (c.services[index].icon = value))}
                          />
                        </div>
                        <ImagePickerField
                          label="Billede-URL"
                          value={service.image}
                          options={imageOptions}
                          onChange={(value) => mutateContent((c) => (c.services[index].image = value))}
                        />

                        <TextArea
                          label="Uddybende beskrivelse"
                          rows={4}
                          value={service.description}
                          onChange={(value) => mutateContent((c) => (c.services[index].description = value))}
                        />

                        <div className="grid gap-3 md:grid-cols-2">
                          <TextArea
                            label="Indhold (en pr. linje)"
                            rows={4}
                            value={service.includes.join('\n')}
                            onChange={(value) => mutateContent((c) => (c.services[index].includes = linesToArray(value)))}
                          />
                          <TextArea
                            label="Velegnet til (en pr. linje)"
                            rows={4}
                            value={service.idealFor.join('\n')}
                            onChange={(value) => mutateContent((c) => (c.services[index].idealFor = linesToArray(value)))}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </EditorBox>

                <EditorBox
                  title="Procestrin"
                  actions={
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        mutateContent((c) => {
                          c.processSteps.push({ title: 'Nyt trin', text: 'Beskrivelse' })
                        })
                      }
                    >
                      Tilføj trin
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {draft.content.processSteps.map((step, index) => (
                      <div key={`${step.title}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] p-4">
                        <div className="mb-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              mutateContent((c) => {
                                c.processSteps.splice(index, 1)
                              })
                            }
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                          >
                            Slet
                          </button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <TextInput label="Overskrift" value={step.title} onChange={(value) => mutateContent((c) => (c.processSteps[index].title = value))} />
                          <TextArea label="Tekst" rows={3} value={step.text} onChange={(value) => mutateContent((c) => (c.processSteps[index].text = value))} />
                        </div>
                      </div>
                    ))}
                  </div>
                </EditorBox>

                <EditorBox
                  title="Anmeldelser"
                  actions={
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        mutateContent((c) => {
                          c.testimonials.push({ quote: 'Ny anmeldelse', name: 'Kundenavn' })
                        })
                      }
                    >
                      Tilføj anmeldelse
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {draft.content.testimonials.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] p-4">
                        <div className="mb-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              mutateContent((c) => {
                                c.testimonials.splice(index, 1)
                              })
                            }
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                          >
                            Slet
                          </button>
                        </div>
                        <TextInput label="Kundenavn" value={item.name} onChange={(value) => mutateContent((c) => (c.testimonials[index].name = value))} />
                        <TextArea label="Anmeldelsestekst" rows={4} value={item.quote} onChange={(value) => mutateContent((c) => (c.testimonials[index].quote = value))} />
                      </div>
                    ))}
                  </div>
                </EditorBox>
              </>
            ) : null}

            {activeTab === 'gallery' ? (
              <>
                <EditorBox title="Galleri sidetekst">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Overlinje"
                      value={draft.content.pages.gallery.eyebrow ?? ''}
                      onChange={(value) => mutateContent((c) => (c.pages.gallery.eyebrow = value))}
                    />
                    <TextInput
                      label="Overskrift"
                      value={draft.content.pages.gallery.title}
                      onChange={(value) => mutateContent((c) => (c.pages.gallery.title = value))}
                    />
                  </div>
                  <TextArea
                    label="Indledning"
                    rows={4}
                    value={draft.content.pages.gallery.intro}
                    onChange={(value) => mutateContent((c) => (c.pages.gallery.intro = value))}
                  />
                </EditorBox>

                <EditorBox title="Galleri - tekstblok nederst">
                  <NarrativeFields
                    value={draft.content.pages.gallery.narrative}
                    onChange={(value) => mutateContent((c) => (c.pages.gallery.narrative = value))}
                  />
                </EditorBox>

                <EditorBox
                  title="Galleribilleder"
                  actions={
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        mutateContent((c) => {
                          c.galleryImages.push({
                            src: imageOptions[0]?.url ?? '',
                            alt: 'Nyt galleribillede',
                            title: 'Nyt projekt',
                            category: 'Projekt',
                            href: '/galleri',
                          })
                        })
                      }
                    >
                      Tilføj billede
                    </button>
                  }
                >
                  <div className="space-y-4">
                    {draft.content.galleryImages.map((image, index) => (
                      <div key={`${image.src}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[color:var(--site-text)]">Billede #{index + 1}</p>
                          <button
                            type="button"
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                            onClick={() =>
                              mutateContent((c) => {
                                c.galleryImages.splice(index, 1)
                              })
                            }
                          >
                            Slet
                          </button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                          <div className="space-y-3">
                            <ImagePickerField
                              label="Billede-URL"
                              value={image.src}
                              options={imageOptions}
                              onChange={(value) => mutateContent((c) => (c.galleryImages[index].src = value))}
                            />
                            <TextInput
                              label="Alt-tekst"
                              value={image.alt}
                              onChange={(value) => mutateContent((c) => (c.galleryImages[index].alt = value))}
                            />
                            <div className="grid gap-3 md:grid-cols-2">
                              <TextInput
                                label="Titel"
                                value={image.title ?? ''}
                                onChange={(value) => mutateContent((c) => (c.galleryImages[index].title = value))}
                              />
                              <TextInput
                                label="Kategori"
                                value={image.category ?? ''}
                                onChange={(value) => mutateContent((c) => (c.galleryImages[index].category = value))}
                              />
                            </div>
                            <TextInput
                              label="Detail-link"
                              value={image.href ?? ''}
                              onChange={(value) => mutateContent((c) => (c.galleryImages[index].href = value))}
                            />
                          </div>
                          {image.src ? (
                            <div className="relative h-36 w-full overflow-hidden rounded-xl border border-[color:var(--site-border)]">
                              <Image
                                src={withSiteBasePath(image.src)}
                                alt={image.alt}
                                fill
                                sizes="220px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-[color:var(--site-border)] text-xs text-[color:var(--site-muted)]">
                              Ingen forhåndsvisning
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </EditorBox>
              </>
            ) : null}

            {activeTab === 'pages' ? (
              <>
                <EditorBox title="Om os-side">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Overlinje i topsektion"
                      value={draft.content.pages.about.hero.eyebrow ?? ''}
                      onChange={(value) => mutateContent((c) => (c.pages.about.hero.eyebrow = value))}
                    />
                    <TextInput
                      label="Overskrift i topsektion"
                      value={draft.content.pages.about.hero.title}
                      onChange={(value) => mutateContent((c) => (c.pages.about.hero.title = value))}
                    />
                  </div>
                  <TextArea
                    label="Indledning i topsektion"
                    rows={4}
                    value={draft.content.pages.about.hero.intro}
                    onChange={(value) => mutateContent((c) => (c.pages.about.hero.intro = value))}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Hvorfor-overskrift"
                      value={draft.content.pages.about.whyTitle}
                      onChange={(value) => mutateContent((c) => (c.pages.about.whyTitle = value))}
                    />
                    <TextInput
                      label="Princip-overskrift"
                      value={draft.content.pages.about.principleTitle}
                      onChange={(value) => mutateContent((c) => (c.pages.about.principleTitle = value))}
                    />
                  </div>
                  <TextArea
                    label="Hvorfor-punkter (en pr. linje)"
                    rows={4}
                    value={draft.content.pages.about.whyPoints.join('\n')}
                    onChange={(value) => mutateContent((c) => (c.pages.about.whyPoints = linesToArray(value)))}
                  />
                  <TextArea
                    label="Principtekst"
                    rows={4}
                    value={draft.content.pages.about.principleText}
                    onChange={(value) => mutateContent((c) => (c.pages.about.principleText = value))}
                  />
                </EditorBox>

                <EditorBox title="Om os - tekstblok nederst">
                  <NarrativeFields
                    value={draft.content.pages.about.narrative}
                    onChange={(value) => mutateContent((c) => (c.pages.about.narrative = value))}
                  />
                </EditorBox>

                <EditorBox title="Kontaktside">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Overlinje i topsektion"
                      value={draft.content.pages.contact.hero.eyebrow ?? ''}
                      onChange={(value) => mutateContent((c) => (c.pages.contact.hero.eyebrow = value))}
                    />
                    <TextInput
                      label="Overskrift i topsektion"
                      value={draft.content.pages.contact.hero.title}
                      onChange={(value) => mutateContent((c) => (c.pages.contact.hero.title = value))}
                    />
                  </div>
                  <TextArea
                    label="Indledning i topsektion"
                    rows={4}
                    value={draft.content.pages.contact.hero.intro}
                    onChange={(value) => mutateContent((c) => (c.pages.contact.hero.intro = value))}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextInput
                      label="Etiket: Telefon"
                      value={draft.content.pages.contact.cardLabels.phone}
                      onChange={(value) => mutateContent((c) => (c.pages.contact.cardLabels.phone = value))}
                    />
                    <TextInput
                      label="Etiket: E-mail"
                      value={draft.content.pages.contact.cardLabels.email}
                      onChange={(value) => mutateContent((c) => (c.pages.contact.cardLabels.email = value))}
                    />
                    <TextInput
                      label="Etiket: Adresse"
                      value={draft.content.pages.contact.cardLabels.address}
                      onChange={(value) => mutateContent((c) => (c.pages.contact.cardLabels.address = value))}
                    />
                    <TextInput
                      label="Etiket: Åbningstider"
                      value={draft.content.pages.contact.cardLabels.openingHours}
                      onChange={(value) => mutateContent((c) => (c.pages.contact.cardLabels.openingHours = value))}
                    />
                  </div>
                </EditorBox>

                <EditorBox title="Kontakt - tekstblok nederst">
                  <NarrativeFields
                    value={draft.content.pages.contact.narrative}
                    onChange={(value) => mutateContent((c) => (c.pages.contact.narrative = value))}
                  />
                </EditorBox>

                <EditorBox
                  title="Ekstra sider (brugerdefinerede)"
                  actions={
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        mutateContent((c) => {
                          const idx = c.customPages.length + 1
                          c.customPages.push({
                            slug: `side-${idx}`,
                            menuLabel: `Side ${idx}`,
                            title: `Ny side ${idx}`,
                            intro: 'Sideintroduktion',
                            showInMenu: true,
                            sections: [{ heading: 'Sektionsoverskrift', text: 'Sektionstekst', bullets: [] }],
                          })
                        })
                      }
                    >
                      Tilføj ny side
                    </button>
                  }
                >
                  <TextInput
                    label="Overlinje for ekstra sider"
                    value={draft.content.pages.customPages.eyebrow ?? ''}
                    onChange={(value) => mutateContent((c) => (c.pages.customPages.eyebrow = value))}
                  />
                  <TextInput
                    label="Overskrift for ekstra sider"
                    value={draft.content.pages.customPages.title}
                    onChange={(value) => mutateContent((c) => (c.pages.customPages.title = value))}
                  />
                  <TextArea
                    label="Indledning for ekstra sider"
                    rows={3}
                    value={draft.content.pages.customPages.intro}
                    onChange={(value) => mutateContent((c) => (c.pages.customPages.intro = value))}
                  />

                  <div className="space-y-5">
                    {draft.content.customPages.map((page, pageIndex) => (
                      <article key={`${page.slug}-${pageIndex}`} className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-[color:var(--site-text)]">Side #{pageIndex + 1}</h3>
                          <button
                            type="button"
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                            onClick={() =>
                              mutateContent((c) => {
                                c.customPages.splice(pageIndex, 1)
                              })
                            }
                          >
                            Slet side
                          </button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <TextInput
                            label="Menutekst"
                            value={page.menuLabel}
                            onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].menuLabel = value))}
                          />
                          <div className="space-y-2">
                            <TextInput
                              label="URL-segment"
                              value={page.slug}
                              onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].slug = slugify(value)))}
                            />
                            <button
                              type="button"
                              className="rounded-lg bg-[color:var(--site-primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--site-primary-strong)]"
                              onClick={() => mutateContent((c) => (c.customPages[pageIndex].slug = slugify(c.customPages[pageIndex].title)))}
                            >
                              Opret slug fra overskrift
                            </button>
                          </div>
                          <TextInput
                            label="Sideoverskrift"
                            value={page.title}
                            onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].title = value))}
                          />
                          <label className="flex items-center gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={page.showInMenu}
                              onChange={(event) => mutateContent((c) => (c.customPages[pageIndex].showInMenu = event.target.checked))}
                              className="h-4 w-4 accent-[color:var(--site-primary)]"
                            />
                            Vis i menu
                          </label>
                        </div>

                        <TextArea
                          label="Sideintro"
                          rows={3}
                          value={page.intro}
                          onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].intro = value))}
                        />

                        <div className="space-y-3">
                          {page.sections.map((section, sectionIndex) => (
                            <div key={`${section.heading}-${sectionIndex}`} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-3">
                              <div className="mb-2 flex justify-end">
                                <button
                                  type="button"
                                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                                  onClick={() =>
                                    mutateContent((c) => {
                                      c.customPages[pageIndex].sections.splice(sectionIndex, 1)
                                    })
                                  }
                                >
                                  Slet sektion
                                </button>
                              </div>
                              <div className="grid gap-3 md:grid-cols-2">
                                <TextInput
                                  label="Sektionsoverskrift"
                                  value={section.heading}
                                  onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].sections[sectionIndex].heading = value))}
                                />
                                <TextArea
                                  label="Sektionstekst"
                                  rows={3}
                                  value={section.text}
                                  onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].sections[sectionIndex].text = value))}
                                />
                              </div>
                              <TextArea
                                label="Punktliste (en pr. linje)"
                                rows={3}
                                value={section.bullets.join('\n')}
                                onChange={(value) => mutateContent((c) => (c.customPages[pageIndex].sections[sectionIndex].bullets = linesToArray(value)))}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() =>
                              mutateContent((c) => {
                                c.customPages[pageIndex].sections.push({
                                  heading: 'Ny sektion',
                                  text: 'Sektionstekst',
                                  bullets: [],
                                })
                              })
                            }
                          >
                            Tilføj sektion
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </EditorBox>

                <EditorBox title="Privatlivspolitik">
                  <TextInput
                    label="Overskrift på privatlivsside"
                    value={draft.content.pages.privacy.title}
                    onChange={(value) => mutateContent((c) => (c.pages.privacy.title = value))}
                  />
                  <div className="space-y-3">
                    {draft.content.pages.privacy.sections.map((section, index) => (
                      <div key={`${section.heading}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] p-4">
                        <div className="mb-2 flex justify-end">
                          <button
                            type="button"
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                            onClick={() =>
                              mutateContent((c) => {
                                c.pages.privacy.sections.splice(index, 1)
                              })
                            }
                          >
                            Slet
                          </button>
                        </div>
                        <TextInput
                          label="Overskrift"
                          value={section.heading}
                          onChange={(value) => mutateContent((c) => (c.pages.privacy.sections[index].heading = value))}
                        />
                        <TextArea
                          label="Tekst"
                          rows={4}
                          value={section.text}
                          onChange={(value) => mutateContent((c) => (c.pages.privacy.sections[index].text = value))}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      mutateContent((c) => {
                        c.pages.privacy.sections.push({
                          heading: 'Ny overskrift',
                          text: 'Ny tekst',
                        })
                      })
                    }
                  >
                    Tilføj privatlivssektion
                  </button>
                </EditorBox>
              </>
            ) : null}

            {activeTab === 'navigation' ? (
              <EditorBox
                title="Menu-navigering"
                actions={
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() =>
                      mutateContent((c) => {
                        c.navigation.push({
                          label: 'Nyt menupunkt',
                          href: '/nyt-menupunkt',
                          icon: 'NY',
                          highlight: false,
                          children: [],
                          show: true,
                        })
                      })
                    }
                  >
                    Tilføj menupunkt
                  </button>
                }
              >
                <p className="text-sm text-[color:var(--site-muted)]">
                  Denne menu styrer header-navigation, dropdown-undersider, ikonmærker og highlight på udvalgte punkter.
                </p>
                <div className="space-y-3">
                  {draft.content.navigation.map((item, index) => (
                    <article key={`${item.href}-${index}`} className="rounded-2xl border border-[color:var(--site-border)] p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[color:var(--site-text)]">Menupunkt #{index + 1}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="rounded-lg border border-[color:var(--site-border)] px-2 py-1 text-xs font-semibold"
                            disabled={index === 0}
                            onClick={() =>
                              mutateContent((c) => {
                                const [current] = c.navigation.splice(index, 1)
                                c.navigation.splice(index - 1, 0, current)
                              })
                            }
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-[color:var(--site-border)] px-2 py-1 text-xs font-semibold"
                            disabled={index === draft.content.navigation.length - 1}
                            onClick={() =>
                              mutateContent((c) => {
                                const [current] = c.navigation.splice(index, 1)
                                c.navigation.splice(index + 1, 0, current)
                              })
                            }
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                            onClick={() =>
                              mutateContent((c) => {
                                c.navigation.splice(index, 1)
                              })
                            }
                          >
                            Slet
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <TextInput
                          label="Etiket"
                          value={item.label}
                          onChange={(value) => mutateContent((c) => (c.navigation[index].label = value))}
                        />
                        <TextInput
                          label="Link"
                          value={item.href}
                          onChange={(value) => mutateContent((c) => (c.navigation[index].href = value))}
                        />
                        <TextInput
                          label="Ikon"
                          value={item.icon ?? ''}
                          onChange={(value) => mutateContent((c) => (c.navigation[index].icon = value))}
                        />
                        <label className="flex items-center gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={Boolean(item.highlight)}
                            onChange={(event) => mutateContent((c) => (c.navigation[index].highlight = event.target.checked))}
                            className="h-4 w-4 accent-[color:var(--site-primary)]"
                          />
                          Highlight
                        </label>
                      </div>

                      <label className="mt-3 flex items-center gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-3 py-2 text-sm font-semibold">
                        <input
                          type="checkbox"
                          checked={item.show}
                          onChange={(event) => mutateContent((c) => (c.navigation[index].show = event.target.checked))}
                          className="h-4 w-4 accent-[color:var(--site-primary)]"
                        />
                        Vis i menu
                      </label>

                      <div className="mt-4 rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--site-muted)]">Dropdown-undersider</h4>
                          <button
                            type="button"
                            className="rounded-lg bg-[color:var(--site-primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--site-primary-strong)]"
                            onClick={() =>
                              mutateContent((c) => {
                                if (!c.navigation[index].children) {
                                  c.navigation[index].children = []
                                }
                                c.navigation[index].children!.push({
                                  label: 'Ny underside',
                                  href: '/ydelser/ny',
                                  icon: 'NY',
                                  highlight: false,
                                  children: [],
                                })
                              })
                            }
                          >
                            Tilføj underside
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(item.children ?? []).map((child, childIndex) => (
                            <div key={`${child.href}-${childIndex}`} className="grid gap-2 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-3 md:grid-cols-4">
                              <TextInput
                                label="Etiket"
                                value={child.label}
                                onChange={(value) =>
                                  mutateContent((c) => {
                                    if (!c.navigation[index].children) return
                                    c.navigation[index].children![childIndex].label = value
                                  })
                                }
                              />
                              <TextInput
                                label="Link"
                                value={child.href}
                                onChange={(value) =>
                                  mutateContent((c) => {
                                    if (!c.navigation[index].children) return
                                    c.navigation[index].children![childIndex].href = value
                                  })
                                }
                              />
                              <TextInput
                                label="Ikon"
                                value={child.icon ?? ''}
                                onChange={(value) =>
                                  mutateContent((c) => {
                                    if (!c.navigation[index].children) return
                                    c.navigation[index].children![childIndex].icon = value
                                  })
                                }
                              />
                              <div className="flex items-end justify-end">
                                <button
                                  type="button"
                                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700"
                                  onClick={() =>
                                    mutateContent((c) => {
                                      if (!c.navigation[index].children) return
                                      c.navigation[index].children!.splice(childIndex, 1)
                                    })
                                  }
                                >
                                  Slet
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </EditorBox>
            ) : null}

            {activeTab === 'quote' ? (
              <EditorBox title="Tilbudsformular">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput label="Formulartitel" value={draft.content.quoteForm.title} onChange={(value) => mutateContent((c) => (c.quoteForm.title = value))} />
                  <TextInput label="Formularoverskrift" value={draft.content.quoteForm.heading} onChange={(value) => mutateContent((c) => (c.quoteForm.heading = value))} />
                </div>
                <TextArea label="Formularintro" rows={3} value={draft.content.quoteForm.intro} onChange={(value) => mutateContent((c) => (c.quoteForm.intro = value))} />

                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput label="Etiket: Navn" value={draft.content.quoteForm.labels.name} onChange={(value) => mutateContent((c) => (c.quoteForm.labels.name = value))} />
                  <TextInput label="Etiket: Telefon" value={draft.content.quoteForm.labels.phone} onChange={(value) => mutateContent((c) => (c.quoteForm.labels.phone = value))} />
                  <TextInput label="Etiket: E-mail" value={draft.content.quoteForm.labels.email} onChange={(value) => mutateContent((c) => (c.quoteForm.labels.email = value))} />
                  <TextInput label="Etiket: Område" value={draft.content.quoteForm.labels.location} onChange={(value) => mutateContent((c) => (c.quoteForm.labels.location = value))} />
                  <TextInput label="Etiket: Opgave" value={draft.content.quoteForm.labels.task} onChange={(value) => mutateContent((c) => (c.quoteForm.labels.task = value))} />
                  <TextInput label="Etiket: Send-knap" value={draft.content.quoteForm.labels.submit} onChange={(value) => mutateContent((c) => (c.quoteForm.labels.submit = value))} />
                </div>
                <TextArea
                  label="Etiket: Samtykke"
                  rows={2}
                  value={draft.content.quoteForm.labels.consent}
                  onChange={(value) => mutateContent((c) => (c.quoteForm.labels.consent = value))}
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <TextArea
                    label="Succesbesked"
                    rows={3}
                    value={draft.content.quoteForm.messages.success}
                    onChange={(value) => mutateContent((c) => (c.quoteForm.messages.success = value))}
                  />
                  <TextArea
                    label="Fejlbesked"
                    rows={3}
                    value={draft.content.quoteForm.messages.error}
                    onChange={(value) => mutateContent((c) => (c.quoteForm.messages.error = value))}
                  />
                </div>
              </EditorBox>
            ) : null}

            {activeTab === 'media' ? (
              <EditorBox title="Mediebibliotek">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="btn-secondary cursor-pointer">
                    {uploading ? 'Uploader...' : 'Upload medie'}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.mp4,.webm,.mov,.m4v"
                      className="hidden"
                      onChange={(event) => {
                        void uploadMedia(event)
                      }}
                      disabled={uploading}
                    />
                  </label>
                  <button type="button" onClick={() => void loadMedia()} className="btn-secondary">
                    Opdater liste
                  </button>
                  <p className="text-xs text-[color:var(--site-muted)]">
                    Lokalt samles filer i `public/uploads`, men pÃ¥ Vercel bÃ¸r permanente medier ligge pÃ¥ kundens eget domÃ¦ne,
                    f.eks. <span className="font-semibold">https://tbgruppen.dk/uploads/filnavn.png</span>.
                  </p>
                </div>

                {mediaLoading ? <p className="text-sm text-[color:var(--site-muted)]">Medier indlæses...</p> : null}

                {!mediaLoading && mediaFiles.length === 0 ? (
                  <p className="text-sm text-[color:var(--site-muted)]">Der er endnu ingen uploadede medier.</p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {mediaFiles.map((file) => (
                    <article key={file.name} className="rounded-2xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-3">
                      <div className="relative h-36 overflow-hidden rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)]">
                        {getMediaKind(file.url) === 'video' ? (
                          <video className="h-full w-full object-cover" controls muted playsInline preload="metadata">
                            <source src={withSiteBasePath(file.url)} />
                          </video>
                        ) : (
                          <Image src={withSiteBasePath(file.url)} alt={file.name} fill sizes="320px" className="object-cover" />
                        )}
                      </div>
                      <p className="mt-2 truncate text-sm font-semibold text-[color:var(--site-text)]">{file.name}</p>
                      <p className="mt-1 text-xs text-[color:var(--site-muted)]">
                        {formatBytes(file.size)} • {new Date(file.updatedAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--site-muted)]">
                        {getMediaKind(file.url) === 'video' ? 'Video' : 'Billede'}
                      </p>
                      <p className="mt-1 truncate text-xs text-[color:var(--site-muted)]">{file.url}</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={() => void copyUrl(file.url)}>
                          Kopier URL
                        </button>
                        <button type="button" className="rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700" onClick={() => void deleteMedia(file.name)}>
                          Slet
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </EditorBox>
            ) : null}

            {activeTab === 'advanced' ? (
              <EditorBox title="Avanceret JSON-editor">
                <p className="text-sm text-[color:var(--site-muted)]">
                  Her kan du redigere alt indhold som JSON. Når du vælger "Anvend JSON", opdateres kladden midlertidigt. Brug derefter "Gem" for at gøre ændringerne permanente.
                </p>
                <textarea
                  value={jsonDraft}
                  onChange={(event) => setJsonDraft(event.target.value)}
                  rows={26}
                  className="w-full rounded-xl border border-[color:var(--site-border)] bg-[#0b1020] p-4 font-mono text-xs text-slate-100 outline-none focus:border-sky-400"
                />
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary" onClick={applyJsonToDraft}>
                    Anvend JSON
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setJsonDraft(JSON.stringify(draft.content, null, 2))
                      setNotice('JSON-editoren er synkroniseret med den aktuelle kladde.')
                    }}
                  >
                    Opdater fra kladde
                  </button>
                </div>
              </EditorBox>
            ) : null}

            <div className="panel-card flex flex-wrap items-center justify-end gap-3 p-4">
              <button type="button" className="btn-secondary" onClick={refreshState}>
                Genindlæs
              </button>
              <button
                type="submit"
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Gemmer...' : 'Gem ændringer'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <datalist id="media-image-list">
        {imageOptions.map((option) => (
          <option key={option.url} value={option.url} />
        ))}
      </datalist>

      <datalist id="media-video-list">
        {videoOptions.map((option) => (
          <option key={option.url} value={option.url} />
        ))}
      </datalist>

      <datalist id="media-url-list">
        {mediaUrlOptions.map((option) => (
          <option key={option.url} value={option.url} />
        ))}
      </datalist>
    </div>
  )
}

