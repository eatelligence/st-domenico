export type MenuItem = {
  name: string
  description: string
  price?: string
  priceGF?: string
  isVegetarian?: boolean
  isGlutenFree?: boolean
  isSeafood?: boolean
  badge?: string
  allergens?: string
}

export type MenuCategory = {
  id: string
  label: string
  emoji: string
  items: MenuItem[]
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'pizze',
    label: 'Pizze',
    emoji: '🍕',
    items: [
      {
        name: 'Boscaiola',
        description: "San Marzano tomato, fior di latte, mushrooms, prosciutto cotto, truffle oil",
        price: '$24',
        priceGF: '$27',
      },
      {
        name: 'Mantovana',
        description: "San Marzano tomato, fior di latte, olives, mushrooms, anchovies, capers",
        price: '$24',
        priceGF: '$27',
        isSeafood: true,
      },
      {
        name: 'Prosciutto',
        description: "San Marzano tomato, fior di latte, prosciutto crudo",
        price: '$24',
        priceGF: '$27',
      },
      {
        name: 'Calabrese',
        description: "San Marzano tomato, fior di latte, spicy salami, chilli, red onion",
        price: '$24',
        priceGF: '$27',
      },
      {
        name: 'Margherita',
        description: "San Marzano tomato, fior di latte, basil, extra virgin olive oil",
        price: '$20',
        priceGF: '$23',
        isVegetarian: true,
      },
      {
        name: 'Quattro Formaggi',
        description: "Fior di latte, gorgonzola, pecorino, parmigiano reggiano",
        price: '$24',
        priceGF: '$27',
        isVegetarian: true,
      },
      {
        name: 'Capricciosa',
        description: "San Marzano tomato, fior di latte, mushrooms, prosciutto cotto, olives, artichoke",
        price: '$24',
        priceGF: '$27',
      },
      {
        name: 'Montanara',
        description: "San Marzano tomato, fior di latte, Italian sausage, mushrooms, rosemary",
        price: '$24',
        priceGF: '$27',
      },
      {
        name: 'Romana',
        description: "San Marzano tomato, fior di latte, anchovies, capers, olives",
        price: '$24',
        priceGF: '$27',
        isSeafood: true,
      },
      {
        name: 'Della Lupa',
        description: "San Marzano tomato, fior di latte, spicy nduja, honey, burrata",
        price: '$26',
        priceGF: '$29',
      },
      {
        name: 'Napoletana',
        description: "San Marzano tomato, fior di latte, anchovies, black olives, capers, extra virgin olive oil",
        price: '$24',
        priceGF: '$27',
        isSeafood: true,
      },
      {
        name: 'Salami',
        description: "San Marzano tomato, fior di latte, Italian salami",
        price: '$23',
        priceGF: '$26',
      },
      {
        name: 'Fiorentina',
        description: "Fior di latte, spinach, egg, garlic, extra virgin olive oil",
        price: '$23',
        priceGF: '$26',
        isVegetarian: true,
      },
      {
        name: 'Ortolana',
        description: "San Marzano tomato, fior di latte, zucchini, eggplant, capsicum, red onion, olives",
        price: '$23',
        priceGF: '$26',
        isVegetarian: true,
      },
      {
        name: 'Salsiccia',
        description: "San Marzano tomato, fior di latte, Italian sausage, broccolini, chilli",
        price: '$24',
        priceGF: '$27',
      },
      {
        name: 'Gamberi',
        description: "Fior di latte, tiger prawns, garlic, chilli, lemon, rocket",
        price: '$26',
        priceGF: '$29',
        isSeafood: true,
      },
      {
        name: 'Patate',
        description: "Fior di latte, potato, rosemary, pancetta, garlic",
        price: '$23',
        priceGF: '$26',
      },
      {
        name: 'Tartufo',
        description: "Fior di latte, mushrooms, truffle oil, parmigiano reggiano, rocket",
        price: '$26',
        priceGF: '$29',
        isVegetarian: true,
      },
      {
        name: 'Hawaiian',
        description: "San Marzano tomato, fior di latte, prosciutto cotto, pineapple",
        price: '$22',
        priceGF: '$25',
      },
      {
        name: 'Pescatora',
        description: "San Marzano tomato, mixed seafood, garlic, chilli, parsley",
        price: '$28',
        priceGF: '$31',
        isSeafood: true,
      },
    ],
  },
  {
    id: 'stuzzichini',
    label: 'Stuzzichini',
    emoji: '🫒',
    items: [
      {
        name: 'Antipasto Misto',
        description: "Selection of cured meats, artisan cheeses, olives, grilled vegetables, house bread",
        price: '$26',
      },
      {
        name: 'Bruschetta Prosciutto e Rucola',
        description: "Toasted sourdough, prosciutto crudo, rocket, cherry tomatoes, parmigiano",
        price: '$18',
      },
      {
        name: 'Fior di Latte e Prosciutto',
        description: "Fresh fior di latte, San Daniele prosciutto, extra virgin olive oil, basil",
        price: '$20',
      },
      {
        name: 'Arancini',
        description: "Risotto rice balls, filled with ragù and mozzarella, crispy breadcrumb crust",
        price: '$16',
        isVegetarian: true,
      },
      {
        name: 'Focaccia',
        description: "House-made focaccia, rosemary, sea salt, extra virgin olive oil",
        price: '$10',
        isVegetarian: true,
      },
      {
        name: 'Ricotta Salata',
        description: "Whipped ricotta salata, roasted cherry tomatoes, basil oil, crostini",
        price: '$16',
        isVegetarian: true,
      },
      {
        name: 'Bresaola e Rucola',
        description: "Air-dried beef bresaola, wild rocket, shaved parmigiano, lemon, olive oil",
        price: '$19',
      },
      {
        name: 'Olives & Bread',
        description: "Marinated mixed olives, house bread, extra virgin olive oil",
        price: '$12',
        isVegetarian: true,
      },
      {
        name: 'Calamari Fritti',
        description: "Crispy fried calamari, aioli, lemon, parsley",
        price: '$19',
        isSeafood: true,
      },
    ],
  },
  {
    id: 'pasta',
    label: 'Pasta',
    emoji: '🍝',
    items: [
      {
        name: 'Gnocchi Sorrentina',
        description: "House-made potato gnocchi, San Marzano tomato, fior di latte, basil",
        price: '$24',
        isVegetarian: true,
      },
      {
        name: 'Pappardelle Bolognese',
        description: "Wide egg pasta, slow-cooked beef and pork ragù, parmigiano reggiano",
        price: '$26',
      },
      {
        name: 'Linguine di Mare',
        description: "Linguine, mixed seafood, garlic, chilli, white wine, cherry tomatoes, parsley",
        price: '$30',
        isSeafood: true,
      },
      {
        name: 'Lasagna',
        description: "Layers of fresh pasta, slow-cooked beef ragù, béchamel, parmigiano reggiano",
        price: '$26',
      },
      {
        name: 'Gnocchi Pesto',
        description: "House-made potato gnocchi, Ligurian basil pesto, green beans, potato",
        price: '$24',
        isVegetarian: true,
      },
      {
        name: 'Ravioli Pumpkin & Ricotta',
        description: "House-made ravioli, roasted pumpkin, ricotta, burnt butter, sage, parmigiano",
        price: '$26',
        isVegetarian: true,
      },
      {
        name: 'Fettuccine Carbonara',
        description: "Egg fettuccine, pancetta, egg yolk, pecorino romano, black pepper",
        price: '$26',
      },
      {
        name: 'Gnocchi Gorgonzola',
        description: "House-made potato gnocchi, gorgonzola dolce, walnuts, pear, honey",
        price: '$24',
        isVegetarian: true,
      },
      {
        name: 'Pappardelle Tartufo e Funghi',
        description: "Wide egg pasta, mixed mushrooms, truffle oil, parmigiano reggiano, parsley",
        price: '$28',
        isVegetarian: true,
      },
    ],
  },
  {
    id: 'dalorto',
    label: "Dal'Orto",
    emoji: '🥗',
    items: [
      {
        name: 'Formaggio e Pere',
        description: "Mixed greens, gorgonzola, pear, walnuts, honey dressing",
        price: '$18',
        isVegetarian: true,
      },
      {
        name: 'Insalata Siciliana',
        description: "Heirloom tomatoes, cucumber, red onion, olives, capers, basil, oregano",
        price: '$16',
        isVegetarian: true,
      },
      {
        name: 'Caprese',
        description: "Buffalo mozzarella, heirloom tomatoes, basil, extra virgin olive oil, sea salt",
        price: '$20',
        isVegetarian: true,
      },
      {
        name: 'Patatine Fritte',
        description: "Crispy house fries, rosemary salt, aioli",
        price: '$10',
        isVegetarian: true,
      },
    ],
  },
  {
    id: 'pasticceria',
    label: 'Pasticceria',
    emoji: '🍮',
    items: [
      {
        name: 'Bomboloni',
        description: "Italian filled doughnuts, Nutella or custard, icing sugar",
        price: '$12',
        isVegetarian: true,
      },
      {
        name: 'Tiramisù',
        description: "Classic Italian tiramisù, savoiardi, espresso, mascarpone, cocoa",
        price: '$14',
        isVegetarian: true,
      },
      {
        name: 'Cannoli Zia Matta',
        description: "Crispy pastry shell, whipped ricotta, candied orange, chocolate chips",
        price: '$13',
        isVegetarian: true,
      },
      {
        name: 'Gelati',
        description: "Artisan gelato — Lemon / Strawberry / Chocolate / Vanilla (2 scoops)",
        price: '$10',
        isVegetarian: true,
      },
    ],
  },
  {
    id: 'sweet-pizze',
    label: 'Sweet Pizze',
    emoji: '🍫',
    items: [
      {
        name: 'Bomba Nutella',
        description: "Pizza base, Nutella, icing sugar, toasted hazelnuts",
        price: '$16',
        isVegetarian: true,
      },
      {
        name: 'Calzone Fragola',
        description: "Folded pizza, strawberry jam, ricotta, icing sugar",
        price: '$15',
        isVegetarian: true,
      },
      {
        name: 'Calzone Nutella',
        description: "Folded pizza, Nutella, ricotta, icing sugar — FREE after dinner Tue–Thu",
        price: '$15',
        isVegetarian: true,
        badge: 'Free Tue–Thu',
      },
    ],
  },
  {
    id: 'drinks',
    label: 'Drinks',
    emoji: '🍷',
    items: [
      {
        name: 'Peroni Nastro Azzurro',
        description: "Iconic Italian lager — 330ml",
        price: '$10',
      },
      {
        name: 'Peroni Light',
        description: "Lower alcohol Italian lager — 330ml",
        price: '$9',
      },
      {
        name: 'Peroni GF',
        description: "Gluten free Peroni — 330ml",
        price: '$10',
        isGlutenFree: true,
      },
      {
        name: 'Peroni Red',
        description: "Amber lager — 330ml",
        price: '$10',
      },
      {
        name: 'Moretti',
        description: "Classic Italian lager — 330ml",
        price: '$10',
      },
      {
        name: 'Corona',
        description: "Mexican lager, lime — 330ml",
        price: '$9',
      },
      {
        name: 'Crown Lager',
        description: "Australian premium lager — 375ml",
        price: '$9',
      },
      {
        name: 'Chianti DOC',
        description: "Tuscany — glass / bottle",
        price: '$12 / $50',
      },
      {
        name: 'Barossa Shiraz',
        description: "South Australia — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: 'Sauvignon Blanc NZ',
        description: "Marlborough, New Zealand — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: 'Montepulciano DOC',
        description: "Abruzzo, Italy — glass / bottle",
        price: '$13 / $52',
      },
      {
        name: 'Syrah',
        description: "Rhône Valley — glass / bottle",
        price: '$13 / $52',
      },
      {
        name: 'Riesling Clare Valley',
        description: "South Australia — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: "Barbera D'Asti DOC",
        description: "Piedmont, Italy — glass / bottle",
        price: '$13 / $52',
      },
      {
        name: 'Pinot Grigio Veneto',
        description: "Veneto, Italy — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: 'Chardonnay',
        description: "Margaret River, WA — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: "Nero D'Avola",
        description: "Sicily, Italy — glass / bottle",
        price: '$13 / $52',
      },
      {
        name: 'Sicilian Dry White',
        description: "Sicily, Italy — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: 'Marsala',
        description: "Fortified wine, Sicily — 60ml",
        price: '$10',
      },
      {
        name: 'Sangiovese',
        description: "Tuscany, Italy — glass / bottle",
        price: '$12 / $48',
      },
      {
        name: 'Prosecco DOC',
        description: "Veneto, Italy — glass / bottle",
        price: '$13 / $55',
      },
    ],
  },
]
