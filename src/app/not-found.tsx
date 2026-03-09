import Link from 'next/link'
import Container from '@/components/Container'

export default function NotFound() {
  return (
    <section className="section-soft py-24">
      <Container className="text-center">
        <p className="section-eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl text-[color:var(--site-text)]">Siden findes ikke</h1>
        <p className="mx-auto mt-5 max-w-xl text-[color:var(--site-muted)]">
          Linket er muligvis forældet. Gå tilbage til forsiden og fortsæt derfra.
        </p>
        <Link href="/" className="btn-primary mt-8">
          Til forsiden
        </Link>
      </Container>
    </section>
  )
}
