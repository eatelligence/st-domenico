-- Seed menu_categories + menu_items from lib/data/menu.ts (static source of truth
-- prior to this migration). One CTE per category so items link to the
-- freshly-generated category id. Category/item order preserved via sort_order.

-- 0: Pizze
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Pizze', '🍕', 0) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Boscaiola', 'San Marzano tomato, fior di latte, mushrooms, prosciutto cotto, truffle oil', '$24', '$27', false, false, false, null::text, null::text, 0),
  ('Mantovana', 'San Marzano tomato, fior di latte, olives, mushrooms, anchovies, capers', '$24', '$27', false, false, true, null, null, 1),
  ('Prosciutto', 'San Marzano tomato, fior di latte, prosciutto crudo', '$24', '$27', false, false, false, null, null, 2),
  ('Calabrese', 'San Marzano tomato, fior di latte, spicy salami, chilli, red onion', '$24', '$27', false, false, false, null, null, 3),
  ('Margherita', 'San Marzano tomato, fior di latte, basil, extra virgin olive oil', '$20', '$23', true, false, false, null, null, 4),
  ('Quattro Formaggi', 'Fior di latte, gorgonzola, pecorino, parmigiano reggiano', '$24', '$27', true, false, false, null, null, 5),
  ('Capricciosa', 'San Marzano tomato, fior di latte, mushrooms, prosciutto cotto, olives, artichoke', '$24', '$27', false, false, false, null, null, 6),
  ('Montanara', 'San Marzano tomato, fior di latte, Italian sausage, mushrooms, rosemary', '$24', '$27', false, false, false, null, null, 7),
  ('Romana', 'San Marzano tomato, fior di latte, anchovies, capers, olives', '$24', '$27', false, false, true, null, null, 8),
  ('Della Lupa', 'San Marzano tomato, fior di latte, spicy nduja, honey, burrata', '$26', '$29', false, false, false, null, null, 9),
  ('Napoletana', 'San Marzano tomato, fior di latte, anchovies, black olives, capers, extra virgin olive oil', '$24', '$27', false, false, true, null, null, 10),
  ('Salami', 'San Marzano tomato, fior di latte, Italian salami', '$23', '$26', false, false, false, null, null, 11),
  ('Fiorentina', 'Fior di latte, spinach, egg, garlic, extra virgin olive oil', '$23', '$26', true, false, false, null, null, 12),
  ('Ortolana', 'San Marzano tomato, fior di latte, zucchini, eggplant, capsicum, red onion, olives', '$23', '$26', true, false, false, null, null, 13),
  ('Salsiccia', 'San Marzano tomato, fior di latte, Italian sausage, broccolini, chilli', '$24', '$27', false, false, false, null, null, 14),
  ('Gamberi', 'Fior di latte, tiger prawns, garlic, chilli, lemon, rocket', '$26', '$29', false, false, true, null, null, 15),
  ('Patate', 'Fior di latte, potato, rosemary, pancetta, garlic', '$23', '$26', false, false, false, null, null, 16),
  ('Tartufo', 'Fior di latte, mushrooms, truffle oil, parmigiano reggiano, rocket', '$26', '$29', true, false, false, null, null, 17),
  ('Hawaiian', 'San Marzano tomato, fior di latte, prosciutto cotto, pineapple', '$22', '$25', false, false, false, null, null, 18),
  ('Pescatora', 'San Marzano tomato, mixed seafood, garlic, chilli, parsley', '$28', '$31', false, false, true, null, null, 19)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);

