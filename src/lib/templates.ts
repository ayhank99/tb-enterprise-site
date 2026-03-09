export type TemplateId = 'builderz'

export type HeaderVariant = 'cinema' | 'sport' | 'agency' | 'builder' | 'constra'
export type HeroVariant = 'cinema' | 'sport' | 'agency' | 'builder' | 'constra'
export type CardVariant = 'rounded' | 'sharp' | 'framed'
export type HomeFlow = 'standard' | 'proof-first' | 'story-first'

export type TemplateDefinition = {
  id: TemplateId
  name: string
  shortDescription: string
  inspiration: string
  previewGradient: string
  headerVariant: HeaderVariant
  heroVariant: HeroVariant
  cardVariant: CardVariant
  homeFlow: HomeFlow
}

export const DEFAULT_TEMPLATE_ID: TemplateId = 'builderz'

const BUILDER_TEMPLATE: TemplateDefinition = {
  id: 'builderz',
  name: 'Builderz Monochrome',
  shortDescription: 'Single design system inspired by Builderz with monochrome brand colors.',
  inspiration: 'HTMLCodex Builderz',
  previewGradient: 'linear-gradient(135deg,#0b0b0b 0%,#2a2a2a 56%,#a3a3a3 100%)',
  headerVariant: 'builder',
  heroVariant: 'builder',
  cardVariant: 'sharp',
  homeFlow: 'proof-first',
}

export const templates: TemplateDefinition[] = [BUILDER_TEMPLATE]

export function isTemplateId(value: string): value is TemplateId {
  return value === 'builderz'
}

export function resolveTemplateId(value: string | null | undefined): TemplateId {
  if (!value) {
    return DEFAULT_TEMPLATE_ID
  }

  return isTemplateId(value) ? value : DEFAULT_TEMPLATE_ID
}

export function getTemplateDefinition(templateId: TemplateId): TemplateDefinition {
  return templateId === 'builderz' ? BUILDER_TEMPLATE : BUILDER_TEMPLATE
}
