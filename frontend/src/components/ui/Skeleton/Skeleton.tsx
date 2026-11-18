import type { CSSProperties } from 'react'
import './Skeleton.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  rounded?: boolean
  className?: string
}

export default function Skeleton({
  width = '100%',
  height = 16,
  rounded = false,
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={[
        'ui-skeleton',
        rounded ? 'ui-skeleton--rounded' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}