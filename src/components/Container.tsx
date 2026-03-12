import { CSSProperties, ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export default function Container({ children, className = '', style }: ContainerProps) {
  return (
    <div style={style} className={`mx-auto w-full max-w-[var(--container-max)] px-3 sm:px-4 md:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
