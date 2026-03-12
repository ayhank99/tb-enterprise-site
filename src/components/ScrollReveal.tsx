'use client'

import { createElement, CSSProperties, HTMLAttributes, ReactNode, Ref, useEffect, useRef, useState } from 'react'

type RevealElement = 'div' | 'section' | 'article' | 'figure' | 'aside' | 'p' | 'h1' | 'h2' | 'h3' | 'li'
type RevealVariant = 'up' | 'left' | 'right' | 'zoom' | 'image' | 'soft'

type ScrollRevealProps = {
  as?: RevealElement
  children: ReactNode
  className?: string
  variant?: RevealVariant
  delay?: number
  threshold?: number
  once?: boolean
  style?: CSSProperties
}

export default function ScrollReveal({
  as = 'div',
  children,
  className,
  variant = 'up',
  delay = 0,
  threshold = 0.18,
  once = true,
  style,
}: ScrollRevealProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }

    const disableReveal = window.matchMedia('(max-width: 1024px), (hover: none) and (pointer: coarse)').matches

    if (disableReveal) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.isIntersecting) {
          setVisible(true)

          if (once) {
            observer.unobserve(node)
          }

          return
        }

        if (!once) {
          setVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -8% 0px',
      }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, threshold])

  const mergedStyle = {
    ...(style ?? {}),
    ['--reveal-delay' as const]: `${delay}ms`,
  } as CSSProperties
  const props: HTMLAttributes<HTMLElement> & {
    ref: Ref<HTMLElement>
    'data-reveal-variant': RevealVariant
  } = {
    ref,
    'data-reveal-variant': variant,
    className: `scroll-reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`,
    style: mergedStyle,
  }

  return createElement(as, props, children)
}
