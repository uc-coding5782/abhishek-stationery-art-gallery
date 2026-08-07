# Abhishek Book Depot - Seed Data for MongoDB

CATEGORIES = [
  {"id": "books", "name": "Books", "icon": "📚", "color": "#2874F0", "bg": "#EBF2FF"},
  {"id": "ncert", "name": "NCERT Books", "icon": "🎓", "color": "#7C3AED", "bg": "#EDE9FE"},
  {"id": "stationery", "name": "Stationery", "icon": "✏️", "color": "#059669", "bg": "#ECFDF5"},
  {"id": "copies", "name": "Copies", "icon": "📓", "color": "#D97706", "bg": "#FFFBEB"},
  {"id": "registers", "name": "Registers", "icon": "📒", "color": "#DC2626", "bg": "#FEF2F2"},
  {"id": "pens", "name": "Pens & Pencils", "icon": "🖊️", "color": "#0891B2", "bg": "#ECFEFF"},
  {"id": "art", "name": "Art & Craft", "icon": "🎨", "color": "#BE185D", "bg": "#FDF2F8"},
  {"id": "flowers", "name": "Flowers", "icon": "🌸", "color": "#E11D48", "bg": "#FFF1F2"},
  {"id": "toys", "name": "Toys", "icon": "🧸", "color": "#F59E0B", "bg": "#FFFBEB"},
  {"id": "games", "name": "Games", "icon": "🎮", "color": "#6D28D9", "bg": "#EDE9FE"},
  {"id": "gifts", "name": "Gifts", "icon": "🎁", "color": "#EC4899", "bg": "#FDF2F8"},
  {"id": "school", "name": "School Supplies", "icon": "🎒", "color": "#2563EB", "bg": "#EFF6FF"},
  {"id": "office", "name": "Office Supplies", "icon": "🗂️", "color": "#374151", "bg": "#F9FAFB"},
  {"id": "decoration", "name": "Decoration", "icon": "✨", "color": "#D97706", "bg": "#FEFCE8"}
]

