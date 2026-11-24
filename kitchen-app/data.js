/* Aaj Kay Banvaycha — data. Recipes serve 4 (2 adults + 2 kids). ing: [qty, unit, item] (qty null = to taste / not scaled).
   tags: P protein · G greens · M millet · D dairy · R raw · C chicken · S seafood · E egg · U upvas · F fried · fun
   art: [shape, base, accent, speck]  shapes: bowl flat heap glass fish chicken roll modak */
window.KITCHEN = (function () {
  const R = {};
  function add(id, o) { o.id = id; R[id] = o; }

  /* ---------------- NASHTA ---------------- */
  add('poha', { n: 'Kanda Poha', m: 'कांदा पोहे', cat: 'nashta', tags: ['P'], time: 25, spice: 'Mild', nut: 'Iron, carbs, peanut protein',
    ing: [[2.5, 'cup', 'thick poha'], [2, '', 'onions, chopped'], [0.5, 'cup', 'green peas'], [3, 'tbsp', 'peanuts'], [2, '', 'green chillies'], [2, 'tsp', 'oil'], [null, '', 'mustard, jeera, kadipatta, haldi, salt'], [0.5, '', 'lemon'], [null, '', 'kothimbir & fresh coconut']],
    steps: ['Rinse poha 2–3 times in a sieve and drain. Mix in salt, a pinch of sugar and haldi; rest 5 minutes.', 'Heat oil, crackle mustard and jeera, add kadipatta and roast the peanuts till crunchy.', 'Add chillies and onion; sauté till translucent. Add peas, cover for 3 minutes.', 'Add poha, toss gently on low heat, cover for 2 minutes to steam.', 'Off the heat, squeeze lemon and garnish with kothimbir and coconut.'],
    tip: 'Squeeze the lemon after switching off the gas — heat destroys vitamin C, which helps absorb poha\'s iron.', kids: 'Skip the chilli; add grated carrot and sweet corn.', healthy: 'Serve with a katori of dahi or add ½ cup steamed sprouts for protein.',
    art: ['heap', '#F2C94C', '#7CB342', '#8D6E63'], g: ['poha', 'onion', 'peas', 'peanuts', 'lemon', 'kothimbir'] });

  add('upit', { n: 'Vegetable Upit', m: 'उपीट', cat: 'nashta', tags: [], time: 25, spice: 'Mild', nut: 'Carbs, fibre from vegetables',
    ing: [[1.25, 'cup', 'rava (or whole-wheat dalia rava)'], [1, '', 'onion'], [1, 'cup', 'carrot, beans, peas, capsicum'], [1, 'tsp', 'urad dal'], [1, 'tsp', 'chana dal'], [3.5, 'cup', 'hot water'], [2, 'tsp', 'oil'], [1, 'tsp', 'tup'], [null, '', 'mustard, kadipatta, salt, lemon']],
    steps: ['Dry-roast rava till aromatic, not brown. Keep aside.', 'Make the phodni with mustard, urad and chana dal till golden; add onion and vegetables, sauté 4 minutes.', 'Pour in hot water and salt; bring to a boil.', 'Lower the heat and add rava in a thin stream, stirring all the time.', 'Cover for 3 minutes, finish with tup and lemon.'],
    tip: 'Always use hot water, about 1 : 2.75 rava to water, for soft upit without lumps.', kids: 'A spoon of tup and a few cashews make it a favourite.', healthy: 'Use whole-wheat rava and add a handful of peanuts.',
    art: ['heap', '#F5E6B8', '#E67E22', '#43A047'], g: ['rava', 'onion', 'carrot', 'beans', 'capsicum', 'peas'] });

  add('thalipeeth', { n: 'Methi Thalipeeth', m: 'मेथी थालीपीठ', cat: 'nashta', tags: ['M', 'G', 'P'], time: 30, spice: 'Medium', nut: 'Multigrain protein, iron, fibre',
    ing: [[2, 'cup', 'thalipeeth bhajani (jowar, bajra, besan, wheat, urad)'], [1, '', 'onion, finely chopped'], [1, 'cup', 'methi or palak, chopped'], [1, 'tsp', 'jeera, ajwain & til each'], [1, 'tsp', 'chilli powder'], [null, '', 'haldi, salt'], [4, 'tsp', 'oil']],
    steps: ['Mix everything and knead a soft dough with warm water.', 'On a wet plastic sheet or banana leaf, pat a ball into a 6-inch round. Make 4–5 small holes.', 'Move it to a hot tawa and drop a few drops of oil into each hole.', 'Cover and cook 2–3 minutes on medium heat, flip and crisp the other side.'],
    tip: 'Pat with wet fingers so the edges stay thin and crisp.', kids: 'Cut star shapes; add grated carrot or beetroot. Serve with loni (white butter).', healthy: 'Serve with dahi instead of ketchup. Great for tiffin — stays good for 5 hours.',
    art: ['flat', '#C9A46A', '#558B2F', '#6D4C41'], g: ['bhajani', 'methi', 'onion', 'dahi'] });

  add('moongdhirde', { n: 'Moong Dal Dhirde', m: 'मूग डाळ धिरडे', cat: 'nashta', tags: ['P'], time: 20, spice: 'Mild', pre: 'Soak 1 cup moong dal (4 hours or overnight)', nut: 'High protein, light on the stomach',
    ing: [[1, 'cup', 'yellow or green moong dal, soaked'], [1, 'inch', 'ginger'], [2, '', 'green chillies'], [2, 'tbsp', 'rava or rice flour'], [0.5, 'tsp', 'jeera'], [1, '', 'onion & tomato, chopped'], [100, 'g', 'paneer, grated (optional)'], [null, '', 'salt, kothimbir, oil']],
    steps: ['Grind soaked dal with ginger and chillies to a smooth batter using little water.', 'Add rava, salt and jeera; make it like dosa batter.', 'Spread a ladleful on a hot greased tawa and sprinkle onion, tomato and kothimbir.', 'Drizzle oil, cook till golden, flip for 1 minute.'],
    tip: 'Rest the batter 10 minutes after adding rava — the dhirde turn crisp at the edges.', kids: 'Fill with grated paneer and roll it: "moong pizza".', healthy: 'Green chutney or tomato chutney instead of sauce.',
    art: ['flat', '#E8C547', '#43A047', '#E53935'], g: ['moong dal', 'paneer', 'onion', 'tomato', 'ginger'] });

  add('besandhirde', { n: 'Besan-Methi Dhirde', m: 'बेसनाचे धिरडे', cat: 'nashta', tags: ['P', 'G'], time: 20, spice: 'Mild', nut: 'Protein, iron from methi',
    ing: [[1.5, 'cup', 'besan'], [0.25, 'cup', 'rice flour'], [1, '', 'onion'], [1, '', 'tomato'], [1, 'cup', 'methi or palak, chopped'], [0.5, 'tsp', 'ajwain'], [null, '', 'haldi, chilli, salt, oil']],
    steps: ['Whisk besan, rice flour and spices with water into a pourable batter. Rest 10 minutes.', 'Stir in onion, tomato and greens.', 'Spread on a hot greased tawa, drizzle oil, cook both sides till golden.'],
    tip: 'A little rice flour makes besan dhirde crisp instead of soft.', kids: 'Add grated dudhi — they won\'t notice it.', healthy: 'Serve with a katori of dahi.',
    art: ['flat', '#E0A82E', '#2E7D32', '#C62828'], g: ['besan', 'methi', 'onion', 'tomato'] });

  add('nachnisatva', { n: 'Nachni Satva', m: 'नाचणी सत्व', cat: 'nashta', tags: ['M', 'D'], time: 10, spice: 'None', nut: 'Calcium and iron — excellent for growing kids',
    ing: [[6, 'tbsp', 'nachni (ragi) flour'], [2, 'tsp', 'tup'], [2, 'cup', 'water'], [3, 'cup', 'milk'], [4, '', 'dates, chopped (or 3 tsp gul)'], [null, '', 'elaichi, almond-cashew powder']],
    steps: ['Roast nachni flour in tup on low heat till it smells nutty.', 'Whisk in water without lumps; cook 3–4 minutes.', 'Add milk and dates, boil 2 minutes, add elaichi.', 'Top with dry-fruit powder.'],
    tip: 'Whisk constantly when adding water — nachni lumps quickly.', kids: 'Sweeten with dates instead of sugar.', healthy: 'Adults can have it salted with taak instead of milk.',
    art: ['glass', '#8D5A4A', '#D7B899', '#F5E1C8'], g: ['nachni flour', 'milk', 'dates'] });

  add('ukadpendi', { n: 'Ukadpendi', m: 'उकडपेंडी', cat: 'nashta', tags: ['D'], time: 20, spice: 'Medium', nut: 'Fibre, probiotic from taak',
    ing: [[1.5, 'cup', 'wheat atta or jowar flour'], [1, '', 'onion'], [5, '', 'garlic cloves'], [1, 'tsp', 'chilli powder'], [1.5, 'cup', 'taak'], [2, 'tsp', 'oil'], [null, '', 'jeera, mustard, salt, kothimbir']],
    steps: ['Dry-roast the flour till light brown and aromatic.', 'Make a phodni with jeera, garlic and onion.', 'Add the roasted flour and mix well.', 'Sprinkle taak little by little, stirring, till crumbly-soft. Cover and steam 3 minutes.'],
    tip: 'Roast the flour well — raw flour taste spoils ukadpendi.', kids: 'Less chilli, extra spoon of tup.', healthy: 'Use jowar flour to make it a millet breakfast.',
    art: ['heap', '#B8875A', '#558B2F', '#5D4037'], g: ['atta', 'onion', 'garlic', 'dahi'] });

  add('misal', { n: 'Misal Pav', m: 'मिसळ पाव', cat: 'nashta', tags: ['P', 'fun'], time: 45, spice: 'Spicy (kids\' portion separate)', pre: 'Sprout 1½ cups matki and moong (start 2 days ahead)', nut: 'Sprout protein, fibre',
    ing: [[2, 'cup', 'sprouted matki & moong'], [3, '', 'onions'], [1, '', 'tomato'], [0.5, 'cup', 'dry khobra'], [6, '', 'garlic cloves'], [2, 'tsp', 'kanda-lasun / Kolhapuri masala'], [3, 'tbsp', 'oil'], [8, '', 'whole-wheat pav'], [0.5, 'cup', 'farsan'], [null, '', 'lemon, kothimbir, salt']],
    steps: ['Usal: cook sprouts with phodni, 1 onion, tomato, goda masala and 1 cup water (1 whistle).', 'Kat: roast 2 onions and khobra till dark, grind with garlic and ginger.', 'Cook the paste in oil till oil separates; add masala, 4 cups hot water and salt. Boil 10 minutes till red oil floats.', 'Serve usal in a bowl, pour kat on top, then onion, kothimbir, lemon and a little farsan. Pav on the side.'],
    tip: 'Roast khobra and onion almost dark — that gives misal its deep red colour and smoky taste.', kids: 'Usal with dahi and no kat.', healthy: 'More onion, tomato and kothimbir; only a spoon of farsan. One pav each for kids.',
    art: ['bowl', '#C0392B', '#F39C12', '#7CB342'], g: ['matki', 'moong', 'onion', 'tomato', 'dry khobra', 'pav', 'farsan', 'lemon'] });

  add('ghavan', { n: 'Ghavan', m: 'घावन', cat: 'nashta', tags: [], time: 20, spice: 'None', nut: 'Light, gluten-free',
    ing: [[1.5, 'cup', 'rice flour'], [0.25, 'cup', 'wheat atta (optional)'], [null, '', 'salt, water, oil'], [1, 'cup', 'coconut chutney']],
    steps: ['Whisk flour, salt and water into a thin batter.', 'Pour on a very hot greased tawa from the outside in, so lacy holes form.', 'Cover 1 minute; no need to flip.', 'Serve with coconut chutney.'],
    tip: 'The tawa must be very hot or the ghavan won\'t get its lace.', kids: 'Serve with gul-tup (jaggery and ghee).', healthy: 'Add a katori of dahi or usal for protein.',
    art: ['flat', '#F4EEE0', '#FFFFFF', '#C8B99A'], g: ['rice flour', 'coconut'] });

  add('phodnichipoli', { n: 'Phodnichi Poli', m: 'फोडणीची पोळी', cat: 'nashta', tags: ['P'], time: 15, spice: 'Mild', nut: 'Zero-waste leftover breakfast',
    ing: [[6, '', 'leftover poli, torn'], [1, '', 'onion'], [2, 'tbsp', 'peanuts'], [1, 'cup', 'steamed sprouts (optional)'], [2, 'tsp', 'oil'], [null, '', 'mustard, haldi, salt, lemon, kothimbir']],
    steps: ['Phodni with mustard, peanuts and onion.', 'Add torn poli, salt and haldi; sprinkle a little water or taak.', 'Cover 2 minutes; add sprouts, lemon and kothimbir.'],
    tip: 'Sprinkle taak instead of water for a tangy taste.', kids: 'Add grated cheese on top.', healthy: 'Sprouts or 2 beaten eggs turn it into a protein breakfast.',
    art: ['heap', '#D4A85A', '#43A047', '#8D6E63'], g: ['peanuts', 'onion', 'lemon'] });

  add('methiparatha', { n: 'Methi Paratha', m: 'मेथीचा पराठा', cat: 'nashta', tags: ['G'], time: 30, spice: 'Mild', nut: 'Iron, fibre',
    ing: [[2.5, 'cup', 'wheat atta'], [1.5, 'cup', 'methi, chopped'], [0.5, 'cup', 'dahi'], [null, '', 'ajwain, haldi, chilli, salt, oil']],
    steps: ['Knead atta with methi, dahi and spices into a soft dough.', 'Roll into parathas and cook on the tawa with a little oil till brown spots appear.'],
    tip: 'Dahi in the dough keeps parathas soft till lunch.', kids: 'Roll with a little butter and dry chutney for tiffin.', healthy: 'Cook with ½ tsp oil per paratha.',
    art: ['flat', '#C8A45C', '#33691E', '#6D4C41'], g: ['atta', 'methi', 'dahi'] });

  add('alooparatha', { n: 'Aloo-Methi Paratha', m: 'आलू मेथी पराठा', cat: 'nashta', tags: ['G', 'D'], time: 35, spice: 'Mild', nut: 'Energy, greens',
    ing: [[2.5, 'cup', 'wheat atta'], [4, '', 'potatoes, boiled & mashed'], [1, 'cup', 'methi, chopped'], [null, '', 'jeera, chilli, amchur, salt'], [1.5, 'cup', 'dahi to serve']],
    steps: ['Mix mashed potato with methi and spices.', 'Stuff into atta balls, roll gently.', 'Cook with a little tup on the tawa. Serve with dahi.'],
    tip: 'Cool the potatoes fully before stuffing so the paratha doesn\'t tear.', kids: 'Add grated cheese inside.', healthy: 'Dahi alongside adds protein.',
    art: ['flat', '#D9B26A', '#558B2F', '#795548'], g: ['atta', 'potato', 'methi', 'dahi'] });

  add('paneerparatha', { n: 'Paneer Paratha', m: 'पनीर पराठा', cat: 'nashta', tags: ['P', 'D'], time: 30, spice: 'Mild', nut: 'Protein and calcium',
    ing: [[2.5, 'cup', 'wheat atta'], [200, 'g', 'paneer, grated'], [1, '', 'onion, finely chopped'], [null, '', 'kothimbir, chilli, jeera, salt, oil']],
    steps: ['Mix paneer with onion, kothimbir and spices.', 'Stuff into atta balls, roll and cook with a little oil.'],
    tip: 'Squeeze excess water out of the paneer so it doesn\'t leak.', kids: 'Perfect tiffin with dry shengdana chutney.', healthy: 'Add grated carrot to the filling.',
    art: ['flat', '#DCC07E', '#FFFFFF', '#8D6E63'], g: ['atta', 'paneer', 'onion', 'kothimbir'] });

  add('sproutchaat', { n: 'Sprout Chaat', m: 'मोड आलेली चाट', cat: 'nashta', tags: ['P', 'R'], time: 10, spice: 'Mild', pre: 'Sprout moong & matki (2 days ahead)', nut: 'Raw protein, vitamin C',
    ing: [[2, 'cup', 'moong & matki sprouts, steamed'], [1, '', 'onion'], [1, '', 'tomato'], [1, '', 'cucumber'], [1, '', 'carrot, grated'], [null, '', 'pomegranate, chaat masala, lemon, peanuts']],
    steps: ['Steam sprouts for 5 minutes.', 'Mix with vegetables, chaat masala, lemon and peanuts.'],
    tip: 'Steaming keeps the crunch but makes sprouts easier to digest.', kids: 'Add pomegranate and a pinch of sugar.', healthy: 'Ideal 4 o\'clock snack.',
    art: ['bowl', '#9CCC65', '#E53935', '#FFB300'], g: ['moong', 'matki', 'cucumber', 'tomato', 'pomegranate', 'lemon'] });

  /* --------------- EGG --------------- */
  add('eggbhurji', { n: 'Egg Bhurji', m: 'अंडा भुर्जी', cat: 'egg', tags: ['E', 'P'], time: 15, spice: 'Mild', nut: 'Complete protein, B12',
    ing: [[6, '', 'eggs'], [1, '', 'onion'], [1, '', 'tomato'], [1, '', 'green chilli'], [2, 'tsp', 'oil'], [null, '', 'haldi, salt, kothimbir']],
    steps: ['Sauté onion, chilli and tomato in oil.', 'Add haldi and salt, then the beaten eggs.', 'Scramble on low heat till just set; add kothimbir.'],
    tip: 'Take it off the heat while still slightly soft — it keeps cooking.', kids: 'Roll in poli for tiffin.', healthy: 'Add palak or capsicum.',
    art: ['heap', '#FFD54F', '#E53935', '#43A047'], g: ['eggs', 'onion', 'tomato'] });

  add('omelette', { n: 'Palak Masala Omelette', m: 'पालक ऑम्लेट', cat: 'egg', tags: ['E', 'P', 'G'], time: 15, spice: 'Mild', nut: 'Protein, iron',
    ing: [[7, '', 'eggs (2 per adult, 1–2 per child)'], [1, 'cup', 'palak, chopped'], [1, '', 'onion'], [1, '', 'tomato'], [null, '', 'salt, pepper, oil']],
    steps: ['Beat eggs with salt and pepper; stir in vegetables.', 'Cook on a greased pan, fold, serve with poli.'],
    tip: 'Low heat and a lid make a fluffy omelette.', kids: 'Add a little cheese.', healthy: 'More vegetables, less oil.',
    art: ['flat', '#FFCA28', '#2E7D32', '#E53935'], g: ['eggs', 'palak', 'onion', 'tomato'] });

  add('andaroll', { n: 'Anda Poli Roll', m: 'अंडा पोळी रोल', cat: 'egg', tags: ['E', 'P'], time: 15, spice: 'Mild', nut: 'Protein-packed breakfast',
    ing: [[4, '', 'poli'], [5, '', 'eggs'], [1, '', 'onion'], [null, '', 'green chutney, salt, pepper']],
    steps: ['Pour beaten egg on the tawa and place a poli on top.', 'Flip when set; spread chutney, add onion and roll.'],
    tip: 'Wrap in butter paper — perfect on-the-go breakfast.', kids: 'Use a little ketchup-free tomato chutney.', healthy: 'Add lettuce or cucumber inside.',
    art: ['roll', '#D7A86E', '#FFD54F', '#43A047'], g: ['eggs', 'onion'] });

  add('eggcurry', { n: 'Andyacha Rassa', m: 'अंड्याचा रस्सा', cat: 'egg', tags: ['E', 'P'], time: 30, spice: 'Medium', nut: 'Protein, B12',
    ing: [[6, '', 'eggs, boiled'], [2, '', 'onions'], [2, '', 'tomatoes'], [0.25, 'cup', 'dry khobra'], [1, 'tsp', 'goda masala'], [null, '', 'chilli, haldi, salt, oil']],
    steps: ['Roast onion and khobra; grind with tomato.', 'Cook the paste in oil with masala till oil separates.', 'Add water and salt, boil, add scored eggs and simmer 10 minutes.'],
    tip: 'Score the eggs so the gravy soaks in.', kids: 'Take eggs and plain gravy out before the extra chilli.', healthy: 'Serve with nachni bhakri.',
    art: ['bowl', '#D35400', '#FFFFFF', '#FFC107'], g: ['eggs', 'onion', 'tomato', 'dry khobra'] });

  /* ------------- VARAN / AMTI / USAL ------------- */
  add('varan', { n: 'Sadha Varan', m: 'साधं वरण', cat: 'protein', tags: ['P'], time: 25, spice: 'None', nut: 'Protein, comfort',
    ing: [[1, 'cup', 'toor dal'], [3, 'cup', 'water'], [null, '', 'haldi, hing, salt'], [0.5, 'tsp', 'gul (optional)'], [null, '', 'tup and lemon to serve']],
    steps: ['Pressure-cook dal with water, haldi, hing and a few drops of oil (3–4 whistles).', 'Whisk smooth, add salt, gul and water to pouring consistency.', 'Boil 2 minutes. Serve over bhaat with tup and lemon.'],
    tip: 'Varan-bhaat-tup-limbu is the Maharashtrian comfort plate — keep it simple.', kids: 'Kids\' favourite as it is; add metkut on top.', healthy: 'Half a teaspoon of tup per plate is enough.',
    art: ['bowl', '#F7C948', '#FFF59D', '#E6A800'], g: ['toor dal', 'lemon'] });

  add('amti', { n: 'Toor Dal Amti', m: 'आमटी', cat: 'protein', tags: ['P'], time: 30, spice: 'Medium', nut: 'Protein; sweet-sour-spicy',
    ing: [[1, 'cup', 'toor dal, cooked'], [2, '', 'kokum (or 1 tsp tamarind pulp)'], [1, 'tbsp', 'gul'], [1, 'tsp', 'goda masala'], [0.5, 'tsp', 'chilli powder'], [2, 'tsp', 'oil'], [null, '', 'mustard, kadipatta, hing, salt, coconut, kothimbir']],
    steps: ['Phodni with mustard, kadipatta and hing.', 'Add cooked dal, water, kokum, gul, goda masala, chilli and salt.', 'Boil 8 minutes. Finish with coconut and kothimbir.'],
    tip: 'Taste for balance: sweet from gul, sour from kokum, heat from chilli — that is a Puneri amti.', kids: 'Take out a portion before chilli.', healthy: 'Use less gul each month — taste adjusts.',
    art: ['bowl', '#E9A23B', '#F5D76E', '#4CAF50'], g: ['toor dal', 'kokum', 'coconut', 'kothimbir'] });

  add('dalpalak', { n: 'Dal Palak', m: 'डाळ पालक', cat: 'protein', tags: ['P', 'G'], time: 25, spice: 'Mild', nut: 'Protein + iron + vitamin C in one pot',
    ing: [[1, 'cup', 'toor or moong dal'], [2, 'bunch', 'palak, chopped'], [1, '', 'tomato'], [5, '', 'garlic cloves'], [2, 'tsp', 'oil'], [null, '', 'jeera, salt, lemon']],
    steps: ['Pressure-cook the dal.', 'Phodni with jeera and garlic; add palak and tomato, cook 3 minutes.', 'Add dal, salt and water; boil 3 minutes. Lemon at the end.'],
    tip: 'Don\'t overcook palak — it should stay bright green.', kids: 'Blend half the palak in for a smooth dal.', healthy: 'Lemon helps absorb the iron.',
    art: ['bowl', '#7CB342', '#F7C948', '#33691E'], g: ['toor dal', 'palak', 'tomato', 'garlic', 'lemon'] });

  add('dalmethi', { n: 'Dal Methi', m: 'डाळ मेथी', cat: 'protein', tags: ['P', 'G'], time: 25, spice: 'Mild', nut: 'Protein, iron, fibre',
    ing: [[1, 'cup', 'toor dal'], [2, 'bunch', 'methi, chopped'], [1, '', 'tomato'], [5, '', 'garlic cloves'], [null, '', 'jeera, haldi, salt, lemon, oil']],
    steps: ['Cook dal.', 'Sauté garlic and methi in phodni until wilted.', 'Add tomato, dal, salt and water; simmer 5 minutes.'],
    tip: 'A pinch of gul balances methi\'s bitterness.', kids: 'Serve with plain bhaat and tup.', healthy: 'Great with jowar bhakri.',
    art: ['bowl', '#9E9D24', '#F7C948', '#33691E'], g: ['toor dal', 'methi', 'tomato', 'garlic'] });

  add('masooramti', { n: 'Masoor Amti', m: 'मसूर आमटी', cat: 'protein', tags: ['P'], time: 25, spice: 'Medium', nut: 'Protein, iron',
    ing: [[1, 'cup', 'masoor dal'], [1, '', 'onion'], [1, '', 'tomato'], [1, 'tsp', 'goda masala'], [null, '', 'garlic, kokum, salt, oil, kothimbir']],
    steps: ['Cook masoor dal (2 whistles).', 'Phodni with garlic, onion and tomato.', 'Add dal, goda masala, kokum, salt and water; boil 5 minutes.'],
    tip: 'Masoor cooks fast — no soaking needed.', kids: 'Mild version with tup.', healthy: 'Good iron source for the family.',
    art: ['bowl', '#E07B39', '#F5B041', '#4CAF50'], g: ['masoor dal', 'onion', 'tomato', 'kokum'] });

  add('matkiusal', { n: 'Matki Usal', m: 'मटकीची उसळ', cat: 'protein', tags: ['P'], time: 25, spice: 'Medium', pre: 'Sprout 2 cups matki (soak 8 hours, then tie in a cloth for a day)', nut: 'Sprout protein, fibre',
    ing: [[2, 'cup', 'sprouted matki'], [1, '', 'onion'], [1, '', 'tomato'], [1, 'tsp', 'goda masala'], [2, 'tbsp', 'grated coconut'], [2, 'tsp', 'oil'], [null, '', 'chilli, gul, salt, lemon, kothimbir']],
    steps: ['Phodni with onion; add tomato and masala.', 'Add sprouts, coconut, salt, a pinch of gul and 1½ cups water.', 'Cook covered 12–15 minutes (or 1 whistle). Finish with lemon.'],
    tip: 'Don\'t overcook sprouts — they should hold their shape.', kids: 'Less chilli, more coconut.', healthy: 'Pair with bhakri for a complete protein.',
    art: ['bowl', '#A1662F', '#C5E1A5', '#4CAF50'], g: ['matki', 'onion', 'tomato', 'coconut', 'lemon'] });

  add('chawliusal', { n: 'Chawli Usal', m: 'चवळीची उसळ', cat: 'protein', tags: ['P'], time: 30, spice: 'Medium', pre: 'Soak 1 cup chawli (6 hours)', nut: 'Protein, folate',
    ing: [[1, 'cup', 'chawli, soaked'], [1, '', 'onion'], [1, '', 'tomato'], [1, 'tsp', 'kanda-lasun masala'], [null, '', 'garlic, salt, oil, kothimbir']],
    steps: ['Pressure-cook chawli (3 whistles).', 'Phodni with garlic, onion and tomato; add masala.', 'Add chawli and water; simmer 10 minutes.'],
    tip: 'Mash a few beans to thicken the gravy.', kids: 'Mild version with lemon.', healthy: 'High-fibre lunch protein.',
    art: ['bowl', '#B5651D', '#F4D03F', '#4CAF50'], g: ['chawli', 'onion', 'tomato', 'garlic'] });

  add('kalavatana', { n: 'Kala Vatana Usal', m: 'काळ्या वाटाण्याची उसळ', cat: 'protein', tags: ['P'], time: 40, spice: 'Medium', pre: 'Soak 1 cup kala vatana overnight', nut: 'Protein, iron — Malvani style',
    ing: [[1, 'cup', 'kala vatana (black peas), soaked'], [0.5, 'cup', 'dry khobra'], [1, '', 'onion'], [5, '', 'garlic cloves'], [1, 'tsp', 'Malvani or goda masala'], [null, '', 'salt, oil, kokum']],
    steps: ['Pressure-cook peas 5–6 whistles.', 'Roast khobra and onion; grind with garlic.', 'Cook paste in oil with masala; add peas and water; simmer 10 minutes.'],
    tip: 'Dark-roasted khobra is the Malvani signature.', kids: 'Less masala, extra coconut.', healthy: 'Great with ghavan or amboli.',
    art: ['bowl', '#6E2C00', '#D4AC0D', '#4CAF50'], g: ['kala vatana', 'dry khobra', 'onion', 'garlic'] });

  add('vatanausal', { n: 'Hirvya Vatanyachi Usal', m: 'हिरव्या वाटाण्याची उसळ', cat: 'protein', tags: ['P', 'G'], time: 25, spice: 'Mild', nut: 'Winter fresh-pea protein, vitamin C',
    ing: [[2, 'cup', 'fresh green peas'], [1, '', 'onion'], [1, '', 'tomato'], [0.25, 'cup', 'fresh coconut'], [1, 'tsp', 'goda masala'], [null, '', 'salt, oil, kothimbir']],
    steps: ['Phodni with onion and tomato.', 'Add peas, masala, coconut and a little water.', 'Cover-cook 10 minutes.'],
    tip: 'Fresh winter peas need very little cooking — keep them sweet.', kids: 'Kids love it with poli.', healthy: 'Seasonal and inexpensive in December.',
    art: ['bowl', '#66BB6A', '#F1F8E9', '#2E7D32'], g: ['peas', 'onion', 'tomato', 'coconut'] });

  add('turdana', { n: 'Tur Dana Usal', m: 'तुरीच्या दाण्याची उसळ', cat: 'protein', tags: ['P', 'G'], time: 25, spice: 'Medium', nut: 'Fresh pigeon-pea protein (winter only)',
    ing: [[2, 'cup', 'fresh tur dana (lilva)'], [1, '', 'onion'], [0.25, 'cup', 'fresh coconut'], [1, 'tsp', 'goda masala'], [null, '', 'green chilli, salt, oil, lemon']],
    steps: ['Phodni with onion and chilli.', 'Add tur dana, coconut, masala and a little water.', 'Cook 10–12 minutes covered; lemon at the end.'],
    tip: 'Let the kids shell the pods — they eat what they help make.', kids: 'Mild, with tup.', healthy: 'Only in winter — enjoy while it lasts.',
    art: ['bowl', '#7CB342', '#DCEDC8', '#33691E'], g: ['tur dana', 'onion', 'coconut', 'lemon'] });

  add('pithla', { n: 'Pithla', m: 'पिठलं', cat: 'protein', tags: ['P', 'G'], time: 15, spice: 'Medium', nut: 'Quick protein; besan + greens',
    ing: [[0.5, 'cup', 'besan'], [2, 'cup', 'water'], [6, '', 'garlic cloves, crushed'], [2, '', 'green chillies'], [1, '', 'onion'], [1, 'cup', 'palak or methi'], [2, 'tsp', 'oil'], [null, '', 'salt, haldi, kothimbir']],
    steps: ['Whisk besan into water with no lumps.', 'Phodni with garlic, chilli and onion; add greens.', 'Add the besan water, salt and haldi; stir continuously 6–8 minutes till thick but pourable.'],
    tip: 'Keep stirring — pithla catches at the bottom quickly.', kids: 'Use 1 chilli only.', healthy: 'Pithla-bhakri-kanda is the classic farmer\'s dinner.',
    art: ['bowl', '#F4C542', '#8BC34A', '#E67E22'], g: ['besan', 'garlic', 'onion', 'palak'] });

  add('kulith', { n: 'Kulith Pithla', m: 'कुळथाचं पिठलं', cat: 'protein', tags: ['P'], time: 20, spice: 'Medium', nut: 'Very high protein and iron; warming in winter',
    ing: [[0.5, 'cup', 'kulith (horse gram) flour'], [2.5, 'cup', 'water'], [6, '', 'garlic cloves'], [1, '', 'onion'], [2, '', 'kokum'], [null, '', 'chilli, salt, oil']],
    steps: ['Whisk kulith flour into water.', 'Phodni with garlic and onion; add the mixture and kokum.', 'Stir 8–10 minutes till thick.'],
    tip: 'Kokum balances kulith\'s earthy taste.', kids: 'Mild, with bhaat and tup.', healthy: 'One of the most nutritious Konkan dishes.',
    art: ['bowl', '#8D6E63', '#BCAAA4', '#4CAF50'], g: ['kulith flour', 'garlic', 'onion', 'kokum'] });

  add('rajma', { n: 'Rajma', m: 'राजमा', cat: 'protein', tags: ['P'], time: 45, spice: 'Mild', pre: 'Soak 1 cup rajma overnight', nut: 'Protein, fibre, iron',
    ing: [[1, 'cup', 'rajma, soaked'], [2, '', 'onions'], [3, '', 'tomatoes'], [1, 'tbsp', 'ginger-garlic paste'], [null, '', 'garam masala, chilli, salt, oil']],
    steps: ['Pressure-cook rajma till completely soft (6–8 whistles).', 'Cook onion, ginger-garlic and tomato masala.', 'Add rajma and water; simmer 15 minutes, mashing a few beans.'],
    tip: 'Rajma must be fully soft — undercooked rajma is hard to digest.', kids: 'Serve with jeera rice.', healthy: 'Add a koshimbir on the side.',
    art: ['bowl', '#8E2B1E', '#C0392B', '#FFF3E0'], g: ['rajma', 'onion', 'tomato', 'ginger', 'garlic'] });

  add('chhole', { n: 'Chhole', m: 'छोले', cat: 'protein', tags: ['P'], time: 45, spice: 'Medium', pre: 'Soak 1 cup kabuli chana overnight', nut: 'Protein, fibre',
    ing: [[1, 'cup', 'kabuli chana, soaked'], [2, '', 'onions'], [3, '', 'tomatoes'], [2, 'tsp', 'chhole masala'], [null, '', 'ginger, garlic, salt, oil, lemon']],
    steps: ['Pressure-cook chana 5–6 whistles.', 'Cook onion-tomato-ginger-garlic masala with chhole masala.', 'Add chana and water; simmer 15 minutes.'],
    tip: 'A tea bag in the cooker gives chhole their dark colour.', kids: 'Serve with jeera rice and onion rings.', healthy: 'Skip bhature; serve with poli or rice.',
    art: ['bowl', '#A0522D', '#F5CBA7', '#4CAF50'], g: ['kabuli chana', 'onion', 'tomato', 'lemon'] });

  add('daldhokli', { n: 'Varan Phal', m: 'वरण फळं', cat: 'protein', tags: ['P', 'G'], time: 35, spice: 'Mild', nut: 'One-pot dal + wheat; light dinner',
    ing: [[0.75, 'cup', 'toor dal, cooked'], [1, 'cup', 'wheat atta'], [1, 'cup', 'palak, chopped'], [2, '', 'kokum'], [1, 'tbsp', 'gul'], [1, 'tsp', 'goda masala'], [null, '', 'haldi, chilli, salt, tup']],
    steps: ['Knead atta with haldi, chilli and salt; roll thin and cut into diamonds.', 'Make thin amti with dal, kokum, gul, masala and palak.', 'Drop the pieces into boiling amti; cook 10 minutes.', 'Serve hot with tup.'],
    tip: 'Keep the amti boiling while adding the phal so they don\'t stick.', kids: 'Cut fun shapes.', healthy: 'A complete meal in one bowl.',
    art: ['bowl', '#F0B429', '#D7B377', '#43A047'], g: ['toor dal', 'atta', 'palak', 'kokum'] });

  add('khichdi', { n: 'Moong Dal Khichdi', m: 'मूग डाळ खिचडी', cat: 'protein', tags: ['P'], time: 30, spice: 'Mild', nut: 'Light, complete protein (rice + dal)',
    ing: [[0.75, 'cup', 'rice'], [0.5, 'cup', 'moong dal'], [1, 'cup', 'carrot, peas, dudhi'], [4.5, 'cup', 'water'], [null, '', 'jeera, haldi, salt, tup']],
    steps: ['Wash rice and dal together.', 'Phodni with jeera; add vegetables, rice, dal, haldi, salt and water.', 'Pressure-cook 3 whistles. Top with tup.'],
    tip: 'Add a handful of methi or palak for greens.', kids: 'Comfort food with tup and papad on weekends.', healthy: 'Perfect light dinner.',
    art: ['heap', '#F3D36B', '#FFFFFF', '#66BB6A'], g: ['rice', 'moong dal', 'carrot', 'peas', 'dudhi'] });

  add('kadhi', { n: 'Maharashtrian Kadhi', m: 'कढी', cat: 'side', tags: ['D'], time: 15, spice: 'Mild', nut: 'Probiotic, calcium',
    ing: [[1, 'cup', 'dahi'], [2, 'cup', 'water'], [2, 'tbsp', 'besan'], [1, 'tsp', 'ginger-chilli paste'], [1, 'tsp', 'sugar'], [null, '', 'jeera, kadipatta, methi seeds, salt, tup']],
    steps: ['Whisk dahi, water, besan, ginger-chilli, sugar and salt.', 'Phodni in tup with jeera, methi seeds and kadipatta.', 'Add the mixture and simmer 8 minutes, stirring; don\'t let it boil hard.'],
    tip: 'Stir until it starts simmering, or the kadhi splits.', kids: 'Mild and sweet — they love it with khichdi.', healthy: 'Use homemade dahi.',
    art: ['glass', '#FFF3C4', '#FFFFFF', '#558B2F'], g: ['dahi', 'besan', 'ginger'] });

  add('paneermatar', { n: 'Paneer Matar', m: 'पनीर मटार', cat: 'protein', tags: ['P', 'D'], time: 30, spice: 'Mild', nut: 'Protein, calcium',
    ing: [[250, 'g', 'paneer, cubed'], [1, 'cup', 'green peas'], [2, '', 'onions'], [2, '', 'tomatoes'], [10, '', 'cashews'], [null, '', 'ginger-garlic, garam masala, salt, oil']],
    steps: ['Blend onion, tomato and cashews after sautéing.', 'Cook the paste with spices till oil separates.', 'Add peas and water; simmer 5 minutes; add paneer for 2 minutes.'],
    tip: 'Soak paneer cubes in hot water — they stay soft.', kids: 'Mild with a spoon of butter.', healthy: 'Cashew paste instead of cream.',
    art: ['bowl', '#E67E22', '#FFFFFF', '#66BB6A'], g: ['paneer', 'peas', 'onion', 'tomato', 'cashew'] });

  add('paneerbhurji', { n: 'Paneer Bhurji', m: 'पनीर भुर्जी', cat: 'protein', tags: ['P', 'D'], time: 15, spice: 'Mild', nut: 'Protein, calcium',
    ing: [[250, 'g', 'paneer, crumbled'], [1, '', 'onion'], [1, '', 'tomato'], [1, '', 'capsicum'], [null, '', 'haldi, chilli, salt, kothimbir, oil']],
    steps: ['Sauté onion, capsicum and tomato.', 'Add spices and crumbled paneer; cook 3 minutes.'],
    tip: 'Add paneer last and cook briefly to keep it soft.', kids: 'Fill in poli rolls.', healthy: 'Lots of capsicum and tomato.',
    art: ['heap', '#FFF8E1', '#E53935', '#43A047'], g: ['paneer', 'onion', 'tomato', 'capsicum'] });

  /* ---------------- BHAJI ---------------- */
  add('methipatal', { n: 'Methichi Patal Bhaji', m: 'मेथीची पातळ भाजी', cat: 'bhaji', tags: ['G', 'P'], time: 20, spice: 'Mild', nut: 'Iron, protein from besan and peanuts',
    ing: [[2, 'bunch', 'methi, chopped'], [2, 'tbsp', 'besan'], [1, 'cup', 'taak'], [2, 'tbsp', 'peanuts, soaked'], [null, '', 'garlic, chilli, gul, salt, oil']],
    steps: ['Phodni with garlic and chilli; add methi and sauté.', 'Whisk besan into taak and 1 cup water; add with peanuts, salt and gul.', 'Simmer 7 minutes.'],
    tip: 'The pinch of gul balances methi\'s bitterness — don\'t skip it.', kids: 'Serve over bhaat with tup.', healthy: 'Iron + protein in one bowl.',
    art: ['bowl', '#7CB342', '#F0E68C', '#33691E'], g: ['methi', 'besan', 'dahi', 'peanuts', 'garlic'] });

  add('palakpatal', { n: 'Palakchi Patal Bhaji', m: 'पालकाची पातळ भाजी', cat: 'bhaji', tags: ['G', 'P'], time: 20, spice: 'Mild', pre: 'Soak 2 tbsp chana dal (1 hour)', nut: 'Iron, folate, calcium',
    ing: [[2, 'bunch', 'palak, chopped'], [2, 'tbsp', 'chana dal, soaked'], [2, 'tbsp', 'peanuts'], [2, 'tbsp', 'besan'], [1, 'cup', 'taak'], [null, '', 'garlic, salt, lemon, oil']],
    steps: ['Cook palak with chana dal and peanuts.', 'Add besan whisked in taak; simmer 7 minutes.', 'Add lemon at the end.'],
    tip: 'Add a squeeze of lemon at the end to brighten the colour and help iron absorption.', kids: 'Blend half for a smoother bhaji.', healthy: 'Excellent iron source.',
    art: ['bowl', '#558B2F', '#C5E1A5', '#F4D03F'], g: ['palak', 'chana dal', 'peanuts', 'besan', 'dahi', 'lemon'] });

  add('sukhibhaji', { n: 'Shepu / Methi Sukhi Bhaji', m: 'शेपूची भाजी', cat: 'bhaji', tags: ['G', 'P'], time: 15, spice: 'Mild', pre: 'Soak ¼ cup moong dal (30 minutes)', nut: 'Iron, fibre',
    ing: [[2, 'bunch', 'shepu (dill) or methi'], [0.25, 'cup', 'moong dal, soaked'], [6, '', 'garlic cloves'], [1, '', 'onion'], [null, '', 'chilli, salt, fresh coconut, oil']],
    steps: ['Phodni with garlic and onion.', 'Add greens and moong dal; cover 5 minutes.', 'Add salt and coconut.'],
    tip: 'Salt at the end — greens release water and cook in it.', kids: 'Mix into dal-rice.', healthy: 'Quick greens for busy days.',
    art: ['heap', '#689F38', '#F1F8E9', '#F9A825'], g: ['shepu', 'moong dal', 'garlic', 'onion', 'coconut'] });

  add('mulabhaji', { n: 'Mula Bhaji', m: 'मुळ्याची भाजी', cat: 'bhaji', tags: ['G'], time: 20, spice: 'Mild', nut: 'Vitamin C, fibre — leaves are the best part',
    ing: [[2, '', 'radishes with leaves'], [2, 'tbsp', 'moong dal, soaked'], [null, '', 'garlic, chilli, salt, oil']],
    steps: ['Chop radish and its leaves.', 'Phodni with garlic; add radish, leaves and dal.', 'Cover-cook 10 minutes.'],
    tip: 'Use the leaves — they hold most of the nutrition.', kids: 'Mild with a little coconut.', healthy: 'A winter-only treat.',
    art: ['heap', '#AED581', '#FFFFFF', '#33691E'], g: ['mula', 'moong dal', 'garlic'] });

  add('bharlivangi', { n: 'Bharli Vangi', m: 'भरली वांगी', cat: 'bhaji', tags: ['P'], time: 50, spice: 'Medium', nut: 'Healthy fats from peanuts, til and coconut',
    ing: [[10, '', 'small purple brinjals'], [0.5, 'cup', 'roasted peanuts'], [0.25, 'cup', 'dry khobra, roasted'], [2, 'tbsp', 'til, roasted'], [1, '', 'onion, roasted'], [1, 'tbsp', 'goda masala'], [1, 'tbsp', 'gul'], [1, 'tsp', 'tamarind pulp'], [3, 'tsp', 'oil'], [null, '', 'chilli, salt, kothimbir']],
    steps: ['Slit brinjals in a plus shape, keeping the stem.', 'Grind peanuts, khobra, til, onion, masala, gul, tamarind and salt coarsely.', 'Stuff the brinjals.', 'Sauté in phodni, add leftover masala and 1½ cups water.', 'Cover and cook on low 15–20 minutes, turning once.'],
    tip: 'Roast peanuts, khobra and til separately — each to its own perfect colour.', kids: 'Mash brinjal into the gravy for them.', healthy: 'Use measured oil; the nuts bring enough fat.',
    art: ['bowl', '#6A1B9A', '#A0522D', '#43A047'], g: ['brinjal', 'peanuts', 'dry khobra', 'til', 'onion'] });

  add('bharit', { n: 'Vangyache Bharit', m: 'वांग्याचे भरीत', cat: 'bhaji', tags: ['R'], time: 30, spice: 'Medium', nut: 'Smoky winter brinjal; fibre',
    ing: [[1, 'kg', 'large bharit brinjal (2)'], [1, '', 'onion'], [3, '', 'spring onions'], [2, '', 'green chillies'], [6, '', 'garlic cloves'], [null, '', 'peanuts, kothimbir, salt, oil']],
    steps: ['Roast brinjals directly on the flame till fully charred and soft.', 'Peel and mash.', 'Phodni with garlic, chilli and spring onion; add brinjal and salt.', 'Mix in raw onion and kothimbir at the end.'],
    tip: 'Smoky flame-roasting is the whole flavour — don\'t shortcut it.', kids: 'Mild version with dahi mixed in.', healthy: 'Serve with bajra bhakri — a Khandeshi winter classic.',
    art: ['heap', '#5D4037', '#8BC34A', '#A1887F'], g: ['brinjal', 'spring onion', 'onion', 'garlic'] });

  add('batatabhaji', { n: 'Batata Bhaji', m: 'बटाट्याची भाजी', cat: 'bhaji', tags: [], time: 15, spice: 'Mild', nut: 'Energy; kids\' favourite',
    ing: [[4, '', 'potatoes, boiled & cubed'], [0.5, 'cup', 'peas or carrot'], [2, '', 'green chillies'], [2, 'tsp', 'oil'], [null, '', 'mustard, haldi, salt, lemon, kothimbir']],
    steps: ['Phodni with mustard, chilli and haldi.', 'Add potatoes and peas; toss with salt.', 'Finish with lemon and kothimbir.'],
    tip: 'Use waxy, firm-boiled potatoes so cubes stay intact.', kids: 'Roll in poli for tiffin.', healthy: 'Add peas and carrot for colour and fibre.',
    art: ['heap', '#F9D648', '#43A047', '#FF8F00'], g: ['potato', 'peas', 'lemon'] });

  add('bhendi', { n: 'Bhendi Bhaji', m: 'भेंडीची भाजी', cat: 'bhaji', tags: [], time: 20, spice: 'Mild', nut: 'Fibre, folate',
    ing: [[500, 'g', 'bhendi'], [1, '', 'onion'], [1, 'tsp', 'goda masala'], [1, 'tbsp', 'peanut powder'], [null, '', 'salt, oil']],
    steps: ['Wash and dry bhendi fully before chopping.', 'Sauté onion; add bhendi without a lid on medium heat for 10 minutes.', 'Add masala, peanut powder and salt at the end.'],
    tip: 'Dry bhendi + no lid + salt at the end = never slimy.', kids: 'Crisp it a little longer.', healthy: 'Peanut powder adds protein.',
    art: ['heap', '#558B2F', '#8BC34A', '#D4A017'], g: ['bhendi', 'onion', 'peanuts'] });

  add('kobi', { n: 'Kobi Bhaji', m: 'कोबीची भाजी', cat: 'bhaji', tags: [], time: 15, spice: 'Mild', pre: 'Soak 2 tbsp chana dal (1 hour)', nut: 'Vitamin C, fibre',
    ing: [[1, '', 'small cabbage'], [2, 'tbsp', 'chana dal, soaked'], [0.5, 'cup', 'green peas'], [null, '', 'mustard, chilli, salt, fresh coconut, oil']],
    steps: ['Phodni with chana dal till golden.', 'Add finely chopped cabbage and peas.', 'Cook 10 minutes; finish with coconut.'],
    tip: 'Chop fine and don\'t overcook — cabbage should stay slightly crunchy.', kids: 'Add sweet corn.', healthy: 'Low-calorie, high-fibre bhaji.',
    art: ['heap', '#C5E1A5', '#7CB342', '#FBC02D'], g: ['cabbage', 'chana dal', 'peas', 'coconut'] });

  add('flower', { n: 'Flower-Batata-Matar Rassa', m: 'फ्लॉवर बटाटा रस्सा', cat: 'bhaji', tags: [], time: 30, spice: 'Medium', nut: 'Vitamin C, fibre',
    ing: [[1, '', 'small cauliflower'], [2, '', 'potatoes'], [1, 'cup', 'green peas'], [2, '', 'onions'], [2, '', 'tomatoes'], [1, 'tsp', 'goda masala'], [null, '', 'salt, oil']],
    steps: ['Cook onion-tomato masala with goda masala.', 'Add vegetables and water.', 'Simmer 15 minutes till tender.'],
    tip: 'Soak cauliflower florets in warm salt water 10 minutes to clean them.', kids: 'Mild with poli.', healthy: 'Lots of vegetables, little oil.',
    art: ['bowl', '#E8A33D', '#FFFFFF', '#66BB6A'], g: ['cauliflower', 'potato', 'peas', 'onion', 'tomato'] });

  add('dudhi', { n: 'Dudhi Chana Dal', m: 'दुधी भोपळा भाजी', cat: 'bhaji', tags: ['P'], time: 25, spice: 'Mild', pre: 'Soak ¼ cup chana dal (1 hour)', nut: 'Light, hydrating, protein from dal',
    ing: [[500, 'g', 'dudhi, cubed'], [0.25, 'cup', 'chana dal, soaked'], [1, '', 'tomato'], [1, 'tsp', 'goda masala'], [null, '', 'salt, oil']],
    steps: ['Phodni with chana dal.', 'Add dudhi, tomato and masala.', 'Cover-cook till soft.'],
    tip: 'Taste a piece of raw dudhi — throw it away if it\'s bitter.', kids: 'Mild with bhaat.', healthy: 'Very light — ideal for dinner.',
    art: ['bowl', '#C5E1A5', '#F4D03F', '#558B2F'], g: ['dudhi', 'chana dal', 'tomato'] });

  add('gavar', { n: 'Gavar Bhaji', m: 'गवारीची भाजी', cat: 'bhaji', tags: [], time: 20, spice: 'Medium', nut: 'Fibre, iron',
    ing: [[250, 'g', 'gavar (cluster beans)'], [5, '', 'garlic cloves'], [1, 'tsp', 'goda masala'], [2, 'tbsp', 'peanut powder'], [null, '', 'salt, oil']],
    steps: ['Chop gavar.', 'Phodni with garlic; add gavar and a splash of water.', 'Cover-cook 10 minutes; add masala and peanut powder.'],
    tip: 'Pick tender, thin gavar — thick ones are fibrous.', kids: 'Mix with batata for kids.', healthy: 'Good for blood-sugar balance.',
    art: ['heap', '#689F38', '#AED581', '#8D6E63'], g: ['gavar', 'garlic', 'peanuts'] });

  add('dodka', { n: 'Dodka Bhaji', m: 'दोडक्याची भाजी', cat: 'bhaji', tags: [], time: 15, spice: 'Mild', nut: 'Light, hydrating',
    ing: [[500, 'g', 'dodka (ridge gourd), peeled'], [2, 'tbsp', 'peanut powder'], [null, '', 'green chilli, salt, coconut, oil']],
    steps: ['Phodni with chilli.', 'Add dodka cubes; cook covered 8 minutes.', 'Add peanut powder, salt and coconut.'],
    tip: 'Dodka releases water — no water needed.', kids: 'Serve with varan-bhaat.', healthy: 'Very low calorie.',
    art: ['heap', '#AED581', '#F1F8E9', '#A1887F'], g: ['dodka', 'peanuts', 'coconut'] });

  /* ------------- BHAKRI, POLI, BHAAT ------------- */
  add('jowarbhakri', { n: 'Jowar Bhakri', m: 'ज्वारीची भाकरी', cat: 'grain', tags: ['M'], time: 25, spice: 'None', nut: 'Millet fibre, gluten-free',
    ing: [[2, 'cup', 'jowar flour'], [null, '', 'warm water, pinch of salt']],
    steps: ['Knead a small batch of flour with warm water, using the heel of your palm till smooth.', 'Pat into a 7-inch round on a floured board.', 'Place on a hot tawa; wipe the top with a wet hand.', 'Flip after a minute, then finish on the open flame till it puffs.'],
    tip: 'Knead each bhakri\'s dough fresh — jowar dough dries out fast.', kids: 'Serve with tup and a little gul.', healthy: 'Swap one poli meal a day for bhakri.',
    art: ['flat', '#E9DCC0', '#C8A97E', '#8D6E63'], g: ['jowar flour'] });

  add('bajrabhakri', { n: 'Bajra Bhakri', m: 'बाजरीची भाकरी', cat: 'grain', tags: ['M'], time: 25, spice: 'None', nut: 'Iron, warming winter millet',
    ing: [[2, 'cup', 'bajra flour'], [1, 'tbsp', 'til'], [null, '', 'warm water, salt']],
    steps: ['Knead with warm water.', 'Pat out, sprinkle til, cook on tawa and flame.', 'Serve with loni, gul or thecha.'],
    tip: 'Warm water is essential for bajra dough.', kids: 'Loni and gul with bajra bhakri is a winter treat.', healthy: 'Best in winter; switch to jowar in summer.',
    art: ['flat', '#9E8C6C', '#C7B48F', '#4E342E'], g: ['bajra flour', 'til'] });

  add('nachnibhakri', { n: 'Nachni Bhakri', m: 'नाचणीची भाकरी', cat: 'grain', tags: ['M'], time: 25, spice: 'None', nut: 'Calcium powerhouse',
    ing: [[1.5, 'cup', 'nachni flour'], [0.5, 'cup', 'wheat atta'], [null, '', 'warm water, salt']],
    steps: ['Mix nachni with a little atta for easier rolling.', 'Knead with warm water, pat or roll, and cook like bhakri.'],
    tip: 'The wheat atta binds the dough — beginners can use 1 : 1.', kids: 'Spread butter and roll.', healthy: 'Highest calcium among grains.',
    art: ['flat', '#7B5044', '#A1887F', '#3E2723'], g: ['nachni flour', 'atta'] });

  add('poli', { n: 'Ghadichi Poli', m: 'घडीची पोळी', cat: 'grain', tags: [], time: 30, spice: 'None', nut: 'Whole-wheat energy and fibre',
    ing: [[2.5, 'cup', 'wheat atta'], [1, 'tsp', 'oil'], [null, '', 'salt, water']],
    steps: ['Knead a soft dough; rest 20 minutes.', 'Roll, smear oil, fold into a triangle and roll again.', 'Cook on a hot tawa till brown spots appear.'],
    tip: 'Resting the dough is the secret to soft poli.', kids: 'Add palak or beet puree to the dough for coloured poli.', healthy: 'Allow 2–3 per adult and 1–2 per child at a meal.',
    art: ['flat', '#E8CFA0', '#D7B07A', '#A1887F'], g: ['atta'] });

  add('bhaat', { n: 'Bhaat', m: 'भात', cat: 'grain', tags: [], time: 20, spice: 'None', nut: 'Easy energy',
    ing: [[1.5, 'cup', 'rice (ambemohar / indrayani / hand-pounded)'], [3, 'cup', 'water']],
    steps: ['Wash rice and soak 15 minutes.', 'Cook with water till done (or 2 whistles).'],
    tip: 'Mix in a little hand-pounded rice for extra fibre.', kids: 'Varan-bhaat-tup.', healthy: 'About half a katori per adult when there\'s bhakri on the plate.',
    art: ['heap', '#FAFAF5', '#FFFFFF', '#E0E0D0'], g: ['rice'] });

  add('masalebhaat', { n: 'Masale Bhaat', m: 'मसाले भात', cat: 'grain', tags: [], time: 40, spice: 'Medium', nut: 'Vegetables + rice',
    ing: [[1.5, 'cup', 'rice, soaked'], [1, 'cup', 'tondli, peas or brinjal'], [1, '', 'onion'], [2, 'tsp', 'goda masala'], [3, 'cup', 'hot water'], [1, 'tbsp', 'tup'], [null, '', 'tej patta, cloves, cinnamon, cashews, coconut, kothimbir']],
    steps: ['Phodni with whole spices; fry vegetables and onion.', 'Add rice and goda masala; toast 2 minutes.', 'Add hot water and salt; cook covered on low 15 minutes.', 'Finish with tup, coconut and kothimbir.'],
    tip: 'Goda masala is what makes it Maharashtrian — don\'t use biryani masala.', kids: 'Fewer chillies, extra cashews.', healthy: 'Pair with kadhi and koshimbir.',
    art: ['heap', '#E6A23C', '#FFFFFF', '#2E7D32'], g: ['rice', 'tondli', 'peas', 'onion', 'cashew', 'coconut'] });

  /* ---------------- SIDES ---------------- */
  add('koshimbir', { n: 'Koshimbir', m: 'कोशिंबीर', cat: 'side', tags: ['R'], time: 10, spice: 'Mild', nut: 'Raw vegetables, vitamin C',
    ing: [[2, '', 'cucumbers, carrots or beetroot'], [2, 'tbsp', 'peanut powder'], [null, '', 'green chilli, salt, sugar pinch, lemon, jeera phodni']],
    steps: ['Chop cucumber (or grate carrot or beetroot).', 'Mix with peanut powder, salt and lemon just before serving.', 'Add a jeera-mustard phodni on top.'],
    tip: 'Add salt just before serving so it doesn\'t go watery.', kids: 'Raisins in carrot koshimbir.', healthy: 'One raw item at every lunch.',
    art: ['bowl', '#A5D6A7', '#FF7043', '#C2185B'], g: ['cucumber', 'carrot', 'beetroot', 'peanuts', 'lemon'] });

  add('dahi', { n: 'Ghar-che Dahi', m: 'घरचं दही', cat: 'side', tags: ['D', 'P'], time: 5, spice: 'None', pre: 'Set dahi tonight (6–8 hours)', nut: 'Protein, calcium, probiotic',
    ing: [[1, 'litre', 'full-cream milk'], [1, 'tbsp', 'dahi from the last batch (culture)']],
    steps: ['Boil the milk and let it cool till just warm to your finger (about 40 °C).', 'Stir in the culture, cover and keep in a warm spot for 6–8 hours.', 'Refrigerate once set. Keep 1 tbsp aside as the next culture.'],
    tip: 'In winter, keep the pot inside a switched-off oven or wrapped in a towel so it sets thick.', kids: 'Add a little chopped fruit instead of sugar.', healthy: 'One katori with nashta adds protein to light breakfasts like upit or ghavan.',
    art: ['glass', '#FBFBF5', '#FFFFFF', '#E8E8DC'], g: ['milk'] });

  add('taak', { n: 'Taak', m: 'ताक', cat: 'side', tags: ['D'], time: 5, spice: 'None', nut: 'Probiotic, calcium, cooling',
    ing: [[1, 'cup', 'dahi'], [3, 'cup', 'water'], [null, '', 'salt, roasted jeera, ginger, kothimbir']],
    steps: ['Whisk dahi and water.', 'Add salt, jeera powder, ginger and kothimbir.'],
    tip: 'A phodni of jeera and kadipatta makes it special.', kids: 'Sweet lassi on Sunday instead.', healthy: 'Best digestive after lunch.',
    art: ['glass', '#FAFAF0', '#FFFFFF', '#66BB6A'], g: ['dahi', 'ginger', 'kothimbir'] });

  add('solkadhi', { n: 'Solkadhi', m: 'सोलकढी', cat: 'side', tags: [], time: 10, spice: 'Mild', pre: 'Soak 10 kokum (30 minutes)', nut: 'Digestive, cooling — made for seafood',
    ing: [[10, '', 'kokum, soaked'], [1, 'cup', 'thick coconut milk'], [1, '', 'garlic clove, crushed'], [null, '', 'green chilli, salt, kothimbir']],
    steps: ['Squeeze kokum in its soaking water.', 'Mix with coconut milk, garlic, chilli and salt.', 'Chill and serve.'],
    tip: 'Fresh coconut milk tastes far better than tinned.', kids: 'Skip the chilli.', healthy: 'Serve with every fish meal.',
    art: ['glass', '#C2185B', '#F8BBD0', '#4CAF50'], g: ['kokum', 'coconut', 'garlic'] });

  add('soup', { n: 'Tomato-Moong Soup', m: 'टोमॅटो सूप', cat: 'side', tags: ['P'], time: 25, spice: 'Mild', nut: 'Light protein, vitamin C',
    ing: [[5, '', 'tomatoes'], [0.25, 'cup', 'moong dal'], [1, '', 'carrot'], [null, '', 'garlic, pepper, salt, tup']],
    steps: ['Pressure-cook tomatoes, moong dal, carrot and garlic.', 'Blend, strain if you like, simmer with salt and pepper.', 'Finish with a little tup.'],
    tip: 'Moong dal makes it creamy without any cream.', kids: 'Add croutons from leftover poli.', healthy: 'Ideal light dinner starter.',
    art: ['glass', '#E53935', '#FFCDD2', '#43A047'], g: ['tomato', 'moong dal', 'carrot'] });

  add('pavbhaji', { n: 'Home Pav Bhaji', m: 'पावभाजी', cat: 'side', tags: ['fun'], time: 45, spice: 'Medium', nut: 'Loaded with vegetables',
    ing: [[3, '', 'potatoes'], [2, 'cup', 'cauliflower, peas, carrot, capsicum'], [3, '', 'tomatoes'], [2, '', 'onions'], [2, 'tbsp', 'pav bhaji masala'], [2, 'tbsp', 'butter'], [8, '', 'whole-wheat pav'], [null, '', 'lemon, onion, kothimbir']],
    steps: ['Pressure-cook vegetables and mash.', 'Cook onion, tomato and capsicum with masala.', 'Add mashed vegetables and water; mash and simmer 10 minutes.', 'Finish with a little butter; toast pav lightly.'],
    tip: 'Double the cauliflower and carrot — kids never notice.', kids: 'Weekly fun meal.', healthy: 'Whole-wheat pav and 1 tbsp butter for the whole pot.',
    art: ['bowl', '#D84315', '#FFCC80', '#43A047'], g: ['potato', 'cauliflower', 'peas', 'carrot', 'capsicum', 'tomato', 'onion', 'pav', 'butter', 'lemon'] });

  /* ---------------- CHICKEN (kids' favourite) ---------------- */
  add('tandoori', { n: 'Tawa Tandoori Chicken', m: 'तवा तंदुरी चिकन', cat: 'chicken', tags: ['C', 'P', 'D'], time: 45, spice: 'Mild', pre: 'Marinate the chicken (2 hours or overnight)', nut: 'High protein, not fried',
    ing: [[750, 'g', 'chicken legs or breast, slit'], [0.75, 'cup', 'thick dahi'], [1, 'tbsp', 'ginger-garlic paste'], [1, 'tsp', 'kashmiri chilli'], [1, 'tsp', 'garam or goda masala'], [1, 'tsp', 'kasuri methi'], [1, 'tbsp', 'lemon juice'], [1, 'tbsp', 'oil'], [null, '', 'haldi, salt']],
    steps: ['Mix the marinade and coat the chicken well; refrigerate 2 hours or overnight.', 'Cook on a heavy tawa, covered, for 15 minutes on medium, turning.', 'Uncover and cook till charred at the edges (or bake at 220 °C for 25–30 minutes).', 'Serve with kanda-limbu and mint-dahi chutney.'],
    tip: 'Overnight marinating in dahi makes it tender without any frying.', kids: 'Their favourite — leftovers make the next tiffin\'s poli roll.', healthy: 'Grilled, not fried; serve with salad.',
    art: ['chicken', '#C62828', '#FF8A65', '#FFF59D'], g: ['chicken', 'dahi', 'ginger', 'garlic', 'lemon'] });

  add('kolhapuri', { n: 'Kolhapuri Tambda & Pandhra Rassa', m: 'तांबडा-पांढरा रस्सा', cat: 'chicken', tags: ['C', 'P'], time: 60, spice: 'Spicy red / mild white', nut: 'Protein; mild white rassa for kids',
    ing: [[750, 'g', 'chicken'], [2, '', 'onions'], [0.5, 'cup', 'dry khobra'], [1, 'tbsp', 'til'], [8, '', 'garlic cloves'], [2, 'tsp', 'Kolhapuri masala'], [1, 'cup', 'fresh coconut (for pandhra)'], [10, '', 'cashews'], [3, 'tbsp', 'oil'], [null, '', 'dahi, ginger, haldi, salt, whole spices']],
    steps: ['Marinate chicken in dahi, ginger-garlic, haldi and salt.', 'Pandhra: simmer a third of the chicken with whole spices for stock; add coconut-cashew-til paste; simmer 10 minutes.', 'Tambda: roast onion and khobra dark, grind with garlic; cook in oil with Kolhapuri masala till oil separates.', 'Add remaining chicken, sear 5 minutes, add 3 cups hot water; simmer 20 minutes.'],
    tip: 'Make pandhra first from the same chicken — kids get mild, adults get spicy.', kids: 'Pandhra rassa with bhaat.', healthy: 'Serve with bhakri and onion-lemon, not pav.',
    art: ['chicken', '#B71C1C', '#E53935', '#FFF8E1'], g: ['chicken', 'onion', 'dry khobra', 'til', 'garlic', 'coconut', 'cashew', 'dahi'] });

  add('sukka', { n: 'Chicken Sukka', m: 'चिकन सुक्का', cat: 'chicken', tags: ['C', 'P'], time: 40, spice: 'Mild', nut: 'Protein; dry, tiffin-friendly',
    ing: [[600, 'g', 'boneless chicken'], [2, '', 'onions'], [0.5, 'cup', 'fresh coconut, roasted'], [1, 'tbsp', 'ginger-garlic paste'], [1, 'tsp', 'goda masala'], [1, 'tsp', 'tup'], [null, '', 'haldi, chilli, salt, kothimbir']],
    steps: ['Sauté onion; add ginger-garlic and chicken.', 'Cook covered 15 minutes.', 'Add roasted coconut and masala; dry it out on high heat.', 'Finish with tup and kothimbir.'],
    tip: 'Roasted coconut coats the chicken and gives a sweet, nutty finish.', kids: 'Fill in poli rolls.', healthy: 'Lean boneless chicken, little oil.',
    art: ['chicken', '#8D4E2A', '#D7A86E', '#43A047'], g: ['chicken', 'onion', 'coconut', 'ginger', 'garlic'] });

  add('malvanichicken', { n: 'Malvani Chicken Curry', m: 'मालवणी चिकन', cat: 'chicken', tags: ['C', 'P'], time: 55, spice: 'Medium', nut: 'Protein; coconut-based Konkan curry',
    ing: [[750, 'g', 'chicken'], [1, 'cup', 'fresh coconut'], [2, '', 'onions'], [2, 'tsp', 'Malvani masala'], [8, '', 'garlic cloves'], [1, 'inch', 'ginger'], [null, '', 'haldi, salt, oil, kokum']],
    steps: ['Marinate chicken with haldi, ginger-garlic and salt.', 'Roast coconut and onion; grind with masala.', 'Sear chicken, add the paste and water.', 'Simmer 20 minutes; add kokum at the end.'],
    tip: 'Roast the coconut slowly to golden — that\'s the Malvani taste.', kids: 'Take out their portion before adding extra masala.', healthy: 'Serve with nachni bhakri and solkadhi.',
    art: ['chicken', '#BF360C', '#FFAB91', '#2E7D32'], g: ['chicken', 'coconut', 'onion', 'garlic', 'ginger', 'kokum'] });

  /* ---------------- SEAFOOD (adult's favourite) ---------------- */
  add('fishcurry', { n: 'Malvani Fish Curry', m: 'मालवणी माशाची आमटी', cat: 'seafood', tags: ['S', 'P'], time: 45, spice: 'Medium', nut: 'Omega-3, protein, B12',
    ing: [[500, 'g', 'bangda / surmai / pomfret, cleaned'], [1, 'cup', 'fresh coconut'], [4, '', 'kashmiri chillies'], [1, 'tbsp', 'coriander seeds'], [6, '', 'garlic cloves'], [0.5, '', 'onion'], [4, '', 'kokum'], [2, 'tbsp', 'oil'], [null, '', 'haldi, salt, tamarind, lemon']],
    steps: ['Marinate fish with haldi, salt and lemon for 15 minutes.', 'Grind coconut, chillies, coriander seeds, garlic, onion and tamarind.', 'Cook the paste in oil 5 minutes; add 2 cups water, kokum and salt; boil.', 'Slide in the fish and simmer 6–8 minutes. Swirl the pan — don\'t stir.'],
    tip: 'Bangda (mackerel) is affordable and richest in omega-3.', kids: 'Debone carefully; serve with plain bhaat and less gravy.', healthy: 'With bhaat, bhakri and solkadhi.',
    art: ['fish', '#E65100', '#FFB74D', '#B0BEC5'], g: ['fish', 'coconut', 'garlic', 'kokum', 'lemon'] });

  add('fishfry', { n: 'Tawa Rava Fish Fry', m: 'तवा फिश फ्राय', cat: 'seafood', tags: ['S', 'P'], time: 30, spice: 'Medium', nut: 'Omega-3, protein; shallow-fried',
    ing: [[600, 'g', 'surmai or pomfret slices'], [1, 'tbsp', 'ginger-garlic paste'], [1, 'tsp', 'chilli powder'], [0.5, 'cup', 'rava'], [2, 'tbsp', 'rice flour'], [2, 'tbsp', 'oil'], [null, '', 'haldi, salt, lemon']],
    steps: ['Marinate fish with ginger-garlic, chilli, haldi, salt and lemon for 20 minutes.', 'Coat in rava mixed with rice flour.', 'Shallow-fry on a tawa 3 minutes each side using 2 tbsp oil in total.'],
    tip: 'Press the rava on firmly and don\'t move the fish till the crust sets.', kids: 'Less chilli, boneless slices.', healthy: 'Tawa-fried with little oil — not deep-fried.',
    art: ['fish', '#D4A64A', '#F4D03F', '#C62828'], g: ['fish', 'ginger', 'garlic', 'rava', 'lemon'] });

  add('kolambi', { n: 'Kolambi Masala', m: 'कोळंबी मसाला', cat: 'seafood', tags: ['S', 'P'], time: 35, spice: 'Medium', nut: 'Lean protein, iodine, B12',
    ing: [[400, 'g', 'prawns, cleaned'], [1, '', 'onion'], [1, '', 'tomato'], [1, 'tsp', 'ginger-garlic paste'], [1.5, 'tsp', 'Malvani masala'], [0.25, 'cup', 'coconut paste'], [2, '', 'kokum'], [2, 'tsp', 'oil'], [null, '', 'haldi, salt, lemon, kothimbir']],
    steps: ['Marinate prawns with haldi, salt and lemon for 10 minutes.', 'Fry onion golden; add ginger-garlic, tomato and masala.', 'Add coconut paste and kokum.', 'Add prawns last; cook only 4–5 minutes till curled.'],
    tip: 'Overcooked prawns turn rubbery — stop when they curl.', kids: '½ tsp masala and 2 tbsp coconut milk for them.', healthy: 'With bhakri, bhaat and solkadhi.',
    art: ['bowl', '#E64A19', '#FFAB91', '#43A047'], g: ['prawns', 'onion', 'tomato', 'coconut', 'kokum', 'lemon'] });

  add('kolambibhaat', { n: 'Kolambi Bhaat', m: 'कोळंबी भात', cat: 'seafood', tags: ['S', 'P'], time: 45, spice: 'Medium', nut: 'One-pot protein + rice',
    ing: [[300, 'g', 'prawns'], [1.5, 'cup', 'rice, soaked'], [1, '', 'onion'], [1, '', 'tomato'], [2, 'tsp', 'goda or Malvani masala'], [0.25, 'cup', 'coconut milk'], [null, '', 'whole spices, salt, oil, kothimbir']],
    steps: ['Sauté whole spices, onion and tomato.', 'Add masala and prawns for 2 minutes; remove prawns.', 'Add rice, coconut milk, hot water and salt; cook covered.', 'Fold the prawns back in for the last 3 minutes.'],
    tip: 'Taking prawns out midway keeps them juicy.', kids: 'Mild, with raita.', healthy: 'Serve with kakdi koshimbir and solkadhi.',
    art: ['heap', '#F0A04B', '#FF7043', '#2E7D32'], g: ['prawns', 'rice', 'onion', 'tomato', 'coconut'] });

  /* ---------------- UPVAS ---------------- */
  add('sabudana', { n: 'Sabudana Khichdi', m: 'साबुदाणा खिचडी', cat: 'upvas', tags: ['U', 'P'], time: 20, spice: 'Mild', pre: 'Soak 1 cup sabudana for the fasting adults (5–6 hours)', nut: 'Energy; peanuts and dahi for protein',
    ing: [[1, 'cup', 'sabudana (for 2 adults)'], [0.4, 'cup', 'roasted peanut powder'], [1, '', 'potato, boiled & cubed'], [1, '', 'green chilli'], [1, 'tbsp', 'tup'], [null, '', 'jeera, sendha salt, sugar pinch, lemon']],
    steps: ['Rinse sabudana twice; soak with water just covering it.', 'Mix with peanut powder, salt and sugar.', 'Tup + jeera + chilli + potato, then sabudana; stir gently 5–7 minutes till translucent.', 'Finish with lemon. Serve with dahi.'],
    tip: 'Press a pearl — it should squash easily. Too much water makes it sticky.', kids: 'Kids eat normal meals on fast days.', healthy: 'Always pair with dahi for protein.',
    art: ['heap', '#F5F0DC', '#FFFFFF', '#C8A165'], g: ['sabudana', 'peanuts', 'potato', 'dahi'] });

  add('bhagar', { n: 'Bhagar & Danyachi Amti', m: 'भगर आणि दाण्याची आमटी', cat: 'upvas', tags: ['U', 'P'], time: 25, spice: 'Mild', nut: 'Millet energy + peanut protein',
    ing: [[0.75, 'cup', 'varai (bhagar), for 2 adults'], [0.5, 'cup', 'roasted peanuts, ground'], [2, '', 'kokum'], [1, 'tbsp', 'tup'], [null, '', 'jeera, green chilli, sendha salt, gul']],
    steps: ['Bhagar: tup + jeera + chilli, add washed varai and 2 cups hot water; cook covered 15 minutes.', 'Amti: boil ground peanuts with 2 cups water, kokum, salt and a little gul.', 'Finish the amti with a jeera-tup phodni.'],
    tip: 'Bhagar is a millet — the healthiest upvas grain.', kids: 'Kids eat their normal plate.', healthy: 'The classic Ekadashi lunch — balanced and filling.',
    art: ['heap', '#EADFC4', '#C68E3A', '#7CB342'], g: ['varai', 'peanuts', 'kokum'] });

  add('rajgira', { n: 'Rajgira Thalipeeth', m: 'राजगिरा थालीपीठ', cat: 'upvas', tags: ['U', 'P', 'D'], time: 25, spice: 'Mild', nut: 'Calcium, protein (amaranth)',
    ing: [[1, 'cup', 'rajgira flour (for 2 adults)'], [2, '', 'potatoes, boiled & mashed'], [2, 'tbsp', 'peanut powder'], [null, '', 'jeera, green chilli, sendha salt, tup'], [1, 'cup', 'dahi to serve']],
    steps: ['Mix flour, potato, peanut powder, jeera, chilli and salt into a dough.', 'Pat thalipeeth on a wet sheet.', 'Cook on the tawa with a little tup. Serve with dahi.'],
    tip: 'Potato binds rajgira — no water needed.', kids: 'Kids sometimes ask for it too — it\'s healthy for them.', healthy: 'Tawa-cooked, not fried.',
    art: ['flat', '#D9C39A', '#F1E3C2', '#795548'], g: ['rajgira flour', 'potato', 'peanuts', 'dahi'] });

  add('ratale', { n: 'Ratalyacha Kees', m: 'रताळ्याचा कीस', cat: 'upvas', tags: ['U'], time: 15, spice: 'Mild', nut: 'Fibre, vitamin A',
    ing: [[2, '', 'sweet potatoes, grated (for 2 adults)'], [2, 'tbsp', 'peanut powder'], [1, 'tsp', 'tup'], [null, '', 'jeera, chilli, sendha salt, lemon']],
    steps: ['Tup + jeera + chilli; add grated sweet potato.', 'Cover 5 minutes; add peanut powder, salt and lemon.'],
    tip: 'Grate just before cooking so it doesn\'t darken.', kids: 'Sweet version with gul.', healthy: 'Better than fried upvas chips.',
    art: ['heap', '#F57C00', '#FFCC80', '#8D6E63'], g: ['sweet potato', 'peanuts', 'lemon'] });

  /* ---------------- SWEETS ---------------- */
  add('modak', { n: 'Ukadiche Modak', m: 'उकडीचे मोदक', cat: 'sweet', tags: [], time: 60, spice: 'None', nut: 'Steamed festival sweet — Sankashti special',
    ing: [[1, 'cup', 'rice flour'], [1, 'cup', 'fresh coconut, grated'], [0.6, 'cup', 'gul'], [1, 'tsp', 'tup'], [null, '', 'elaichi, salt']],
    steps: ['Cook coconut and gul till thick; add elaichi.', 'Boil 1 cup water with tup and salt; add rice flour, cover, rest 5 minutes, knead smooth.', 'Shape cups, pleat, fill and close.', 'Steam 12 minutes. Serve with tup.'],
    tip: 'Oil your fingers and knead the ukad while warm.', kids: 'Let them pleat their own modak.', healthy: 'Steamed, not fried — 2 per person.',
    art: ['modak', '#FBF7EE', '#E6D5B8', '#C49A6C'], g: ['rice flour', 'coconut', 'gul'] });

  add('shrikhand', { n: 'Shrikhand', m: 'श्रीखंड', cat: 'sweet', tags: ['D'], time: 20, spice: 'None', pre: 'Hang 1 kg dahi in muslin (6 hours)', nut: 'Dairy treat — protein, calcium',
    ing: [[1, 'kg', 'dahi, hung to chakka'], [0.4, 'cup', 'powdered sugar'], [null, '', 'elaichi, kesar, pistachio']],
    steps: ['Hang dahi 6 hours.', 'Whisk chakka with sugar, elaichi and kesar milk till smooth.', 'Chill and garnish.'],
    tip: 'Use less sugar than you think — chill it, and the sweetness rounds out.', kids: 'Mango pulp makes amrakhand in season.', healthy: 'A dairy-rich occasional sweet.',
    art: ['glass', '#FFE082', '#FFF8E1', '#9CCC65'], g: ['dahi', 'kesar'] });

  /* ---------------- SNACKS (4 pm) ---------------- */
  const SN = {
    guava: { x: 'Peru (guava) + roasted chana', t: ['fruit', 'P'] },
    orange: { x: 'Nagpur santra + peanut chikki', t: ['fruit', 'P'] },
    bmilk: { x: 'Banana + glass of milk', t: ['fruit', 'D'] },
    papaya: { x: 'Papaya bowl', t: ['fruit'] },
    makhana: { x: 'Roasted makhana + milk', t: ['D'] },
    chaat: { x: 'Fruit chaat (seasonal fruit + chaat masala)', t: ['fruit'] }
  };

  /* ---------------- 28-DAY PLAN: Mon 23 Nov – Sun 20 Dec 2026 ----------------
     day: [type, breakfast, tiffin, lunch, snack, dinner, note, fast]  type: veg | nv | fast  */
  const FAST_SAN = { b: 'Milk + fruit + 4–5 almonds', l: ['sabudana', 'koshimbir'], s: 'Fruit + small piece of rajgira chikki', d: ['bhagar', 'modak'], dn: 'After moonrise' };
  const FAST_EK1 = { b: 'Milk + banana + almonds & walnuts', l: ['bhagar', 'koshimbir'], s: 'Fruit + makhana roasted in 1 tsp tup', d: ['rajgira', 'ratale'], dn: 'Dinner' };
  const FAST_EK2 = { b: 'Milk + banana + almonds & walnuts', l: ['sabudana', 'koshimbir'], s: 'Fruit + roasted makhana', d: ['rajgira', 'ratale'], dn: 'Dinner' };
  const P = [
    // Week 1
    ['veg', ['poha'], ['thalipeeth'], ['poli', 'methipatal', 'varan', 'bhaat', 'koshimbir', 'taak'], 'guava', ['jowarbhakri', 'matkiusal', 'koshimbir']],
    ['nv', ['eggbhurji', 'poli'], ['batatabhaji', 'poli'], ['bajrabhakri', 'bharlivangi', 'amti', 'bhaat', 'koshimbir', 'taak'], 'orange', ['tandoori', 'dalpalak', 'poli', 'koshimbir']],
    ['nv', ['moongdhirde'], ['methiparatha'], ['nachnibhakri', 'fishcurry', 'kobi', 'bhaat', 'koshimbir', 'solkadhi'], 'bmilk', ['khichdi', 'kadhi', 'sukhibhaji']],
    ['nv', ['omelette', 'poli'], ['paneerparatha'], ['jowarbhakri', 'gavar', 'chawliusal', 'bhaat', 'koshimbir', 'taak'], 'papaya', ['kolambi', 'poli', 'bhaat', 'koshimbir']],
    ['fast', ['ghavan', 'dahi'], ['upit'], ['nachnibhakri', 'kalavatana', 'bhaat', 'koshimbir'], 'papaya', ['dalmethi', 'poli'], 'Sankashti Chaturthi — adults fast till moonrise; whole family vegetarian', FAST_SAN],
    ['veg', ['besandhirde'], ['thalipeeth'], ['bajrabhakri', 'bharit', 'vatanausal', 'bhaat', 'taak'], 'makhana', ['masalebhaat', 'kadhi', 'sproutchaat']],
    ['nv', ['misal'], [], ['jowarbhakri', 'kolhapuri', 'bhaat', 'koshimbir', 'taak'], 'chaat', ['soup', 'methiparatha'], 'Sunday fun breakfast: home misal'],
    // Week 2
    ['veg', ['upit', 'dahi'], ['paneerparatha'], ['jowarbhakri', 'sukhibhaji', 'amti', 'bhaat', 'koshimbir', 'taak'], 'guava', ['bajrabhakri', 'pithla', 'koshimbir']],
    ['nv', ['andaroll'], ['thalipeeth'], ['poli', 'flower', 'fishfry', 'varan', 'bhaat', 'koshimbir'], 'orange', ['khichdi', 'kadhi', 'koshimbir']],
    ['nv', ['ukadpendi', 'dahi'], ['methiparatha'], ['jowarbhakri', 'palakpatal', 'masooramti', 'bhaat', 'koshimbir', 'taak'], 'bmilk', ['sukka', 'poli', 'koshimbir']],
    ['nv', ['omelette', 'poli'], ['paneerparatha'], ['nachnibhakri', 'fishcurry', 'gavar', 'bhaat', 'koshimbir', 'solkadhi'], 'papaya', ['paneermatar', 'poli', 'soup']],
    ['fast', ['besandhirde', 'taak'], ['upit'], ['nachnibhakri', 'kulith', 'dudhi', 'poli', 'koshimbir'], 'papaya', ['matkiusal', 'poli', 'koshimbir'], 'Utpanna Ekadashi — adults fast; whole family vegetarian; no rice today', FAST_EK1],
    ['veg', ['poha'], ['thalipeeth'], ['bajrabhakri', 'bharit', 'vatanausal', 'bhaat', 'taak'], 'makhana', ['daldhokli', 'koshimbir'], 'Adults break the Ekadashi fast after sunrise'],
    ['nv', ['alooparatha', 'dahi'], [], ['jowarbhakri', 'malvanichicken', 'bhaat', 'solkadhi', 'koshimbir'], 'chaat', ['pavbhaji', 'sproutchaat'], 'Fun dinner: home pav bhaji'],
    // Week 3
    ['veg', ['moongdhirde'], ['methiparatha'], ['jowarbhakri', 'mulabhaji', 'varan', 'bhaat', 'koshimbir', 'taak'], 'guava', ['turdana', 'poli']],
    ['nv', ['eggbhurji', 'poli'], ['batatabhaji', 'poli'], ['poli', 'bhendi', 'dalmethi', 'bhaat', 'koshimbir'], 'orange', ['tandoori', 'nachnibhakri', 'koshimbir']],
    ['nv', ['upit', 'dahi'], ['thalipeeth'], ['nachnibhakri', 'kolambi', 'kobi', 'bhaat', 'koshimbir', 'solkadhi'], 'bmilk', ['khichdi', 'kadhi', 'sukhibhaji']],
    ['nv', ['omelette', 'poli'], ['paneerparatha'], ['jowarbhakri', 'flower', 'rajma', 'bhaat', 'koshimbir', 'taak'], 'papaya', ['paneerbhurji', 'poli', 'soup']],
    ['nv', ['ghavan', 'dahi'], ['methiparatha'], ['bajrabhakri', 'dodka', 'matkiusal', 'bhaat', 'koshimbir', 'taak'], 'guava', ['kolhapuri', 'jowarbhakri', 'koshimbir']],
    ['veg', ['thalipeeth'], ['paneerparatha'], ['poli', 'bharlivangi', 'chawliusal', 'bhaat', 'taak'], 'makhana', ['masalebhaat', 'kadhi', 'sproutchaat']],
    ['nv', ['misal'], [], ['nachnibhakri', 'fishcurry', 'bhaat', 'koshimbir', 'solkadhi', 'taak'], 'chaat', ['soup', 'methiparatha'], 'Sunday fun breakfast: home misal'],
    // Week 4
    ['veg', ['besandhirde'], ['thalipeeth'], ['jowarbhakri', 'methipatal', 'amti', 'bhaat', 'koshimbir', 'taak'], 'guava', ['bajrabhakri', 'pithla', 'koshimbir']],
    ['nv', ['andaroll'], ['batatabhaji', 'poli'], ['poli', 'gavar', 'fishfry', 'varan', 'bhaat', 'koshimbir', 'taak'], 'orange', ['dalpalak', 'jowarbhakri', 'koshimbir']],
    ['nv', ['moongdhirde'], ['methiparatha'], ['nachnibhakri', 'kobi', 'kalavatana', 'bhaat', 'taak'], 'bmilk', ['sukka', 'poli', 'koshimbir']],
    ['nv', ['omelette', 'poli'], ['paneerparatha'], ['jowarbhakri', 'dudhi', 'masooramti', 'bhaat', 'koshimbir', 'taak'], 'papaya', ['kolambibhaat', 'solkadhi', 'koshimbir']],
    ['nv', ['ukadpendi', 'dahi'], ['thalipeeth'], ['bajrabhakri', 'malvanichicken', 'bhaat', 'koshimbir'], 'guava', ['khichdi', 'kadhi', 'sukhibhaji']],
    ['veg', ['poha'], ['methiparatha'], ['jowarbhakri', 'bharit', 'turdana', 'bhaat', 'taak'], 'makhana', ['pavbhaji', 'sproutchaat'], 'Fun dinner: home pav bhaji'],
    ['fast', ['alooparatha', 'dahi'], [], ['nachnibhakri', 'paneermatar', 'poli', 'koshimbir', 'taak'], 'chaat', ['vatanausal', 'poli', 'koshimbir'], 'Mokshada Ekadashi & Gita Jayanti — adults fast; whole family vegetarian; no rice today', FAST_EK2]
  ];

  const START = new Date(2026, 10, 23); // Mon 23 Nov 2026
  const days = P.map((d, i) => {
    const date = new Date(START); date.setDate(START.getDate() + i);
    return { i, date, type: d[0], b: d[1], t: d[2], l: d[3], s: d[4], d: d[5], note: d[6] || '', fast: d[7] || null };
  });

  const GROC = {
    'Bhajipala (vegetables)': ['onion', 'tomato', 'potato', 'peas', 'carrot', 'beans', 'capsicum', 'cucumber', 'beetroot', 'brinjal', 'spring onion', 'cabbage', 'cauliflower', 'dudhi', 'dodka', 'gavar', 'bhendi', 'tondli', 'mula', 'tur dana', 'sweet potato', 'ginger', 'garlic', 'lemon', 'coconut'],
    'Palebhaji (greens)': ['methi', 'palak', 'shepu', 'kothimbir'],
    'Fale (fruit)': ['pomegranate'],
    'Dairy': ['dahi', 'paneer', 'milk', 'butter'],
    'Chicken, fish & eggs': ['chicken', 'fish', 'prawns', 'eggs'],
    'Pulses & grains': ['toor dal', 'moong dal', 'masoor dal', 'chana dal', 'matki', 'moong', 'chawli', 'kala vatana', 'rajma', 'kabuli chana', 'kulith flour', 'besan', 'rice', 'poha', 'rava', 'atta', 'jowar flour', 'bajra flour', 'nachni flour', 'rice flour', 'bhajani', 'sabudana', 'varai', 'rajgira flour'],
    'Pantry': ['peanuts', 'dry khobra', 'til', 'cashew', 'dates', 'kokum', 'gul', 'kesar', 'farsan', 'pav']
  };

  return { R, SN, days, GROC, START };
})();
