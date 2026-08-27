import {
  Service,
  ServiceCategory,
  ServicePackage,
  ServiceAddon,
  Staff,
  Coupon,
  Offer,
  Review,
  FAQ,
  Booking,
  WebsiteSettings
} from '../types';

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-home',
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    iconName: 'Home',
    description: 'Comprehensive deep cleaning and sanitization for apartments and houses.',
    isActive: true,
    order: 1
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen Cleaning',
    slug: 'kitchen',
    iconName: 'Utensils',
    description: 'Degreasing, chimney scrubbing, and hygienic appliance deep cleaning.',
    isActive: true,
    order: 2
  },
  {
    id: 'cat-bathroom',
    name: 'Bathroom Cleaning',
    slug: 'bathroom',
    iconName: 'Sparkles',
    description: 'Stain removal, tile scaling, anti-microbial disinfection, and buffing.',
    isActive: true,
    order: 3
  },
  {
    id: 'cat-furniture',
    name: 'Furniture & Carpet',
    slug: 'furniture',
    iconName: 'Armchair',
    description: 'Deep shampooing, industrial steam extraction, and upholstery care.',
    isActive: true,
    order: 4
  },
  {
    id: 'cat-commercial',
    name: 'Commercial Cleaning',
    slug: 'commercial',
    iconName: 'Building2',
    description: 'Corporate office suites, retail outlets, and commercial facility hygiene.',
    isActive: true,
    order: 5
  }
];

