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

export const defaultSiteContent: SiteContent = {
  company: {
    name: 'TB Entreprise ApS',
    logoUrl: '/brand/tb-entreprise-logo.svg',
    phoneDisplay: '93 80 04 26',
    phoneHref: 'tel:+4593800426',
    email: 'kontakt@tbgruppen.dk',
    address: 'Lyskær 8 A, st. th, 2730 Herlev',
    cvr: 'CVR-nr 45607569',
    openingHours: 'Man-fre 07:00-17:00',
    serviceAreas: ['Herlev', 'København', 'Ballerup', 'Roskilde', 'Storkøbenhavn'],
  },
  navigation: [
    { label: 'Forside', href: '/', show: true },
    {
      label: 'Om os',
      href: '/om-os',
      show: true,
    },
    {
      label: 'Ydelser',
      href: '/ydelser',
      show: true,
      children: [
        { label: 'Belaegning', href: '/ydelser/belaegning' },
        { label: 'Graesslaaning', href: '/ydelser/graesslaaning' },
        { label: 'Haekklipning', href: '/ydelser/haekklipning' },
        { label: 'Traefaeldning og beskaering', href: '/ydelser/traefaeldning-og-beskaering' },
      ],
    },
    { label: 'Galleri', href: '/galleri', show: true },
    { label: 'Fagomraader', href: '/sider', show: true },
    { label: 'Kontakt', href: '/kontakt', show: true, highlight: true },
  ],
  hero: {
    eyebrow: 'Lokal brolaegger og haveservice i Storkobenhavn',
    title: 'Velholdte haver, skarp belaegning og stabil drift af udearealer',
    text: 'Vi udforer opgaver i samme stil som klassisk have- og anlægsservice: belaegning, graespleje, haekklipning, traebeskaering og loebende vedligehold for private og erhverv.',
    primaryCtaLabel: 'Faa et uforpligtende tilbud',
    primaryCtaHref: '/kontakt#tilbudsformular',
    secondaryCtaLabel: 'Ring nu',
    secondaryCtaHref: 'tel:+4593800426',
    backgroundType: 'image',
    backgroundImage:
      'https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=1800&q=80',
    backgroundVideo: '',
  },
  trustPoints: [
    'Alt fra enkeltopgaver til fast haveservice',
    'Fast kontaktperson gennem hele forlobet',
    'Tydelige aftaler om tid, pris og leverance',
    'Ordentlig oprydning og professionel aflevering',
  ],
  services: [
    {
      slug: 'belaegning',
      title: 'Belaegning',
      icon: 'BL',
      short: 'Nye indkoersler, gangarealer og terrasser med korrekt opbygning.',
      description:
        'Vi etablerer belaegning med fokus paa holdbar bundopbygning, korrekt fald og et ensartet visuelt udtryk.',
      includes: ['Udgravning og bortkoersel', 'Stabilgrus og afretningslag', 'Laegning og fugearbejde'],
      idealFor: ['Indkoersler', 'Terrasser', 'Gangstier'],
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'graesslaaning',
      title: 'Graesslaaning',
      icon: 'GR',
      short: 'Regelmaessig pleje af plaener med ensartet finish.',
      description:
        'Vi klipper graes og afslutter kanter, saa arealet fremstaar velholdt hele saesonen.',
      includes: ['Fast eller fleksibel frekvens', 'Kanttrimning', 'Bortkoersel af afklip ved behov'],
      idealFor: ['Private haver', 'Boligforeninger', 'Erhvervsejendomme'],
      image:
        'https://images.unsplash.com/photo-1599685315640-6f8f6f95f6f7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'haekklipning',
      title: 'Haekklipning',
      icon: 'HK',
      short: 'Skarp formklipning af hække i korrekt højde og linje.',
      description:
        'Vi klipper hække professionelt og rydder op efter arbejdet, saa resultatet fremstaar rent og praecist.',
      includes: ['Klipning af sider og top', 'Formjustering', 'Oprydning og bortkoersel'],
      idealFor: ['Ligusterhaek', 'Thuja og laurbær', 'Ejendomme med mange loebende meter'],
      image:
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'traefaeldning-og-beskaering',
      title: 'Traefaeldning og beskaering',
      icon: 'TR',
      short: 'Sikker haandtering af traeer med fokus paa sikkerhed og finish.',
      description:
        'Vi udforer beskaering og faeldning efter en klar plan, inklusiv sikker afspaerring og oprydning.',
      includes: ['Beskæring af kroner', 'Nedtagning i sektioner', 'Bortkoersel af grene og stammer'],
      idealFor: ['Svaert tilgaengelige haver', 'Stormskadede traeer', 'Forebyggende vedligehold'],
      image:
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'havefraesning',
      title: 'Havefraesning',
      icon: 'HF',
      short: 'Klargoering af jord til nye beplantninger og graes.',
      description:
        'Vi fraeser jorden i passende dybde og forbereder arealet til ny saaning eller beplantning.',
      includes: ['Loesning af komprimeret jord', 'Planering efter fraesning', 'Klar til saaning'],
      idealFor: ['Nyanlaeg', 'Renovering af gamle bede', 'Store havearealer'],
      image:
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'stubfraesning',
      title: 'Stubfraesning',
      icon: 'SF',
      short: 'Effektiv fjernelse af stubbe efter traefaeldning.',
      description:
        'Vi stubfraeser ned i dybden, saa arealet kan bruges direkte til ny beplantning eller belaegning.',
      includes: ['Stub nedfræses under terræn', 'Rengoering af arealet', 'Klar til ny opbygning'],
      idealFor: ['Efter traefaeldning', 'Nye bede', 'Nye gangarealer'],
      image:
        'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      slug: 'haveservice',
      title: 'Haveservice',
      icon: 'HS',
      short: 'Loebende vedligehold af hele haven i faste intervaller.',
      description:
        'Vi sammensætter en serviceaftale med de opgaver, der passer til dit areal og dit behov gennem saesonen.',
      includes: ['Graes, haek og bede', 'Saesonklargoering', 'Fast opfoelgning'],
      idealFor: ['Private med travl hverdag', 'Ejendomsdrift', 'Erhverv med udendoersarealer'],
      image:
        'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80',
    },
  ],
  processSteps: [
    {
      title: 'Besigtigelse',
      text: 'Vi gennemgaar opgaven pa adressen og afklarer behov, adgang og prioriteringer.',
    },
    {
      title: 'Tilbud og plan',
      text: 'Du modtager et tydeligt tilbud med aftalt omfang, pris og forventet tidslinje.',
    },
    {
      title: 'Udfoerelse',
      text: 'Arbejdet udfoeres i faste etaper med loebende kvalitetskontrol og klar kommunikation.',
    },
    {
      title: 'Aflevering',
      text: 'Vi afslutter med gennemgang af resultatet og anbefalinger til vedligehold.',
    },
  ],
  testimonials: [
    {
      quote:
        'De holdt alle aftaler og leverede en flot belaegning foran huset. Oprydning og kommunikation var i top.',
      name: 'Mette, Herlev',
    },
    {
      quote:
        'Vi bruger dem nu fast til haveservice. Vores udearealer ser altid velholdte ud.',
      name: 'Boligforening, Ballerup',
    },
    {
      quote:
        'Traefaeldning og beskaering blev udfoert sikkert og hurtigt. Meget professionelt team.',
      name: 'Anders, Koebenhavn',
    },
  ],
  galleryImages: [
    {
      src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      alt: 'Ny anlagt indkørsel med granitkant i moderne boligområde',
      title: 'Moderne indkørsel',
      category: 'Indkørsel',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      alt: 'Stor terrasse med fliser i varme grå nuancer',
      title: 'Terrasse i varme toner',
      category: 'Terrasse',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=1200&q=80',
      alt: 'Brolagt havegang med præcise fuger og niveauskift',
      title: 'Havegang med detaljefuger',
      category: 'Brolægning',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
      alt: 'Støttemur og trappeløsning i kuperet have',
      title: 'Støttemur i niveauer',
      category: 'Støttemur',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=1200&q=80',
      alt: 'Jord- og gravearbejde før etablering af ny belægning',
      title: 'Forberedende gravearbejde',
      category: 'Jordarbejde',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=80',
      alt: 'Færdigt gårdanlæg med stenbelægning og grøn beplantning',
      title: 'Færdigt gårdanlæg',
      category: 'Anlæg',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      alt: 'Belægningsdetalje med trapper og kantafgrænsning',
      title: 'Kant og trappefinish',
      category: 'Detalje',
      href: '/galleri',
    },
    {
      src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      alt: 'Indkørsel med slidstærke sten til daglig biltrafik',
      title: 'Robust adgangsareal',
      category: 'Indkørsel',
      href: '/galleri',
    },
  ],
  companyStory: {
    title: 'Lokal erfaring og professionel udførelse',
    intro:
      'Vi arbejder i hele Storkobenhavn med belaegning, pleje og vedligehold af udearealer for private og erhverv.',
    points: [
      'Vi leverer tydelige aftaler og realistiske tidsplaner.',
      'Vi kombinerer anlæg med løbende service i samme kvalitet.',
      'Vi prioriterer finish, sikkerhed og ordentlig aflevering.',
    ],
  },
  quoteForm: {
    title: 'Uforpligtende tilbud',
    heading: 'Fortæl kort om opgaven, så vender vi hurtigt tilbage',
    intro: 'Fortæl kort om opgaven, så vender vi hurtigt tilbage.',
    labels: {
      name: 'Navn',
      phone: 'Telefon',
      email: 'E-mail',
      location: 'Postnummer / by',
      task: 'Opgavebeskrivelse',
      consent: 'Jeg accepterer, at I må kontakte mig vedrørende min forespørgsel.',
      submit: 'Send forespørgsel',
    },
    messages: {
      success: 'Tak for din henvendelse. Vi vender tilbage hurtigst muligt.',
      error: 'Der opstod en fejl ved afsendelse. Prøv igen eller ring til os direkte.',
    },
  },
  pages: {
    home: {
      sections: [
        { type: 'hero', enabled: true },
        { type: 'trustStrip', enabled: true },
        { type: 'servicesGrid', enabled: true, variant: 'A' },
        { type: 'projectsGallery', enabled: true, variant: 'masonry' },
        { type: 'process', enabled: true, variant: 'steps' },
        { type: 'testimonials', enabled: true, variant: 'cards' },
        { type: 'ctaBanner', enabled: true, variant: 'split' },
      ],
      services: {
        eyebrow: 'Ydelser',
        title: 'Ydelser inden for belaegning, pleje og vedligehold',
        intro: 'Vi leverer baade anlæg og loebende service, saa dine udearealer fungerer og fremstaar skarpe hele aaret.',
      },
      process: {
        eyebrow: 'Proces',
        title: 'Saadan loeser vi opgaven fra start til slut',
        intro: 'Du faar en enkel proces med tydelige aftaler, fast opfoelgning og professionel aflevering.',
      },
      projects: {
        eyebrow: 'Udvalgte projekter',
        title: 'Eksempler paa arbejde i haver og udearealer',
        intro: 'Se udsnit af opgaver med fokus paa kvalitet, finish og brugbarhed i hverdagen.',
      },
      testimonials: {
        eyebrow: 'Anbefalinger',
        title: 'Det siger kunderne om samarbejdet',
        intro: 'Feedback fra private, foreninger og erhverv i Storkobenhavn.',
      },
      about: {
        eyebrow: 'Om virksomheden',
        title: 'Lokalt team med fokus paa driftssikre loesninger',
        intro:
          'Vi kombinerer anlægserfaring med loebende haveservice og arbejder med samme kvalitet i baade store og sma a opgaver.',
      },
      aboutCta: {
        eyebrow: 'Naeste skridt',
        title: 'Skal vi tage en snak om dit udeareal?',
        text: 'Kontakt os for besigtigelse og et konkret tilbud tilpasset din opgave.',
        primaryLabel: 'Faa tilbud',
        secondaryLabel: 'Laes mere',
      },
      narrative: {
        eyebrow: 'TB Entreprise',
        title: 'En samarbejdspartner til udearealer, anlaeg og mindre entrepriser',
        intro:
          'Vi arbejder med projekter, hvor kvalitet i underlaget, styring i processen og en professionel aflevering er afgoerende for slutresultatet.',
        paragraphs: [
          'TB Entreprise hjaelper private boligejere, boligforeninger, erhverv og institutioner med opgaver inden for belaegning, anlaeg, pleje og praktisk entreprisearbejde. Vores rolle er at skabe loesninger, der fungerer i hverdagen og holder over tid.',
          'Vi ser ikke kun paa den enkelte opgave isoleret. Vi vurderer adgangsforhold, materialevalg, tidsplan, logistik og den efterfoelgende drift, saa kunden faar et samlet forloeb med tydelige aftaler og et resultat, der matcher baade behov og budget.',
        ],
        highlights: [
          'Belaegning, jordarbejde og klargoering af udearealer',
          'Vedligeholdelse og haveservice for private, erhverv og foreninger',
          'Mindre entrepriser med klar koordinering og ansvar',
        ],
      },
    },
    services: {
      eyebrow: 'Ydelser',
      title: 'Komplette ydelser til haver, belaegning og vedligehold',
      intro:
        'Fra belaegning og traearbejde til fast haveservice: vi arbejder struktureret og leverer stabile resultater, der holder.',
      narrative: {
        eyebrow: 'Fagomraader',
        title: 'Ydelser med fokus paa driftssikre loesninger og lang levetid',
        intro:
          'Vores ydelser er sammensat, saa vi kan tage ansvar for baade etablering, forbedring og loebende vedligehold af udearealer.',
        paragraphs: [
          'Vi loeser opgaver inden for belaegning, graespleje, haekklipning, traearbejde, jordforberedelse og vedligeholdelse. Derudover indgaar vi gerne i mindre entrepriser, hvor opgaven kraever koordinering, planlaegning og en leverandoer, der kan holde styr paa helheden.',
          'For kunden betyder det, at samme virksomhed kan vaere med fra den foerste besigtigelse til den afsluttende aflevering. Det giver bedre sammenhaeng i loesningen, hurtigere beslutninger og et mere overskueligt forloeb.',
        ],
        highlights: [
          'Loesninger til private, erhverv, institutioner og boligforeninger',
          'Baade etablering, renovering og loebende drift',
          'Teknisk fokus paa opbygning, funktion og visuelt udtryk',
        ],
      },
    },
    gallery: {
      eyebrow: 'Galleri',
      title: 'Udvalgte opgaver fra vores daglige arbejde',
      intro: 'Et visuelt indblik i projekter med fokus paa finish, funktion og professionel udførelse.',
      narrative: {
        eyebrow: 'Referencer',
        title: 'Arbejdet i galleriet viser vores niveau for kvalitet og detaljegrad',
        intro:
          'Billederne giver et konkret indblik i, hvordan TB Entreprise arbejder med udearealer, belaegning, anlaeg og vedligehold i praksis.',
        paragraphs: [
          'Vi dokumenterer projekter, fordi det er vigtigt at vise mere end bare et flot slutbillede. Et godt resultat bygger paa korrekt forberedelse, gennemtaenkte materialevalg og en arbejdsproces, hvor der er styr paa detaljer, kanter, niveauforskelle og den samlede finish.',
          'Galleriet afspejler den type opgaver, vi loeser for kunder i Storkoebenhavn. Her ser du eksempler paa loesninger, hvor funktion, udtryk og holdbarhed er prioriteret fra start til slut.',
        ],
        highlights: [
          'Dokumenterede opgaver inden for belaegning og anlaeg',
          'Professionel finish paa terrasser, indkoersler og gangarealer',
          'Visuelt overblik over kvaliteten i vores daglige arbejde',
        ],
      },
    },
    about: {
      hero: {
        eyebrow: 'Om os',
        title: 'Erfaring, struktur og ordentlig udførelse',
        intro:
          'TB Entreprise ApS leverer baade anlæg og drift af udearealer med faste processer, god kommunikation og hoej leveringssikkerhed.',
      },
      whyTitle: 'Hvorfor kunder vaelger os',
      whyPoints: [
        'Vi arbejder med tydelige aftaler og holder tidsplanen.',
        'Vi leverer et ensartet kvalitetsniveau pa tværs af alle opgaver.',
        'Vi prioriterer sikkerhed, oprydning og professionel fremtoning.',
        'Vi giver hurtig opfoelgning og klar status undervejs.',
      ],
      principleTitle: 'Vores arbejdsprincip',
      principleText:
        'Et holdbart resultat starter med god planlaegning. Vi afklarer altid opgaven grundigt, vaelger den rigtige metode og foelger op undervejs, saa kvalitet og finish bliver som aftalt.',
      narrative: {
        eyebrow: 'Om virksomheden',
        title: 'Vi kombinerer haandvaerk, struktur og praktisk entrepriseforstaelse',
        intro:
          'TB Entreprise er bygget op omkring ordentlig planlaegning, synlig kvalitet og en arbejdsform, hvor kunden altid ved, hvad der bliver leveret.',
        paragraphs: [
          'Vi loeser opgaver i hele Storkoebenhavn og arbejder baade med enkeltopgaver og loebende aftaler. Uanset om det handler om en ny indkoersel, renovering af et gaardmiljoe, pleje af udearealer eller en mindre entrepriseopgave, gaar vi til arbejdet med samme krav til finish, fremdrift og dialog.',
          'Vores styrke ligger i at kunne omsaette praktiske behov til en realistisk loesning. Det betyder, at vi prioriterer god forberedelse, tydelig opfoelgning og en aflevering, der fremstaar professionel fra foerste dag.',
        ],
        highlights: [
          'Fast kontaktperson gennem hele forloebet',
          'Tydelige planer, realistiske tidsrammer og loebende status',
          'Fokus paa finish, holdbarhed og professionel fremtoning',
        ],
      },
    },
    contact: {
      hero: {
        eyebrow: 'Kontakt',
        title: 'Lad os tale om dit projekt',
        intro:
          'Ring eller skriv til os. Vi vender hurtigt tilbage og aftaler naeste skridt for din opgave.',
      },
      cardLabels: {
        phone: 'Telefon',
        email: 'E-mail',
        address: 'Adresse',
        openingHours: 'Åbningstid',
      },
      narrative: {
        eyebrow: 'Kontakt og tilbud',
        title: 'En god dialog starter med en klar afklaring af opgaven',
        intro:
          'Vi bruger den foerste kontakt til at forstaa omfang, prioriteringer og de praktiske forhold omkring opgaven, saa vi kan vende tilbage med et brugbart svar.',
        paragraphs: [
          'Naar du kontakter TB Entreprise, handler det ikke kun om at faa en pris. Det handler om at faa vurderet opgaven korrekt fra start, saa vi kan foreslaa en loesning, der passer til arealet, materialerne og det niveau af kvalitet, du forventer.',
          'Vi arbejder med baade mindre opgaver og stoerre forloeb for private, erhverv og boligforeninger. Derfor er vores maalsaetning altid at skabe et tilbud, der er konkret, realistisk og let at tage stilling til.',
        ],
        highlights: [
          'Hurtig respons og professionel afklaring',
          'Tydelige tilbud med fokus paa omfang, pris og tidsplan',
          'Praktisk vurdering af opgaven foer udfoerelse',
        ],
      },
    },
    customPages: {
      eyebrow: 'Ekstra sider',
      title: 'Redigerbare undersider',
      intro: 'Tilføj nye sider i CMS, så bliver de automatisk oprettet med samme designsystem.',
    },
    privacy: {
      title: 'Privatlivspolitik',
      sections: [
        {
          heading: '1. Dataansvarlig',
          text: 'TB Entreprise ApS er dataansvarlig for behandling af de oplysninger, du sender via kontaktformularen på denne hjemmeside.',
        },
        {
          heading: '2. Hvilke oplysninger vi indsamler',
          text: 'Vi behandler navn, telefonnummer, e-mail, adresseområde og opgavebeskrivelse. Oplysningerne bruges kun til at besvare din henvendelse og udarbejde et eventuelt tilbud.',
        },
        {
          heading: '3. Formål og opbevaring',
          text: 'Oplysninger opbevares kun så længe det er nødvendigt for dialog, tilbudsproces og opfølgning. Oplysninger deles ikke med tredjepart uden lovligt grundlag.',
        },
        {
          heading: '4. Dine rettigheder',
          text: 'Du har ret til indsigt, rettelse og sletning af dine oplysninger. Kontakt os, hvis du ønsker at gøre brug af dine rettigheder.',
        },
        {
          heading: '5. Kontakt',
          text: 'Ved spørgsmål om databehandling kan du kontakte os via telefon eller e-mail på kontaktsiden.',
        },
      ],
    },
  },
  customPages: [
    {
      slug: 'projektforloeb',
      menuLabel: 'Projektforløb',
      title: 'Projektforløb fra første møde til færdigt anlæg',
      intro:
        'Her kan kunder få et tydeligt indblik i, hvordan vi planlægger, udfører og kvalitetssikrer en klassisk entreprenøropgave.',
      showInMenu: false,
      sections: [
        {
          heading: 'Foranalyse og opmåling',
          text: 'Vi starter med fysisk gennemgang af arealet, vurderer adgangsforhold og fastlægger korrekt opbygning.',
          bullets: ['Niveaufastlæggelse', 'Vandhåndtering', 'Valg af materialer'],
        },
        {
          heading: 'Plan og koordinering',
          text: 'Du modtager en tydelig plan med etaper, leverancer og forventet tidslinje.',
          bullets: ['Ressourceplan', 'Leverancevinduer', 'Kontaktperson og status'],
        },
        {
          heading: 'Udførelse og aflevering',
          text: 'Arbejdet udføres i faste etaper med løbende kvalitetstjek, slutgennemgang og vedligeholdelsesråd.',
          bullets: ['Dokumenteret bundopbygning', 'Finish-kontrol', 'Ryddelig aflevering'],
        },
      ],
    },
  ],
  seo: {
    siteUrl: 'https://tbgruppen.dk',
    title: 'TB Entreprise ApS | Belaegning og haveservice i Herlev',
    description:
      'Professionel belaegning, haekklipning, traeservice og loebende haveservice i Herlev og Storkobenhavn. Faa et uforpligtende tilbud.',
    locale: 'da_DK',
  },
}

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

  return [...primaryItems, { label: 'Fagomraader', href: '/sider', icon: 'PG', children: customChildren }, ...highlightItems]
}

export function getServiceBySlug(content: SiteContent, slug: string) {
  return content.services.find((service) => service.slug === slug)
}

export function getCustomPageBySlug(content: SiteContent, slug: string) {
  return content.customPages.find((page) => page.slug === slug)
}


