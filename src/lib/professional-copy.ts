import { CustomPage, NarrativeContent, Service } from '@/lib/site-data'

function toSentenceCase(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

export function getServiceNarrative(service: Service): NarrativeContent {
  return {
    eyebrow: service.title,
    title: `${service.title} med fokus på kvalitet, funktion og holdbarhed`,
    intro: service.description,
    paragraphs: [
      `TB Entreprise planlægger ${toSentenceCase(service.title)} med fokus på materialer, adgangsforhold, belastning og den daglige brug af arealet, så løsningen fungerer både praktisk og visuelt.`,
      'Det giver et mere gennemarbejdet forløb, tydeligere forventningsafstemning og en aflevering, hvor finish, funktion og drift hænger sammen.',
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
      'Siden kan redigeres fuldt i CMS, så overskrifter, afsnit og punktlister kan tilpasses virksomhedens fokus, målgruppe og aktuelle forretningsområder.',
    ],
    highlights: highlightPool.slice(0, 3),
  }
}