export const INITIAL_ADDONS: ServiceAddon[] = [
  {
    id: 'addon-sofa-2seater',
    name: 'Sofa Cleaning (2 Seater)',
    price: 499,
    description: 'Deep shampooing & stain removal for 2-seater sofa',
    isActive: true,
    category: 'Furniture'
  },
  {
    id: 'addon-mattress-single',
    name: 'Single Mattress Sanitization',
    price: 399,
    description: 'Dust mite extraction and UV disinfectant spray',
    isActive: true,
    category: 'Furniture'
  },
  {
    id: 'addon-fridge-deep',
    name: 'Refrigerator Deep Cleaning',
    price: 349,
    description: 'Complete defrosting, interior sanitization & odor elimination',
    isActive: true,
    category: 'Kitchen'
  },
  {
    id: 'addon-chimney-degrease',
    name: 'Chimney Degreasing & Filter Scrub',
    price: 449,
    description: 'Heavy grease baffle filter caustic wash & motor exterior wipe',
    isActive: true,
    category: 'Kitchen'
  },
  {
    id: 'addon-balcony-wash',
    name: 'Balcony Jet Scrubbing (Per Balcony)',
    price: 299,
    description: 'High-pressure water washing and railing wipe-down',
    isActive: true,
    category: 'Home'
  },
  {
    id: 'addon-fan-lighting',
    name: 'Ceiling Fan & Chandelier Polish',
    price: 199,
    description: 'Safe dust removal and blade polishing up to 3 fans',
    isActive: true,
    category: 'Home'
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-full-house',
    name: 'Full House Deep Cleaning',
    slug: 'full-house-deep-cleaning',
    categoryId: 'cat-home',
    categoryName: 'Home Cleaning',
    description: 'Our signature whole-home intensive sanitization service. We bring industrial single-disc floor scrubbers, vacuum extractors, specialized eco-friendly chemicals, and a dedicated team to eliminate deep grime from floors, walls, windows, kitchen cabinets, and sanitary spaces.',
    shortDescription: 'Complete end-to-end deep cleaning of bedrooms, living room, bathrooms, kitchen, and balconies with industrial equipment.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 1999,
    duration: '4 - 6 Hours',
    rating: 4.9,
    reviewsCount: 342,
    isActive: true,
    isPopular: true,
    includedItems: [
      'Floor scrubbing with single-disc rotary machine and disinfectant wash',
      'Window panes, mesh, sliding tracks, and balcony railing detailing',
      'Ceiling cobweb removal, fans, switches, and exhaust dusting',
      'Kitchen cabinets exterior & interior dry wipe with tile degreasing',
      'All bathrooms chemical tile descaling, WC sanitization & tap chrome buffing',
      'Doors, frames, handles, and skirting board stain removal'
    ],
    excludedItems: [
      'Heavy furniture shifting (beyond normal sliding limits)',
      'Terrace waterproofing or wall repainting',
      'External facade cleaning above ground level'
    ],
    packages: [
      {
        id: 'pkg-full-1bhk',
        serviceId: 'srv-full-house',
        name: '1 BHK Deep Clean',
        price: 1999,
        originalPrice: 2499,
        duration: '3 - 4 Hours (2 Crew)',
        description: 'Ideal for 1 BHK flats up to 600 sq.ft.',
        includedServices: ['1 Bedroom', '1 Living Area', '1 Kitchen', '1-2 Bathrooms', '1 Balcony'],
        isActive: true
      },
      {
        id: 'pkg-full-2bhk',
        serviceId: 'srv-full-house',
        name: '2 BHK Deep Clean',
        price: 2499,
        originalPrice: 3199,
        duration: '4 - 5 Hours (3 Crew)',
        description: 'Perfect for standard 2 BHK homes up to 1,000 sq.ft.',
        includedServices: ['2 Bedrooms', 'Living & Dining Area', '1 Kitchen', '2 Bathrooms', '2 Balconies'],
        isActive: true,
        isPopular: true
      },
      {
        id: 'pkg-full-3bhk',
        serviceId: 'srv-full-house',
        name: '3 BHK Deep Clean',
        price: 3499,
        originalPrice: 4299,
        duration: '5 - 6 Hours (4 Crew)',
        description: 'Intensive deep scrubbing for larger 3 BHK apartments up to 1,500 sq.ft.',
        includedServices: ['3 Bedrooms', 'Large Living & Dining', 'Modular Kitchen', '3 Bathrooms', 'Utility & Balconies'],
        isActive: true
      },
      {
        id: 'pkg-full-4bhk',
        serviceId: 'srv-full-house',
        name: '4 BHK / Duplex Clean',
        price: 4499,
        originalPrice: 5499,
        duration: '6 - 7 Hours (5 Crew)',
        description: 'Spacious duplex or 4 BHK apartments up to 2,200 sq.ft.',
        includedServices: ['4 Bedrooms', 'Double Living Rooms', 'Kitchen & Pantry', '4 Bathrooms', 'Full Balcony Jet Clean'],
        isActive: true
      },
      {
        id: 'pkg-full-villa',
        serviceId: 'srv-full-house',
        name: 'Villa / Bungalow Suite',
        price: 6999,
        originalPrice: 8499,
        duration: '7 - 9 Hours (6 Crew)',
        description: 'Comprehensive multi-level villa and bungalow detailing with outdoor patio.',
        includedServices: ['Independent Villa (up to 3,500 sq.ft.)', 'All Rooms & Staircases', 'Kitchen & Storage', 'Patio & Balconies'],
        isActive: true
      }
    ],
    faqs: [
      {
        question: 'Do your professionals bring all cleaning chemicals and tools?',
        answer: 'Yes! Cleaning Flash supplies all professional-grade equipment including single-disc floor buffers, wet/dry industrial vacuums, microfiber mops, ladders, and hospital-grade eco-friendly cleaning agents. All you need to provide is electricity and running water.'
      },
      {
        question: 'How long does a 2 BHK or 3 BHK deep clean take?',
        answer: 'A standard 2 BHK takes approximately 4 to 5 hours with a 3-member crew. A 3 BHK takes between 5 to 6 hours with a 4-member crew.'
      },
      {
        question: 'Do I need to vacate the house during the process?',
        answer: 'No need to vacate. You can comfortably relax in any room while our team works methodically room by room.'
      }
    ],
    createdAt: '2026-01-10T00:00:00.000Z'
  },
  {
    id: 'srv-kitchen-deep',
    name: 'Kitchen Deep Cleaning',
    slug: 'kitchen-deep-cleaning',
    categoryId: 'cat-kitchen',
    categoryName: 'Kitchen Cleaning',
    description: 'Specialized grease-dissolving treatment for residential and commercial kitchens. We tackle oil deposits, baked-on grime, exhaust build-up, and cabinet exteriors/interiors using non-abrasive food-safe degreasers.',
    shortDescription: 'Heavy grease removal from tiles, exhaust, slab, stainless steel sink, and cabinet exteriors.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 999,
    duration: '2 - 3 Hours',
    rating: 4.8,
    reviewsCount: 189,
    isActive: true,
    isPopular: false,
    includedItems: [
      'Wall tile and backsplash heavy degreasing',
      'Gas stove and burner de-carbonization',
      'Countertop and granite slab polish',
      'Sink descaling and drain pipe sanitization',
      'Modular trolley and cabinet front degreasing'
    ],
    excludedItems: [
      'Chimney internal motor dismantling (motor shell is wiped externally)',
      'Grocery item inventory rearrangement'
    ],
    packages: [
      {
        id: 'pkg-kitch-standard',
        serviceId: 'srv-kitchen-deep',
        name: 'Standard Modular Kitchen',
        price: 999,
        originalPrice: 1299,
        duration: '2 Hours (2 Crew)',
        description: 'For kitchens up to 80 sq.ft.',
        includedServices: ['Tiles, Countertop, Sink, Exhaust, Exterior Cabinets'],
        isActive: true
      },
      {
        id: 'pkg-kitch-premium',
        serviceId: 'srv-kitchen-deep',
        name: 'Premium Kitchen + Empty Cabinet Interior',
        price: 1499,
        originalPrice: 1899,
        duration: '3.5 Hours (2 Crew)',
        description: 'Includes wiping and sanitizing all interior shelves and drawers.',
        includedServices: ['All Standard features', 'Cabinet Interiors', 'Chimney Baffle Wash', 'Fridge Exterior Scrub'],
        isActive: true,
        isPopular: true
      }
    ],
    createdAt: '2026-01-12T00:00:00.000Z'
  },
  {
    id: 'srv-bathroom-deep',
    name: 'Bathroom Deep Cleaning & Sanitization',
    slug: 'bathroom-deep-cleaning',
    categoryId: 'cat-bathroom',
    categoryName: 'Bathroom Cleaning',
    description: 'Hard water scale removal, tile grout restoration, and bacterial sanitization. We make taps shine like new, remove yellow toilet stains, and sanitize shower partitions.',
    shortDescription: 'Acid-free tile scrubbing, tap chrome shine, commode descaling, mirror polish, and sanitization.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 599,
    duration: '1.5 - 2 Hours',
    rating: 4.9,
    reviewsCount: 420,
    isActive: true,
    isPopular: true,
    includedItems: [
      'Tile scrubbing and grout whitening with specialized floor buffer',
      'Hard water scale removal from shower head, taps, and health faucets',
      'WC commode and washbasin descaling with antibacterial solution',
      'Mirror buffing and glass shower cubicle descaling',
      'Exhaust fan and door wash'
    ],
    excludedItems: [
      'Grout re-cementing / silicone sealant application',
      'Plumbing pipeline repairs'
    ],
    packages: [
      {
        id: 'pkg-bath-1',
        serviceId: 'srv-bathroom-deep',
        name: '1 Bathroom Intensive Wash',
        price: 599,
        originalPrice: 799,
        duration: '1.5 Hours (1 Crew)',
        description: 'Deep descaling for 1 washroom.',
        includedServices: ['Full tile scrub', 'WC Descaling', 'Tap buffing', 'Mirror shine'],
        isActive: true
      },
      {
        id: 'pkg-bath-2',
        serviceId: 'srv-bathroom-deep',
        name: '2 Bathrooms Combo Clean',
        price: 999,
        originalPrice: 1399,
        duration: '2.5 Hours (2 Crew)',
        description: 'Complete clean for 2 bathrooms (Save ₹200).',
        includedServices: ['2 Washrooms', 'Shower Enclosures', 'Floor Buffing', 'Sanitization'],
        isActive: true,
        isPopular: true
      },
      {
        id: 'pkg-bath-3',
        serviceId: 'srv-bathroom-deep',
        name: '3 Bathrooms Master Clean',
        price: 1399,
        originalPrice: 1999,
        duration: '3.5 Hours (2 Crew)',
        description: 'Complete cleaning for 3 bathrooms in your home.',
        includedServices: ['3 Full Washrooms', 'All fixtures', 'Exhausts', 'Steam Disinfection'],
        isActive: true
      }
    ],
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'srv-sofa-cleaning',
    name: 'Sofa & Upholstery Shampooing',
    slug: 'sofa-cleaning',
    categoryId: 'cat-furniture',
    categoryName: 'Furniture & Carpet',
    description: 'High-suction injection-extraction wet shampoo treatment for fabric and leather sofas. Removes deep body oils, spilled beverages, food stains, and allergen dust.',
    shortDescription: 'Industrial injection-extraction machine wash that restores color and removes 99% dust mites.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 699,
    duration: '1.5 - 2 Hours',
    rating: 4.8,
    reviewsCount: 265,
    isActive: true,
    isPopular: false,
    includedItems: [
      'High-power dry vacuuming for debris and hair extraction',
      'Eco-friendly foam shampoo application with soft bristle brush',
      'Industrial wet extraction that sucks out dirty moisture',
      'Cushion deodorizing and fabric rejuvenation'
    ],
    excludedItems: [
      'Drying equipment (natural fan drying takes 3-4 hours)',
      'Fixing torn stitches or fabric rips'
    ],
    packages: [
      {
        id: 'pkg-sofa-3s',
        serviceId: 'srv-sofa-cleaning',
        name: '3-Seater Sofa Shampoo',
        price: 699,
        originalPrice: 899,
        duration: '1 Hour',
        description: 'Standard 3-seater sofa shampooing.',
        includedServices: ['Dry extraction', 'Shampoo scrub', 'Wet vacuum extraction'],
        isActive: true
      },
      {
        id: 'pkg-sofa-5s',
        serviceId: 'srv-sofa-cleaning',
        name: '5-Seater (3+1+1 or L-Shape)',
        price: 1099,
        originalPrice: 1499,
        duration: '1.5 Hours',
        description: 'Full 5 seats or standard L-sectional sofa.',
        includedServices: ['5 Seats deep shampoo', 'Cushions wash', 'Armrests & Back'],
        isActive: true,
        isPopular: true
      },
      {
        id: 'pkg-sofa-7s',
        serviceId: 'srv-sofa-cleaning',
        name: '7-Seater Large Sectional + Recliners',
        price: 1499,
        originalPrice: 1999,
        duration: '2.5 Hours',
        description: 'For large living room suites with up to 7 seat units.',
        includedServices: ['7 Units complete shampooing', 'Recliner mechanisms detailing'],
        isActive: true
      }
    ],
    createdAt: '2026-01-18T00:00:00.000Z'
  },
  {
    id: 'srv-office-commercial',
    name: 'Office & Commercial Deep Cleaning',
    slug: 'office-cleaning',
    categoryId: 'cat-commercial',
    categoryName: 'Commercial Cleaning',
    description: 'Keep your workplace spotless, hygienic, and OSHA compliant. Includes workstation sanitization, server room dust prevention, conference room carpet cleaning, pantry degreasing, and restroom sterilization.',
    shortDescription: 'Complete office sanitization, workstation detailing, glass partition cleaning, and carpet shampooing.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 3499,
    duration: '4 - 8 Hours',
    rating: 4.9,
    reviewsCount: 114,
    isActive: true,
    isPopular: false,
    includedItems: [
      'Workstations, monitors, and keyboard dust extraction',
      'Conference room table buffing & executive chairs sanitization',
      'Pantry counter, coffee machine station & microwave deep clean',
      'Restrooms commercial sanitization and fragrance dosing',
      'Main lobby glass partitions and high-traffic floor buffing'
    ],
    excludedItems: [
      'Accessing live electrical server cabinets without IT supervision',
      'Structural exterior high-rise window rappelling'
    ],
    packages: [
      {
        id: 'pkg-off-small',
        serviceId: 'srv-office-commercial',
        name: 'Small Office (Up to 1,000 sq.ft.)',
        price: 3499,
        originalPrice: 4299,
        duration: '4 Hours (3 Crew)',
        description: 'Ideal for startups and clinic setups with up to 15 workstations.',
        includedServices: ['15 Desks', '1 Meeting Room', 'Pantry', '1 Restroom'],
        isActive: true
      },
      {
        id: 'pkg-off-med',
        serviceId: 'srv-office-commercial',
        name: 'Medium Office (Up to 2,500 sq.ft.)',
        price: 6499,
        originalPrice: 7999,
        duration: '6 Hours (5 Crew)',
        description: 'Ideal for 15-40 desks with reception and multiple washrooms.',
        includedServices: ['Up to 40 Desks', '2 Meeting Rooms', 'Pantry', '3 Restrooms', 'Glass Partitions'],
        isActive: true,
        isPopular: true
      },
      {
        id: 'pkg-off-large',
        serviceId: 'srv-office-commercial',
        name: 'Corporate Suite (Up to 5,000 sq.ft.)',
        price: 11999,
        originalPrice: 14999,
        duration: '8 Hours (8 Crew)',
        description: 'Full floor corporate office deep sanitization over weekend/night shift.',
        includedServices: ['Full Floor Detailing', 'Carpet Machine Scrub', 'Executive Cabins', 'All Amenities'],
        isActive: true
      }
    ],
    createdAt: '2026-01-20T00:00:00.000Z'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'stf-1',
    staffId: 'CF-STF-101',
    name: 'Rajesh Kumar',
    mobile: '+91 98234 11029',
    email: 'rajesh.cleaner@cleaningflash.com',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    serviceArea: 'Central & South City',
    skills: ['Full House Deep Clean', 'Machine Floor Scrubbing', 'Sofa Extraction'],
    rating: 4.95,
    completedJobs: 184,
    status: 'active',
    joinedDate: '2024-03-15'
  },
  {
    id: 'stf-2',
    staffId: 'CF-STF-102',
    name: 'Sunita Devi',
    mobile: '+91 97182 34910',
    email: 'sunita.devi@cleaningflash.com',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    serviceArea: 'North Sector & Suburbs',
    skills: ['Kitchen Degreasing', 'Bathroom Descaling', 'Home Hygiene'],
    rating: 4.88,
    completedJobs: 162,
    status: 'active',
    joinedDate: '2024-05-10'
  },
  {
    id: 'stf-3',
    staffId: 'CF-STF-103',
    name: 'Vikram Singh',
    mobile: '+91 99281 74012',
    email: 'vikram.singh@cleaningflash.com',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    serviceArea: 'East IT Corridor',
    skills: ['Commercial Cleaning', 'Glass Partitions', 'Floor Buffing'],
    rating: 4.92,
    completedJobs: 215,
    status: 'active',
    joinedDate: '2023-11-20'
  },
  {
    id: 'stf-4',
    staffId: 'CF-STF-104',
    name: 'Amit Sharma',
    mobile: '+91 98330 55182',
    email: 'amit.sharma@cleaningflash.com',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    serviceArea: 'West Tech Parks',
    skills: ['Upholstery Shampoo', 'Carpet Detailing', 'Mattress UV Sanitization'],
    rating: 4.85,
    completedJobs: 139,
    status: 'busy',
    joinedDate: '2024-08-01'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-flash200',
    code: 'FLASH200',
    discountType: 'flat',
    discountValue: 200,
    minimumOrder: 1500,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 1000,
    usedCount: 142,
    isActive: true,
    description: 'Flat ₹200 OFF on deep cleaning orders above ₹1,500'
  },
  {
    id: 'cpn-first15',
    code: 'FIRST15',
    discountType: 'percentage',
    discountValue: 15,
    minimumOrder: 999,
    maximumDiscount: 500,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 2000,
    usedCount: 388,
    isActive: true,
    description: '15% OFF for new customers up to ₹500 discount'
  },
  {
    id: 'cpn-mega500',
    code: 'MEGA500',
    discountType: 'flat',
    discountValue: 500,
    minimumOrder: 3000,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 79,
    isActive: true,
    description: 'Super discount ₹500 OFF on premium packages above ₹3,000'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'off-spring',
    bannerImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
    heading: 'Seasonal Full House Deep Clean Festival',
    description: 'Get an extra flat ₹500 OFF on 2 BHK and 3 BHK packages + Free Refrigerator Interior Wipe.',
    discountBadge: 'Save ₹500',
    couponCode: 'MEGA500',
    ctaText: 'Book Deep Clean',
    ctaLink: '/services/full-house-deep-cleaning',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    isActive: true
  },
  {
    id: 'off-kitchen-bath',
    bannerImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
    heading: 'Kitchen + 2 Bathrooms Combo Special',
    description: 'Book kitchen degreasing and 2 washroom descaling together and enjoy 15% instant discount.',
    discountBadge: '15% OFF',
    couponCode: 'FIRST15',
    ctaText: 'Explore Combo',
    ctaLink: '/services/bathroom-deep-cleaning',
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    isActive: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bookingId: 'CF-10928',
    customerId: 'cust-101',
    customerName: 'Ananya Deshmukh',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    serviceId: 'srv-full-house',
    serviceName: 'Full House Deep Cleaning',
    rating: 5,
    comment: 'The team led by Rajesh was phenomenal! They arrived sharp at 8:00 AM with their floor scrubbers and vacuum machines. My balcony tiles and kitchen exhaust look brand new.',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    isApproved: true,
    createdAt: '2026-08-20T11:30:00.000Z'
  },
  {
    id: 'rev-2',
    bookingId: 'CF-10931',
    customerId: 'cust-102',
    customerName: 'Rahul Mehta',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    serviceId: 'srv-bathroom-deep',
    serviceName: 'Bathroom Deep Cleaning',
    rating: 5,
    comment: 'Hard water stains that were stuck on my glass partition for 2 years were completely scrubbed away without any scratching. Very courteous staff and clear pricing.',
    isApproved: true,
    createdAt: '2026-08-22T14:15:00.000Z'
  },
  {
    id: 'rev-3',
    bookingId: 'CF-10940',
    customerId: 'cust-103',
    customerName: 'Priya Sundaram',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    serviceId: 'srv-sofa-cleaning',
    serviceName: 'Sofa & Upholstery Shampooing',
    rating: 5,
    comment: 'Our cream fabric sofa had coffee marks and pet fur. Amit extracted so much dust and the fabric smells fresh now. Extremely satisfied with Cleaning Flash!',
    isApproved: true,
    createdAt: '2026-08-25T16:45:00.000Z'
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What services do you provide at Cleaning Flash?',
    answer: 'We provide full house deep cleaning, modular kitchen degreasing, bathroom descaling & sanitization, sofa/mattress/carpet shampooing, and commercial office cleaning services.',
    category: 'General',
    order: 1,
    isActive: true
  },
  {
    id: 'faq-2',
    question: 'How do I book a cleaning slot?',
    answer: 'Simply select your desired service, choose your preferred package and date/time slot, enter your address, apply any discount coupon, and confirm with Online Payment or Cash on Service.',
    category: 'Booking',
    order: 2,
    isActive: true
  },
  {
    id: 'faq-3',
    question: 'Can I reschedule or cancel my booking?',
    answer: 'Yes! You can reschedule or cancel directly from your "My Bookings" customer dashboard up to 4 hours before your scheduled appointment at zero penalty.',
    category: 'Booking',
    order: 3,
    isActive: true
  },
  {
    id: 'faq-4',
    question: 'What payment methods are supported?',
    answer: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Service once the cleaning is finished to your satisfaction.',
    category: 'Payment',
    order: 4,
    isActive: true
  },
  {
    id: 'faq-5',
    question: 'Do your cleaners bring all equipment and chemicals?',
    answer: 'Yes, 100%. Our teams arrive with industrial vacuum extractors, floor rotary buffers, ladders, microfiber cloths, and specialized eco-friendly chemicals. You only need to provide power and water.',
    category: 'Services',
    order: 5,
    isActive: true
  },
  {
    id: 'faq-6',
    question: 'Are your cleaning professionals verified and background checked?',
    answer: 'Every cleaner on the Cleaning Flash team undergoes police verification, background validation, and 40+ hours of standardized practical training on surface safety and hygiene protocols.',
    category: 'Safety',
    order: 6,
    isActive: true
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'cf-bkg-1',
    bookingId: 'CF-90214',
    customerId: 'cust-demo-1',
    customerName: 'Omkar Sonawane',
    customerMobile: '+91 98765 43210',
    customerEmail: 'omkarsonawane740@gmail.com',
    serviceId: 'srv-full-house',
    serviceName: 'Full House Deep Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
    packageId: 'pkg-full-2bhk',
    packageName: '2 BHK Deep Clean',
    packagePrice: 2499,
    addons: [
      {
        id: 'addon-sofa-2seater',
        name: 'Sofa Cleaning (2 Seater)',
        price: 499,
        quantity: 1
      }
    ],
    address: {
      id: 'addr-1',
      type: 'Home',
      flatNo: 'Flat 402',
      building: 'Sunrise Heights, Tower B',
      address: 'Near Central Green Park, Baner',
      area: 'Baner',
      city: 'Pune',
      pincode: '411045',
      landmark: 'Opposite State Bank',
      isDefault: true
    },
    date: '2026-08-28',
    timeSlot: '10 AM - 12 PM',
    subtotal: 2998,
    discount: 200,
    couponCode: 'FLASH200',
    tax: 140,
    totalAmount: 2938,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    bookingStatus: 'assigned',
    assignedStaffId: 'stf-1',
    assignedStaffName: 'Rajesh Kumar',
    assignedStaffPhone: '+91 98234 11029',
    assignmentTime: '2026-08-27T08:30:00.000Z',
    customerNotes: 'Please pay extra attention to the balcony tracks.',
    adminNotes: 'Assigned Rajesh Kumar. Industrial buffer requested.',
    createdAt: '2026-08-26T10:14:00.000Z',
    updatedAt: '2026-08-27T08:30:00.000Z'
  },
  {
    id: 'cf-bkg-2',
    bookingId: 'CF-90215',
    customerId: 'cust-demo-2',
    customerName: 'Pooja Nair',
    customerMobile: '+91 91234 56780',
    customerEmail: 'pooja.nair@example.com',
    serviceId: 'srv-kitchen-deep',
    serviceName: 'Kitchen Deep Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    packageId: 'pkg-kitch-premium',
    packageName: 'Premium Kitchen + Empty Cabinet Interior',
    packagePrice: 1499,
    addons: [],
    address: {
      id: 'addr-2',
      type: 'Home',
      flatNo: 'B-12',
      building: 'Palm Grove Residency',
      address: 'MG Road, Kothrud',
      area: 'Kothrud',
      city: 'Pune',
      pincode: '411038',
      isDefault: true
    },
    date: '2026-08-27',
    timeSlot: '2 PM - 4 PM',
    subtotal: 1499,
    discount: 0,
    tax: 75,
    totalAmount: 1574,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    bookingStatus: 'on_the_way',
    assignedStaffId: 'stf-2',
    assignedStaffName: 'Sunita Devi',
    assignedStaffPhone: '+91 97182 34910',
    assignmentTime: '2026-08-27T13:00:00.000Z',
    customerNotes: 'Heavy grease on chimney filter.',
    adminNotes: 'Sunita is on the way with specialized caustic degreaser.',
    createdAt: '2026-08-27T07:15:00.000Z',
    updatedAt: '2026-08-27T13:10:00.000Z'
  },
  {
    id: 'cf-bkg-3',
    bookingId: 'CF-90210',
    customerId: 'cust-demo-3',
    customerName: 'Sanjay Deshpande',
    customerMobile: '+91 98450 12890',
    customerEmail: 'sanjay.d@example.com',
    serviceId: 'srv-bathroom-deep',
    serviceName: 'Bathroom Deep Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
    packageId: 'pkg-bath-2',
    packageName: '2 Bathrooms Combo Clean',
    packagePrice: 999,
    addons: [],
    address: {
      id: 'addr-3',
      type: 'Home',
      flatNo: 'Flat 801',
      building: 'Green Meadows',
      address: 'Aundh Main Road',
      area: 'Aundh',
      city: 'Pune',
      pincode: '411007',
      isDefault: true
    },
    date: '2026-08-25',
    timeSlot: '10 AM - 12 PM',
    subtotal: 999,
    discount: 100,
    couponCode: 'FIRST15',
    tax: 45,
    totalAmount: 944,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    bookingStatus: 'completed',
    assignedStaffId: 'stf-1',
    assignedStaffName: 'Rajesh Kumar',
    customerNotes: 'Please ensure shower glass is sparkling.',
    adminNotes: 'Completed on time. Customer gave 5-star review.',
    reviewSubmitted: true,
    createdAt: '2026-08-24T09:00:00.000Z',
    updatedAt: '2026-08-25T12:00:00.000Z'
  },
  {
    id: 'cf-bkg-4',
    bookingId: 'CF-90216',
    customerId: 'cust-demo-4',
    customerName: 'TechVision Labs',
    customerMobile: '+91 99887 76655',
    customerEmail: 'admin@techvision.io',
    serviceId: 'srv-office-commercial',
    serviceName: 'Office & Commercial Deep Cleaning',
    serviceImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    packageId: 'pkg-off-med',
    packageName: 'Medium Office (Up to 2,500 sq.ft.)',
    packagePrice: 6499,
    addons: [],
    address: {
      id: 'addr-4',
      type: 'Office',
      flatNo: '3rd Floor, Unit 302',
      building: 'EON IT Park Phase 1',
      address: 'Kharadi IT corridor',
      area: 'Kharadi',
      city: 'Pune',
      pincode: '411014',
      isDefault: true
    },
    date: '2026-08-30',
    timeSlot: '8 AM - 10 AM',
    subtotal: 6499,
    discount: 500,
    couponCode: 'MEGA500',
    tax: 300,
    totalAmount: 6299,
    paymentMethod: 'online',
    paymentStatus: 'paid',
    bookingStatus: 'pending',
    customerNotes: 'Need cleaning before Monday all-hands meeting.',
    adminNotes: 'Pending staff assignment for 5-member commercial crew.',
    createdAt: '2026-08-27T04:20:00.000Z',
    updatedAt: '2026-08-27T04:20:00.000Z'
  }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  business: {
    companyName: 'Cleaning Flash',
    tagline: 'Professional Cleaning. Fast. Reliable.',
    phone: '+91 80000 25326',
    whatsapp: '+91 80000 25326',
    email: 'support@cleaningflash.com',
    address: 'Cleaning Flash HQ, Level 4, Stellar Commercial Center, Senapati Bapat Road',
    city: 'Pune, Maharashtra 411016',
    workingHours: 'Mon - Sun: 7:00 AM – 9:00 PM',
    emergencyAvailable: true
  },
  booking: {
    advanceBookingHours: 2,
    allowCancellationHours: 4,
    allowRescheduleHours: 4,
    timeSlots: [
      '8 AM - 10 AM',
      '10 AM - 12 PM',
      '12 PM - 2 PM',
      '2 PM - 4 PM',
      '4 PM - 6 PM',
      '6 PM - 8 PM'
    ],
    taxRatePercent: 5,
    autoAssignStaff: false
  },
  payment: {
    onlinePaymentEnabled: true,
    cashPaymentEnabled: true,
    razorpayKeyId: 'rzp_test_cleaningflash_live_mock'
  },
  hero: {
    heading: 'Professional Cleaning at Your Doorstep',
    subheading: 'Reliable home and commercial cleaning services delivered by background-verified professionals with industrial equipment.',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    primaryCtaText: 'Book a Service',
    secondaryCtaText: 'Explore Services',
    badgeText: '✨ Rated 4.9/5 by over 12,500+ happy homes'
  },
  about: {
    title: 'About Cleaning Flash',
    story: 'Cleaning Flash was founded with a singular commitment: bringing hospital-grade hygiene, prompt reliability, and transparent pricing to everyday residential and commercial spaces. What started with a passionate 3-person team has grown into the region’s premier on-demand cleaning service network.',
    mission: 'To elevate living and working environments through standardized eco-friendly cleaning, well-trained team members, and seamless technology.',
    qualityPromise: '100% Satisfaction Guaranteed. If you are not delighted with any cleaned area, we re-clean it within 24 hours at no extra charge.',
    teamCount: '85+ Trained Pros',
    servedCount: '15,000+ Homes Cleaned',
    ratingScore: '4.9/5 Average Rating'
  },
  social: {
    instagram: 'https://instagram.com/cleaningflash',
    facebook: 'https://facebook.com/cleaningflash',
    youtube: 'https://youtube.com/@cleaningflash',
    twitter: 'https://twitter.com/cleaningflash'
  },
  footer: {
    aboutText: 'Cleaning Flash is your trusted partner for high-standard residential, upholstery, and commercial cleaning solutions.',
    copyrightText: '© 2026 Cleaning Flash Technologies Private Limited. All rights reserved.'
  }
};
