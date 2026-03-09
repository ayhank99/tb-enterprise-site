import { CustomPage, NarrativeContent, Service } from '@/lib/site-data'

function toSentenceCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

export function getServiceNarrative(service: Service): NarrativeContent {
  return {
    eyebrow: service.title,
    title: `${service.title} med fokus paa kvalitet, funktion og holdbarhed`,
    intro: service.description,
    paragraphs: [
      `TB Entreprise planlaegger ${toSentenceCase(service.title)} med fokus paa materialer, adgangsforhold, belastning og den daglige brug af arealet, saa loesningen fungerer baade praktisk og visuelt.`,
      'Det giver et mere gennemarbejdet forloeb, tydeligere forventningsafstemning og en aflevering, hvor finish, funktion og drift haenger sammen.',
    ],
    highlights: [...service.includes.slice(0, 2), ...service.idealFor.slice(0, 1)].slice(0, 3),
  }
}

export function getCustomPageNarrative(page: CustomPage): NarrativeContent {
  const highlightPool = page.sections.flatMap((section) => section.bullets).filter(Boolean)

  return {
    eyebrow: page.menuLabel,
    title: page.title,
    intro: page.intro,
    paragraphs: [
      page.intro,
      'Siden kan redigeres fuldt i CMS, saa overskrifter, afsnit og punktlister kan tilpasses virksomhedens fokus, maalgruppe og aktuelle forretningsomraader.',
    ],
    highlights: highlightPool.slice(0, 3),
  }
}
