import cmsState from '../../data/cms-state.json'

export type TemplateTextBlock = {
  eyebrow?: string
  title: string
  intro: string
}

export type NarrativeContent = {
  eyebrow: string
  title: string
  intro: string
  paragraphs: string[]
  highlights: string[]
}

export type NavItem = {
  label: string
  href: string
  children?: NavItem[]
  icon?: string
  highlight?: boolean
}

export type SiteNavItem = NavItem & {
  show: boolean
}

export type CustomPageSection = {
  heading: string
  text: string
  bullets: string[]
}

export type CustomPage = {
  slug: string
  menuLabel: string
  title: string
  intro: string
  showInMenu: boolean
  sections: CustomPageSection[]
}

export type Service = {
  slug: string
  title: string
  icon?: string
  short: string
  description: string
  includes: string[]
  idealFor: string[]
  image: string
}

export type ProjectImage = {
  src: string
  alt: string
  title?: string
  category?: string
  href?: string
}

export type Testimonial = {
  quote: string
  name: string
}

export type PrivacySection = {
  heading: string
  text: string
}

export type HomeSectionType =
  | 'hero'
  | 'trustStrip'
  | 'servicesGrid'
  | 'projectsGallery'
  | 'process'
  | 'testimonials'
  | 'ctaBanner'

export type HomeSection = {
  type: HomeSectionType
  enabled: boolean
  variant?: string
}

export type SiteContent = {
  company: {
    name: string
    logoUrl: string
    logoUrlOnLight: string
    phoneDisplay: string
    phoneHref: string
    email: string
    address: string
    cvr: string
    openingHours: string
    serviceAreas: string[]
  }
  navigation: SiteNavItem[]
  hero: {
    eyebrow: string
    title: string
    text: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
    backgroundType: 'image' | 'video'
    backgroundImage: string
    backgroundVideo: string
  }
  trustPoints: string[]
  services: Service[]
  processSteps: Array<{ title: string; text: string }>
  testimonials: Testimonial[]
  galleryImages: ProjectImage[]
  companyStory: {
    title: string
    intro: string
    points: string[]
  }
  quoteForm: {
    title: string
    heading: string
    intro: string
    labels: {
      name: string
      phone: string
      email: string
      location: string
      task: string
      consent: string
      submit: string
    }
    messages: {
      success: string
      error: string
    }
  }
  pages: {
    home: {
      sections: HomeSection[]
      services: TemplateTextBlock
      process: TemplateTextBlock
      projects: TemplateTextBlock
      testimonials: TemplateTextBlock
      about: TemplateTextBlock
      aboutCta: {
        eyebrow: string
        title: string
        text: string
        primaryLabel: string
        secondaryLabel: string
      }
      narrative: NarrativeContent
    }
    services: TemplateTextBlock & {
      narrative: NarrativeContent
    }
    gallery: TemplateTextBlock & {
      narrative: NarrativeContent
    }
    about: {
      hero: TemplateTextBlock
      whyTitle: string
      whyPoints: string[]
      principleTitle: string
      principleText: string
      narrative: NarrativeContent
    }
    contact: {
      hero: TemplateTextBlock
      cardLabels: {
        phone: string
        email: string
        address: string
        openingHours: string
      }
      narrative: NarrativeContent
    }
    customPages: TemplateTextBlock
    privacy: {
      title: string
      sections: PrivacySection[]
    }
  }
  customPages: CustomPage[]
  seo: {
    siteUrl: string
    title: string
    description: string
    locale: string
  }
}

const cmsDefaultContent = (cmsState as { content: SiteContent }).content

export const defaultSiteContent: SiteContent = cmsDefaultContent

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function deepMergeWithDefaults<T>(defaults: T, incoming: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(incoming)) {
      return deepClone(defaults)
    }

    if (defaults.length === 0) {
      return deepClone(incoming) as T
    }

    return incoming.map((item, index) => deepMergeWithDefaults(defaults[index] ?? defaults[0], item)) as T
  }

  if (isObject(defaults)) {
    const output: Record<string, unknown> = {}
    const source = isObject(incoming) ? incoming : {}

    for (const [key, value] of Object.entries(defaults)) {
      output[key] = deepMergeWithDefaults(value, source[key])
    }

    return output as T
  }

  if (typeof incoming === typeof defaults) {
    return incoming as T
  }

  return defaults
}

export function resolveSiteContent(input: unknown): SiteContent {
  return deepMergeWithDefaults(defaultSiteContent, input)
}

export function getNavItems(content: SiteContent): NavItem[] {
  const customChildren = content.customPages
    .filter((page) => page.showInMenu)
    .map(
      (page) =>
        ({
          label: page.menuLabel,
          href: `/sider/${page.slug}`,
          icon: 'PG',
        }) satisfies NavItem
    )

  const base = content.navigation
    .filter((item) => item.show)
    .map((item) => {
      const itemChildren =
        item.children && item.children.length > 0
          ? item.children
          : item.href === '/ydelser'
            ? content.services.slice(0, 6).map((service) => ({
                label: service.title,
                href: `/ydelser/${service.slug}`,
                icon: service.icon,
              }))
            : undefined

      const mergedChildren =
        item.href === '/sider'
          ? [...(itemChildren ?? []), ...customChildren].filter(
              (child, index, collection) => collection.findIndex((entry) => entry.href === child.href) === index
            )
          : itemChildren

      return {
        label: item.label,
        href: item.href,
        icon: item.icon,
        highlight: item.highlight,
        children: mergedChildren,
      } satisfies NavItem
    })

  if (base.some((item) => item.href === '/sider') || customChildren.length === 0) {
    return base
  }

  const primaryItems = base.filter((item) => !item.highlight)
  const highlightItems = base.filter((item) => item.highlight)

  return [...primaryItems, { label: 'Fagområder', href: '/sider', icon: 'PG', children: customChildren }, ...highlightItems]
}

export function getServiceBySlug(content: SiteContent, slug: string) {
  return content.services.find((service) => service.slug === slug)
}

export function getCustomPageBySlug(content: SiteContent, slug: string) {
  return content.customPages.find((page) => page.slug === slug)
}



