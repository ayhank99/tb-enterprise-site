import { z } from 'zod'

export const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Indtast dit navn').max(120, 'Navn er for langt'),
  phone: z
    .string()
    .trim()
    .min(8, 'Indtast et gyldigt telefonnummer')
    .max(32, 'Telefonnummer er for langt'),
  email: z.string().trim().email('Indtast en gyldig e-mailadresse'),
  location: z.string().trim().min(2, 'Indtast postnummer/by').max(120, 'Placering er for lang'),
  task: z.string().trim().min(20, 'Beskriv opgaven lidt mere detaljeret').max(2000, 'Teksten er for lang'),
  consent: z.boolean().refine((value) => value, {
    message: 'Du skal acceptere kontakt vedrørende din forespørgsel',
  }),
  website: z.string().trim().optional(),
})

export type QuoteInput = z.infer<typeof quoteSchema>
