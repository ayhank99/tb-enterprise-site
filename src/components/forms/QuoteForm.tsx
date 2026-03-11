'use client'

import { useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { quoteSchema } from '@/lib/quote-schema'
import { withSiteBasePath } from '@/lib/site-paths'
import { SiteContent } from '@/lib/site-data'

const QUOTE_ENDPOINT =
  withSiteBasePath(
    process.env.NEXT_PUBLIC_QUOTE_ENDPOINT || (process.env.NODE_ENV === 'production' ? '/quote-handler.php' : '/api/quote')
  )
const QUOTE_SUBMISSION_DISABLED = process.env.NEXT_PUBLIC_DISABLE_QUOTE_SUBMIT === 'true'

type QuoteFormValues = {
  name: string
  phone: string
  email: string
  location: string
  task: string
  consent: boolean
  website?: string
}

type QuoteApiError = {
  error?: string
  fields?: Partial<Record<keyof QuoteFormValues, string[]>>
}

type SubmitState = 'idle' | 'success' | 'error'

type QuoteFormProps = {
  quoteForm: SiteContent['quoteForm']
}

function getInputClassName(hasError: boolean) {
  return [
    'w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-[color:var(--site-text)] shadow-none outline-none transition-all placeholder:text-[color:var(--site-muted)]/70 focus:ring-0',
    hasError ? 'border-rose-500' : 'border-[color:var(--site-border)] focus:border-[color:var(--site-primary)]',
  ].join(' ')
}

function FormField({
  htmlFor,
  label,
  error,
  children,
}: {
  htmlFor: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--site-muted)]">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

export default function QuoteForm({ quoteForm }: QuoteFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      location: '',
      task: '',
      consent: false,
      website: '',
    },
  })

  const onSubmit = async (values: QuoteFormValues) => {
    setSubmitState('idle')
    setSubmitMessage('')
    clearErrors()

    if (QUOTE_SUBMISSION_DISABLED) {
      setSubmitState('success')
      setSubmitMessage('Previewversionen sender ikke e-mail endnu. Brug kontaktoplysningerne på siden ved direkte henvendelser.')
      return
    }

    try {
      const response = await fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const apiError = (await response.json().catch(() => null)) as QuoteApiError | null

        if (response.status === 422 && apiError?.fields) {
          for (const [field, messages] of Object.entries(apiError.fields) as Array<
            [keyof QuoteFormValues, string[] | undefined]
          >) {
            const message = messages?.[0]

            if (!message) {
              continue
            }

            setError(field, {
              type: 'server',
              message,
            })
          }
        }

        const retryAfter = response.headers.get('Retry-After')
        const rateLimitMessage =
          response.status === 429 && retryAfter
            ? `For mange forespørgsler. Prøv igen om ${retryAfter} sekunder.`
            : null

        setSubmitState('error')
        setSubmitMessage(rateLimitMessage ?? apiError?.error ?? quoteForm.messages.error)
        return
      }

      setSubmitState('success')
      setSubmitMessage(quoteForm.messages.success)
      reset()
    } catch {
      setSubmitState('error')
      setSubmitMessage(quoteForm.messages.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="rounded-2xl border border-[color:var(--site-border)] bg-white px-4 py-3 text-sm text-[color:var(--site-muted)]">
        {QUOTE_SUBMISSION_DISABLED
          ? 'Dette er en previewversion. Formularen vises korrekt, men sender ikke e-mail fra denne testadresse.'
          : 'Beskriv opgaven kort og præcist. Vi sender henvendelsen direkte til virksomheden og bekræfter modtagelsen på e-mail.'}
      </div>

      <fieldset disabled={isSubmitting} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField htmlFor="name" label={quoteForm.labels.name} error={errors.name?.message}>
            <input
              id="name"
              {...register('name')}
              className={getInputClassName(Boolean(errors.name))}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
          </FormField>

          <FormField htmlFor="phone" label={quoteForm.labels.phone} error={errors.phone?.message}>
            <input
              id="phone"
              {...register('phone')}
              className={getInputClassName(Boolean(errors.phone))}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(errors.phone)}
            />
          </FormField>

          <FormField htmlFor="email" label={quoteForm.labels.email} error={errors.email?.message}>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={getInputClassName(Boolean(errors.email))}
              autoComplete="email"
              inputMode="email"
              aria-invalid={Boolean(errors.email)}
            />
          </FormField>

          <FormField htmlFor="location" label={quoteForm.labels.location} error={errors.location?.message}>
            <input
              id="location"
              {...register('location')}
              className={getInputClassName(Boolean(errors.location))}
              autoComplete="address-level2"
              aria-invalid={Boolean(errors.location)}
            />
          </FormField>
        </div>

        <FormField htmlFor="task" label={quoteForm.labels.task} error={errors.task?.message}>
          <textarea
            id="task"
            {...register('task')}
            className={`${getInputClassName(Boolean(errors.task))} min-h-32 resize-y`}
            aria-invalid={Boolean(errors.task)}
          />
        </FormField>

        <input {...register('website')} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <label className="flex items-start gap-3 rounded-2xl border border-[color:var(--site-border)] bg-white px-4 py-3 text-sm text-[color:var(--site-text)]">
          <input
            type="checkbox"
            {...register('consent')}
            className="mt-1 h-4 w-4 accent-[color:var(--site-primary)]"
          />
          <span>{quoteForm.labels.consent}</span>
        </label>
        {errors.consent?.message ? <p className="text-xs text-rose-600">{errors.consent.message}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full px-8 py-4 text-sm font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: 'var(--site-primary)' }}
        >
          {isSubmitting ? 'Sender...' : QUOTE_SUBMISSION_DISABLED ? 'Previewversion' : quoteForm.labels.submit}
        </button>
      </fieldset>

      {submitState === 'success' ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{submitMessage}</p>
      ) : null}

      {submitState === 'error' ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{submitMessage}</p>
      ) : null}
    </form>
  )
}