-- 1: Stuzzichini
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Stuzzichini', '🫒', 1) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Antipasto Misto', 'Selection of cured meats, artisan cheeses, olives, grilled vegetables, house bread', '$26', null::text, false, false, false, null::text, null::text, 0),
  ('Bruschetta Prosciutto e Rucola', 'Toasted sourdough, prosciutto crudo, rocket, cherry tomatoes, parmigiano', '$18', null, false, false, false, null, null, 1),
  ('Fior di Latte e Prosciutto', 'Fresh fior di latte, San Daniele prosciutto, extra virgin olive oil, basil', '$20', null, false, false, false, null, null, 2),
  ('Arancini', 'Risotto rice balls, filled with ragù and mozzarella, crispy breadcrumb crust', '$16', null, true, false, false, null, null, 3),
  ('Focaccia', 'House-made focaccia, rosemary, sea salt, extra virgin olive oil', '$10', null, true, false, false, null, null, 4),
  ('Ricotta Salata', 'Whipped ricotta salata, roasted cherry tomatoes, basil oil, crostini', '$16', null, true, false, false, null, null, 5),
  ('Bresaola e Rucola', 'Air-dried beef bresaola, wild rocket, shaved parmigiano, lemon, olive oil', '$19', null, false, false, false, null, null, 6),
  ('Olives & Bread', 'Marinated mixed olives, house bread, extra virgin olive oil', '$12', null, true, false, false, null, null, 7),
  ('Calamari Fritti', 'Crispy fried calamari, aioli, lemon, parsley', '$19', null, false, false, true, null, null, 8)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);

-- 2: Pasta
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Pasta', '🍝', 2) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Gnocchi Sorrentina', 'House-made potato gnocchi, San Marzano tomato, fior di latte, basil', '$24', null::text, true, false, false, null::text, null::text, 0),
  ('Pappardelle Bolognese', 'Wide egg pasta, slow-cooked beef and pork ragù, parmigiano reggiano', '$26', null, false, false, false, null, null, 1),
  ('Linguine di Mare', 'Linguine, mixed seafood, garlic, chilli, white wine, cherry tomatoes, parsley', '$30', null, false, false, true, null, null, 2),
  ('Lasagna', 'Layers of fresh pasta, slow-cooked beef ragù, béchamel, parmigiano reggiano', '$26', null, false, false, false, null, null, 3),
  ('Gnocchi Pesto', 'House-made potato gnocchi, Ligurian basil pesto, green beans, potato', '$24', null, true, false, false, null, null, 4),
  ('Ravioli Pumpkin & Ricotta', 'House-made ravioli, roasted pumpkin, ricotta, burnt butter, sage, parmigiano', '$26', null, true, false, false, null, null, 5),
  ('Fettuccine Carbonara', 'Egg fettuccine, pancetta, egg yolk, pecorino romano, black pepper', '$26', null, false, false, false, null, null, 6),
  ('Gnocchi Gorgonzola', 'House-made potato gnocchi, gorgonzola dolce, walnuts, pear, honey', '$24', null, true, false, false, null, null, 7),
  ('Pappardelle Tartufo e Funghi', 'Wide egg pasta, mixed mushrooms, truffle oil, parmigiano reggiano, parsley', '$28', null, true, false, false, null, null, 8)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);

-- 3: Dal'Orto
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Dal''Orto', '🥗', 3) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Formaggio e Pere', 'Mixed greens, gorgonzola, pear, walnuts, honey dressing', '$18', null::text, true, false, false, null::text, null::text, 0),
  ('Insalata Siciliana', 'Heirloom tomatoes, cucumber, red onion, olives, capers, basil, oregano', '$16', null, true, false, false, null, null, 1),
  ('Caprese', 'Buffalo mozzarella, heirloom tomatoes, basil, extra virgin olive oil, sea salt', '$20', null, true, false, false, null, null, 2),
  ('Patatine Fritte', 'Crispy house fries, rosemary salt, aioli', '$10', null, true, false, false, null, null, 3)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);

-- 4: Pasticceria
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Pasticceria', '🍮', 4) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Bomboloni', 'Italian filled doughnuts, Nutella or custard, icing sugar', '$12', null::text, true, false, false, null::text, null::text, 0),
  ('Tiramisù', 'Classic Italian tiramisù, savoiardi, espresso, mascarpone, cocoa', '$14', null, true, false, false, null, null, 1),
  ('Cannoli Zia Matta', 'Crispy pastry shell, whipped ricotta, candied orange, chocolate chips', '$13', null, true, false, false, null, null, 2),
  ('Gelati', 'Artisan gelato — Lemon / Strawberry / Chocolate / Vanilla (2 scoops)', '$10', null, true, false, false, null, null, 3)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);