# Generate seed products structure matching the 105 products in frontend data
def get_seed_products():
    img_base = lambda seed: f"https://picsum.photos/seed/{seed}/400/400"
    products = [
      {"id": 1, "name": "NCERT Mathematics Class 10", "category": "ncert", "price": 85, "mrp": 120, "discount": 29, "rating": 4.8, "reviews": 2341, "stock": 50, "brand": "NCERT", "image": img_base("book1"), "description": "Official NCERT Mathematics textbook for Class 10. Covers all CBSE curriculum topics.", "tags": ["class 10", "maths", "cbse"]},
      {"id": 2, "name": "NCERT Science Class 10", "category": "ncert", "price": 90, "mrp": 130, "discount": 31, "rating": 4.7, "reviews": 1987, "stock": 45, "brand": "NCERT", "image": img_base("book2"), "description": "Official NCERT Science textbook for Class 10.", "tags": ["class 10", "science", "cbse"]},
      {"id": 3, "name": "NCERT Social Science Class 10", "category": "ncert", "price": 80, "mrp": 115, "discount": 30, "rating": 4.6, "reviews": 1654, "stock": 40, "brand": "NCERT", "image": img_base("book3"), "description": "History, Geography, Political Science and Economics for Class 10.", "tags": ["class 10", "sst", "cbse"]},
      {"id": 4, "name": "NCERT English Class 10", "category": "ncert", "price": 75, "mrp": 105, "discount": 29, "rating": 4.5, "reviews": 1432, "stock": 38, "brand": "NCERT", "image": img_base("book4"), "description": "First Flight and Footprints Without Feet — NCERT English for Class 10.", "tags": ["class 10", "english", "cbse"]},
      {"id": 5, "name": "NCERT Hindi Class 10", "category": "ncert", "price": 70, "mrp": 100, "discount": 30, "rating": 4.4, "reviews": 1123, "stock": 35, "brand": "NCERT", "image": img_base("book5"), "description": "Kshitij and Kritika — NCERT Hindi textbooks for Class 10.", "tags": ["class 10", "hindi", "cbse"]},
      {"id": 6, "name": "NCERT Mathematics Class 9", "category": "ncert", "price": 82, "mrp": 118, "discount": 31, "rating": 4.7, "reviews": 2100, "stock": 48, "brand": "NCERT", "image": img_base("book6"), "description": "Class 9 NCERT Maths — algebra, geometry, statistics.", "tags": ["class 9", "maths", "cbse"]},
      {"id": 7, "name": "NCERT Science Class 9", "category": "ncert", "price": 88, "mrp": 125, "discount": 30, "rating": 4.6, "reviews": 1876, "stock": 42, "brand": "NCERT", "image": img_base("book7"), "description": "Class 9 NCERT Science covering matter, motion, biology.", "tags": ["class 9", "science", "cbse"]},
      {"id": 8, "name": "NCERT Mathematics Class 12 Part 1", "category": "ncert", "price": 95, "mrp": 140, "discount": 32, "rating": 4.9, "reviews": 3012, "stock": 55, "brand": "NCERT", "image": img_base("book8"), "description": "Relations, Functions, Matrices, Determinants for Class 12.", "tags": ["class 12", "maths", "cbse"]},
      {"id": 9, "name": "NCERT Physics Class 12 Part 1", "category": "ncert", "price": 92, "mrp": 135, "discount": 32, "rating": 4.8, "reviews": 2765, "stock": 50, "brand": "NCERT", "image": img_base("book9"), "description": "Electrostatics, Current Electricity — NCERT Physics Class 12.", "tags": ["class 12", "physics", "cbse"]},
      {"id": 10, "name": "NCERT Chemistry Class 12 Part 1", "category": "ncert", "price": 88, "mrp": 130, "discount": 32, "rating": 4.7, "reviews": 2543, "stock": 48, "brand": "NCERT", "image": img_base("book10"), "description": "Solid State, Solutions, Electrochemistry — NCERT Chemistry Class 12.", "tags": ["class 12", "chemistry", "cbse"]}
    ]
    
    # Generate remaining items systematically to ensure 105 items match data.js/index.html
    categories_cycle = ["books", "pens", "copies", "registers", "art", "flowers", "toys", "games", "gifts", "school", "office", "decoration"]
    brands = ["Oswaal", "Arihant", "Reynolds", "Cello", "Pilot", "Parker", "Natraj", "Apsara", "Faber-Castell", "Luxor", "Navneet", "Classmate", "Camlin", "Fevicol", "Solo", "LEGO", "Rubik's", "Hot Wheels", "Mattel", "Hasbro", "Yonex", "Archies", "Fresh", "Casio", "Milton"]
    
    # We load standard products matching titles from our JS code
    additional_data = [
      ("Oswaal CBSE Sample Papers Class 10", "books", 299, 450, "Oswaal", "book11", "Latest CBSE sample papers with marking scheme."),
      ("Arihant All-in-One Science Class 10", "books", 349, 520, "Arihant", "book12", "Complete study package with theory, examples, exercises."),
      ("MTG Rapid Revision NEET Biology", "books", 459, 699, "MTG", "book13", "Quick revision guide for NEET Biology with MCQs."),
      ("Arihant 40 Days JEE Maths", "books", 379, 560, "Arihant", "book14", "40-day crash course for JEE Main Mathematics."),
      ("Lucent General Knowledge 2025", "books", 199, 320, "Lucent", "book15", "Comprehensive GK book covering history, geography, polity."),
      ("S.Chand Physics Class 11", "books", 420, 650, "S.Chand", "book16", "S Chand comprehensive Physics for Class 11."),
      ("Oswaal Sample Papers Class 12 PCM", "books", 549, 850, "Oswaal", "book17", "Physics, Chemistry & Maths sample papers bundle for Class 12."),
      ("Arihant Reasoning Book SSC/Bank", "books", 249, 395, "Arihant", "book18", "Complete reasoning guide for SSC, Banking exams."),
      ("Reynolds 045 Ball Pen (Pack of 10)", "pens", 99, 150, "Reynolds", "pen1", "Smooth writing Reynolds 045 ball pens in blue ink. Pack of 10."),
      ("Cello Gripper Ball Pen (10 Pack)", "pens", 110, 175, "Cello", "pen2", "Ergonomic grip for comfortable writing."),
      ("Pilot V5 Hi-Tecpoint Pen", "pens", 60, 85, "Pilot", "pen3", "Liquid ink roller pen for precise, smooth writing."),
      ("Parker Vector Ball Pen Blue", "pens", 199, 299, "Parker", "pen4", "Premium Parker ball pen with stainless steel nib."),
      ("Natraj HB Pencils (Pack of 20)", "pens", 59, 90, "Natraj", "pen5", "Classic HB pencils with smooth graphite."),
      ("Apsara Drawing Pencil Set (12 pcs)", "pens", 79, 120, "Apsara", "pen6", "Set of 12 drawing pencils ranging from 2H to 6B."),
      ("Faber-Castell Colour Pencils 24", "pens", 199, 320, "Faber-Castell", "pen7", "24 vibrant shades, comfortable grip, break-resistant leads."),
      ("Luxor Ink Pen Set (Pack of 5)", "pens", 149, 220, "Luxor", "pen8", "Classic ink pens in assorted colors."),
      ("Navneet Pulse Notebook 200 Pages", "copies", 59, 90, "Navneet", "note1", "Premium quality 200-page ruled notebook."),
      ("Classmate Interleaf A4 Notebook", "copies", 69, 100, "Classmate", "note2", "A4 size interleaf notebook with ruled pages."),
      ("Navneet Jumbo Register 500 Pages", "registers", 149, 220, "Navneet", "note3", "Large 500-page register for accounts and records."),
      ("Classmate Science Practical File", "copies", 79, 120, "Classmate", "note4", "A4 science practical file with graph and plain pages."),
      ("Long Register 200 Pages (Pack 5)", "registers", 199, 299, "Navneet", "note5", "Pack of 5 long-size ruled registers."),
      ("Navneet A4 Copy (Pack of 10)", "copies", 299, 450, "Navneet", "note6", "Wholesale pack of 10 A4 ruled copies."),
      ("Drawing Book A3 (25 Sheets)", "copies", 55, 80, "Navneet", "note7", "Thick A3 drawing pages for school art projects."),
      ("Camlin Kokuyo Acrylic Colour Set", "art", 299, 450, "Camlin", "art1", "12 vibrant acrylic colours for canvas, paper and fabric."),
      ("Faber-Castell Sketch Pens (48 set)", "art", 449, 699, "Faber-Castell", "art2", "48 bright water-based sketch pen colours. Non-toxic."),
      ("Camlin Watercolour Cake Set 24", "art", 199, 320, "Camlin", "art3", "24 brilliant watercolour cakes with brush."),
      ("Staedtler Oil Pastels 24 Shades", "art", 249, 380, "Staedtler", "art4", "24 vivid oil pastels for smooth blending."),
      ("Chart Paper Pack (10 assorted)", "art", 49, 75, "Solo", "art5", "10 colourful chart papers in assorted shades."),
      ("Fevicol MR Adhesive 200g", "art", 89, 130, "Fevicol", "art6", "Multi-purpose synthetic resin adhesive. 200g pack."),
      ("Glitter Foam Sheets (12 colours)", "art", 149, 220, "Solo", "art7", "12 glitter foam sheets for craft and decoration."),
      ("Geometry Box (Classmate Pro)", "school", 179, 260, "Classmate", "art8", "Complete geometry box with compass, divider, protractor."),
      ("Maped Geometry Box Metallic", "school", 249, 380, "Maped", "art9", "Premium metallic geometry box with precision instruments."),
      ("School Bag (Class 1–5) Cartoon", "school", 599, 999, "Solo", "school1", "Lightweight ergonomic school bag with cartoon print."),
      ("Scientific Calculator Casio fx-82", "school", 899, 1299, "Casio", "school2", "Casio fx-82 scientific calculator — 240 functions."),
      ("Stapler + 1000 Pins Set", "school", 129, 195, "Kores", "school3", "Heavy-duty mini stapler with 1000 pins."),
      ("Sticky Notes (6 colour packs)", "office", 79, 120, "Solo", "school4", "400 sticky notes in 6 bright colors."),
      ("Scotch Tape Set (3 pack)", "school", 59, 90, "3M", "school5", "Pack of 3 transparent scotch tapes."),
      ("Index File (A4, 40 pockets)", "office", 199, 320, "Solo", "school6", "Polypropylene file with 40 clear pockets."),
      ("Eraser Pack (12 pcs, Apsara)", "stationery", 45, 70, "Apsara", "school7", "12 dust-free erasers for exams."),
      ("Sharpener Double-Hole (Pack 10)", "stationery", 35, 55, "Natraj", "school8", "Double-hole sharpener for standard and thick pencils."),
      ("Scale Ruler Set (30cm + 15cm)", "school", 49, 75, "Classmate", "school9", "Transparent plastic ruler with centimeter markings."),
      ("Correction Fluid Pen (Whitener)", "stationery", 39, 60, "Camel", "school10", "Quick-dry whitener correction pen."),
      ("LEGO Classic Creative Bricks Set", "toys", 1299, 2199, "LEGO", "toy1", "480-piece classic LEGO brick set. Ages 4+."),
      ("Rubik's Cube (Original 3x3)", "toys", 299, 499, "Rubik's", "toy2", "The original 3x3 Rubik's Cube. Premium smooth-turning mechanism."),
      ("Hot Wheels Car Pack (10 cars)", "toys", 799, 1299, "Hot Wheels", "toy3", "10 die-cast Hot Wheels cars. Ages 3+."),
      ("Soft Plush Teddy Bear 40cm", "toys", 499, 850, "Hamleys", "toy4", "Super soft 40cm teddy bear. Perfect gift for kids."),
      ("Remote Control Car 1:16 Scale", "toys", 1499, 2499, "Toyzone", "toy5", "High-speed RC car with rechargeable battery."),
      ("Doll House Playset (72 pieces)", "toys", 1199, 1999, "Barbie", "toy6", "Complete dollhouse with furniture and accessories."),
      ("Magnetic Drawing Board", "toys", 399, 650, "Toyzone", "toy7", "Mess-free magnetic drawing board. Ages 2+."),
      ("Play-Doh 10 Colour Set", "toys", 599, 999, "Play-Doh", "toy8", "Non-toxic Play-Doh in 10 vibrant colors. Ages 2+."),
      ("Wooden Puzzles (100 pieces)", "toys", 349, 599, "Funskool", "toy9", "100-piece wooden jigsaw puzzle. Ages 4+."),
      ("Action Figure Superhero Set (5pc)", "toys", 699, 1199, "Hasbro", "toy10", "5 superhero action figures. Ages 4+."),
      ("Scrabble Classic Board Game", "games", 999, 1699, "Mattel", "game1", "Classic Scrabble word game for 2-4 players."),
      ("Ludo + Snakes & Ladders Combo", "games", 299, 499, "Funskool", "game2", "Deluxe Ludo and Snakes & Ladders board game combo."),
      ("Chess Set (Magnetic Travel)", "games", 499, 850, "Staunton", "game3", "Magnetic travel chess set with folding board."),
      ("UNO Card Game Original", "games", 349, 599, "Mattel", "game4", "Original UNO card game — 112 cards."),
      ("Monopoly Classic Edition", "games", 799, 1399, "Hasbro", "game5", "Classic Monopoly board game."),
      ("Jenga Classic Wooden Blocks", "games", 599, 999, "Hasbro", "game6", "Original Jenga with 54 hardwood blocks."),
      ("Carrom Board (Full Size, 4mm)", "games", 1499, 2499, "Syndicate", "game7", "Full size 74x74cm carrom board with coins and striker."),
      ("Badminton Racket Set (2 rackets)", "games", 799, 1299, "Yonex", "game8", "2 rackets with 3 shuttlecocks. Great for beginners."),
      ("Greeting Card Pack (Birthday x12)", "gifts", 149, 250, "Archies", "gift1", "Pack of 12 premium birthday greeting cards."),
      ("Gift Wrap Paper Roll (6 designs)", "gifts", 199, 350, "Solo", "gift2", "6 beautiful gift wrap designs on rolls."),
      ("Ribbon & Bow Set (30 pcs)", "gifts", 99, 175, "Solo", "gift3", "30 pieces of assorted ribbons and bows."),
      ("Gift Box Set (3 sizes, 5 boxes)", "gifts", 249, 420, "Solo", "gift4", "5 premium gift boxes in 3 sizes."),
      ("Personalized Pen Gift Set", "gifts", 399, 650, "Parker", "gift5", "Premium pen gift set in beautiful packaging."),
      ("Photo Frame (5x7) Golden Border", "gifts", 299, 499, "Archies", "gift6", "5x7 inch photo frame with golden border."),
      ("Tissue Paper (Decorative, 50 sheets)", "gifts", 89, 150, "Solo", "gift7", "50 sheets of decorative tissue paper."),
      ("Balloon Pack (50 pcs Latex)", "decoration", 99, 175, "Anagram", "gift8", "50 high-quality latex balloons in assorted colors."),
      ("Happy Birthday Banner Combo", "decoration", 149, 250, "Solo", "gift9", "Birthday banner, star balloons, confetti combo."),
      ("Scented Candles Set (6 pcs)", "decoration", 299, 499, "Iris", "gift10", "6 premium soy wax scented candles."),
      ("Red Rose Bouquet (12 roses)", "flowers", 599, 999, "Fresh", "flower1", "Beautiful fresh red roses in premium bouquet."),
      ("Mixed Flower Arrangement", "flowers", 799, 1399, "Fresh", "flower2", "Premium mixed flowers with lilies, roses and carnations."),
      ("Artificial Flower Bunch (Silk)", "flowers", 299, 499, "Craftghar", "flower3", "Realistic silk artificial flower bunch for decoration."),
      ("Sunflower Bouquet (8 stems)", "flowers", 449, 750, "Fresh", "flower4", "8 bright fresh sunflowers in gift-ready bouquet."),
      ("Desktop Mini Succulent Plant", "flowers", 199, 349, "Ugaoo", "flower5", "Easy-care desktop succulent in cute pot."),
      ("Rose & Lily Combo Bouquet", "flowers", 699, 1199, "Fresh", "flower6", "Beautiful combination of red roses and white lilies."),
      ("Spiral Binder A4 (Pack of 5)", "office", 249, 399, "Solo", "office1", "A4 spiral binders with 100 pages each. Pack of 5."),
      ("Desk Organiser (5 compartments)", "office", 399, 650, "Solo", "office2", "5-compartment desk organiser for pens and files."),
      ("Printer Paper A4 (500 sheets)", "office", 399, 600, "JK", "office3", "JK Copier 75 GSM A4 printer paper. 500 sheets."),
      ("Whiteboard Marker Set (12 pcs)", "office", 199, 320, "Camlin", "office4", "12 dry-erase whiteboard markers in assorted colors."),
      ("Lever Arch File (A4, Pack 2)", "office", 299, 499, "Solo", "office5", "Heavy-duty lever arch files for document storage."),
      ("Business Card Holder (100 cards)", "office", 149, 249, "Solo", "office6", "Transparent business card holder."),
      ("Lunch Box (3 tier, Steel)", "school", 699, 1199, "Milton", "extra1", "3-tier stainless steel lunch box. Leak-proof."),
      ("Water Bottle (1L, Tritan)", "school", 499, 850, "Nalgene", "extra2", "BPA-free Tritan plastic 1-litre sports water bottle."),
      ("Pencil Pouch (Zipper, 3 pockets)", "school", 199, 350, "Classmate", "extra3", "Large 3-pocket pencil pouch. Water-resistant."),
      ("Hindi Grammar Book Class 6-8", "books", 149, 250, "S.Chand", "extra4", "Complete Hindi grammar for Classes 6 to 8."),
      ("English Grammar (Wren & Martin)", "books", 349, 599, "S.Chand", "extra5", "The legendary Wren & Martin English Grammar book."),
      ("Colorful Washi Tape Set (20 rolls)", "art", 299, 499, "Solo", "extra6", "20 rolls of decorative washi tape."),
      ("Mini Stapler + 500 Staples", "stationery", 89, 140, "Kores", "extra7", "Compact mini stapler with 500 staples."),
      ("Page Flags / Tab Stickers (300 pcs)", "stationery", 59, 99, "Solo", "extra8", "300 transparent sticky tab page flags."),
      ("Maths Activity Kit (Class 1-5)", "toys", 499, 850, "Orbo", "extra9", "Complete maths activity kit with abacus, number cards."),
      ("Hindi Story Books Set (5 books)", "books", 299, 499, "Rajpal", "extra10", "5 popular Hindi story books for children aged 6-12."),
      ("Flash Cards (Alphabet + Numbers)", "toys", 199, 350, "Orbo", "extra11", "104 educational flash cards. Laminated, durable."),
      ("Foam Stickers Sheet Pack (10 pcs)", "art", 79, 130, "Solo", "extra12", "10 sheets of foam stickers with animals and shapes."),
      ("Origami Paper 200 sheets (20 clr)", "art", 149, 249, "Solo", "extra13", "200 sheets of square origami paper in 20 colors.")
    ]
    
    current_id = 11
    for name, cat, price, mrp, brand, seed, desc in additional_data:
        disc = round((1 - price/mrp) * 100)
        import random
        # deterministic rating and reviews for seeding consistent with JS data
        rating = round(4.0 + (current_id % 10) * 0.1, 1)
        if rating > 5.0: rating = 4.8
        reviews = 100 + (current_id * 37) % 5000
        stock = 10 + (current_id * 13) % 100
        
        products.append({
            "id": current_id,
            "name": name,
            "category": cat,
            "price": price,
            "mrp": mrp,
            "discount": disc,
            "rating": rating,
            "reviews": reviews,
            "stock": stock,
            "brand": brand,
            "image": img_base(seed),
            "description": desc,
            "tags": [cat, brand.lower(), "stationery"]
        })
        current_id += 1
        
    return products
