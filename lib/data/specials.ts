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

// Static fallback — used when the DB returns nothing (e.g. first deploy).
export const specials: Special[] = [
  {
    id: 'bottomless',
    title: 'Bottomless Gnocchi or Pizza',
    subtitle: 'All You Can Eat',
    description:
      'Indulge in unlimited gnocchi or pizza with your choice of Gorgonzola, Sorrentina, or Pomodoro sauce. For pizza lovers, enjoy a selection of 5 mixed pizzas — all you can eat in 90 minutes of pure Italian pleasure.',
    days: 'Tuesday · Wednesday · Thursday',
    time: 'From 5:00pm',
    note: "Please mention 'Bottomless Gnocchi' in your booking notes to secure this offer.",
    highlight: '$39 per person',
    imageUrl: '/images/0J5A9373.webp',
    theme: 'green',
  },
  {
    id: 'sunday',
    title: 'Sunday Special',
    subtitle: 'Pizza or Pasta + Spritz',
    description:
      'Make your Sunday the most delicious day of the week. Any pizza or pasta paired with a perfectly crafted Aperol Spritz. Valid for one drink per person. Excludes Linguine di Mare.',
    days: 'Every Sunday',
    time: 'All evening',
    note: 'Valid for one Spritz per person. Excludes Linguine di Mare.',
    highlight: '$35 per person',
    imageUrl: '/images/image-asset.webp',
    theme: 'terracotta',
  },
  {
    id: 'calzone',
    title: 'Free Nutella Calzone',
    subtitle: 'Sweet Ending',
    description:
      'End your dinner on the sweetest note — a complimentary Nutella Calzone folded with creamy ricotta and dusted with icing sugar, on us. The perfect Italian finale to your evening.',
    days: 'Tuesday · Wednesday · Thursday',
    time: 'After dinner',
    highlight: 'Complimentary',
    imageUrl: '/images/STDOM_OCT_PS--07.webp',
    theme: 'charcoal',
  },
]
