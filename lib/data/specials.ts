export type SpecialTheme = 'green' | 'terracotta' | 'charcoal'

export type Special = {
  id: string
  title: string
  subtitle: string
  description: string
  days: string
  time?: string
  note?: string
  highlight?: string
  imageUrl: string
  theme: SpecialTheme
}