-- 5: Sweet Pizze
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Sweet Pizze', '🍫', 5) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Bomba Nutella', 'Pizza base, Nutella, icing sugar, toasted hazelnuts', '$16', null::text, true, false, false, null::text, null::text, 0),
  ('Calzone Fragola', 'Folded pizza, strawberry jam, ricotta, icing sugar', '$15', null, true, false, false, null, null, 1),
  ('Calzone Nutella', 'Folded pizza, Nutella, ricotta, icing sugar — FREE after dinner Tue–Thu', '$15', null, true, false, false, 'Free Tue–Thu', null, 2)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);

-- 6: Drinks
with c as (
  insert into public.menu_categories (label, emoji, sort_order)
  values ('Drinks', '🍷', 6) returning id
)
insert into public.menu_items
  (category_id, name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order)
select c.id, v.name, v.description, v.price, v.price_gf, v.is_vegetarian, v.is_gluten_free, v.is_seafood, v.badge, v.allergens, v.sort_order
from c, (values
  ('Peroni Nastro Azzurro', 'Iconic Italian lager — 330ml', '$10', null::text, false, false, false, null::text, null::text, 0),
  ('Peroni Light', 'Lower alcohol Italian lager — 330ml', '$9', null, false, false, false, null, null, 1),
  ('Peroni GF', 'Gluten free Peroni — 330ml', '$10', null, false, true, false, null, null, 2),
  ('Peroni Red', 'Amber lager — 330ml', '$10', null, false, false, false, null, null, 3),
  ('Moretti', 'Classic Italian lager — 330ml', '$10', null, false, false, false, null, null, 4),
  ('Corona', 'Mexican lager, lime — 330ml', '$9', null, false, false, false, null, null, 5),
  ('Crown Lager', 'Australian premium lager — 375ml', '$9', null, false, false, false, null, null, 6),
  ('Chianti DOC', 'Tuscany — glass / bottle', '$12 / $50', null, false, false, false, null, null, 7),
  ('Barossa Shiraz', 'South Australia — glass / bottle', '$12 / $48', null, false, false, false, null, null, 8),
  ('Sauvignon Blanc NZ', 'Marlborough, New Zealand — glass / bottle', '$12 / $48', null, false, false, false, null, null, 9),
  ('Montepulciano DOC', 'Abruzzo, Italy — glass / bottle', '$13 / $52', null, false, false, false, null, null, 10),
  ('Syrah', 'Rhône Valley — glass / bottle', '$13 / $52', null, false, false, false, null, null, 11),
  ('Riesling Clare Valley', 'South Australia — glass / bottle', '$12 / $48', null, false, false, false, null, null, 12),
  ('Barbera D''Asti DOC', 'Piedmont, Italy — glass / bottle', '$13 / $52', null, false, false, false, null, null, 13),
  ('Pinot Grigio Veneto', 'Veneto, Italy — glass / bottle', '$12 / $48', null, false, false, false, null, null, 14),
  ('Chardonnay', 'Margaret River, WA — glass / bottle', '$12 / $48', null, false, false, false, null, null, 15),
  ('Nero D''Avola', 'Sicily, Italy — glass / bottle', '$13 / $52', null, false, false, false, null, null, 16),
  ('Sicilian Dry White', 'Sicily, Italy — glass / bottle', '$12 / $48', null, false, false, false, null, null, 17),
  ('Marsala', 'Fortified wine, Sicily — 60ml', '$10', null, false, false, false, null, null, 18),
  ('Sangiovese', 'Tuscany, Italy — glass / bottle', '$12 / $48', null, false, false, false, null, null, 19),
  ('Prosecco DOC', 'Veneto, Italy — glass / bottle', '$13 / $55', null, false, false, false, null, null, 20)
) as v(name, description, price, price_gf, is_vegetarian, is_gluten_free, is_seafood, badge, allergens, sort_order);
