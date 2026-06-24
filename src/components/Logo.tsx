import React from 'react'

interface LogoProps {
  size?: number
  variant?: 'default' | 'light'
}

export default function Logo({ size = 20, variant = 'default' }: LogoProps) {
  const askColor  = variant === 'light' ? '#FFFFFF'  : '#0D1B2A'
  const jeniColor = variant === 'light' ? '#93C5FD'  : '#2563EB'
  const sparkColor = '#FFC84D'

  return (
    <span
      style={{
        fontFamily: "'Satoshi', 'Inter', system-ui, sans-serif",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 0,
      }}
    >
      <span style={{ color: askColor }}>ask</span>
      <span style={{ color: jeniColor }}>jeni</span>
      <span style={{ color: sparkColor, fontSize: size * 0.75, marginLeft: '0.25em' }}>✦</span>
    </span>
  )
}
