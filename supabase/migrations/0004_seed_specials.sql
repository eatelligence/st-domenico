insert into public.specials (title, subtitle, description, highlight, days, "time", note, image_url, theme, sort_order) values
(
  'Bottomless Gnocchi or Pizza',
  'All You Can Eat',
  'Indulge in unlimited gnocchi or pizza with your choice of Gorgonzola, Sorrentina, or Pomodoro sauce. For pizza lovers, enjoy a selection of 5 mixed pizzas — all you can eat in 90 minutes of pure Italian pleasure.',
  '$39 per person',
  'Tuesday · Wednesday · Thursday',
  'From 5:00pm',
  'Please mention ''Bottomless Gnocchi'' in your booking notes to secure this offer.',
  '/images/0J5A9373.webp',
  'green',
  0
),
(
  'Sunday Special',
  'Pizza or Pasta + Spritz',
  'Make your Sunday the most delicious day of the week. Any pizza or pasta paired with a perfectly crafted Aperol Spritz. Valid for one drink per person. Excludes Linguine di Mare.',
  '$35 per person',
  'Every Sunday',
  'All evening',
  'Valid for one Spritz per person. Excludes Linguine di Mare.',
  '/images/image-asset.webp',
  'terracotta',
  1
),
(
  'Free Nutella Calzone',
  'Sweet Ending',
  'End your dinner on the sweetest note — a complimentary Nutella Calzone folded with creamy ricotta and dusted with icing sugar, on us. The perfect Italian finale to your evening.',
  'Complimentary',
  'Tuesday · Wednesday · Thursday',
  'After dinner',
  null,
  '/images/STDOM_OCT_PS--07.webp',
  'charcoal',
  2
);

insert into public.site_banner (message, href, is_active) values
(
  '🍰  Free Nutella Calzone after dinner Tue – Thu  ·  Book Now  ›',
  '#bookings',
  false
);
