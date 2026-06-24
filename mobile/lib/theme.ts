export const colors = {
  navy:       '#0D1B2A',
  navyMid:    '#162233',
  blue:       '#2563EB',
  blueLight:  '#3B82F6',
  bluePale:   '#EFF4FF',
  yellow:     '#FFC84D',
  yellowPale: '#FFF8E6',
  green:      '#16A34A',
  greenPale:  '#DCFCE7',
  red:        '#DC2626',
  purple:     '#7C3AED',
  teal:       '#0891B2',
  bg:         '#F7F9FC',
  card:       '#FFFFFF',
  border:     '#E5E7EB',
  text1:      '#0D1B2A',
  text2:      '#4B5563',
  text3:      '#9CA3AF',
}

export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 999,
}

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
}

export const font = {
  sm:   12,
  base: 14,
  md:   15,
  lg:   17,
  xl:   20,
  xxl:  26,
  hero: 38,
}

const COMPANY_HUE: string[] = [
  colors.blue,
  colors.purple,
  colors.green,
  colors.red,
  '#D97706',
  colors.teal,
]

export function companyColor(name: string): string {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return COMPANY_HUE[h % COMPANY_HUE.length]
}
