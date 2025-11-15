export const popularIconList = [
  "Bed",
  "Car",
  "Camping",
  "Hiking",
  "Biking",
  "House",
] as const;

export type PopularIcon = (typeof popularIconList)[number];

// Category constants for organization
export const ICON_CATEGORIES = {
  transport: "Transport",
  accommodation: "Accommodation",
  food: "Food & Dining",
  places: "Places",
  activities: "Activities & Recreation",
  nature: "Nature & Outdoors",
  sports: "Sports & Fitness",
  culture: "Culture & Events",
  photography: "Photography & Art",
  utilities: "Utilities & Services",
  landmarks: "Landmarks & Heritage",
  shopping: "Shopping & Commerce",
  travel: "Travel & Navigation",
  seasonal: "Seasonal & Weather",
  other: "Map Controls & Other",
} as const;

export type IconCategory = keyof typeof ICON_CATEGORIES;

export interface IconDefinition {
  id: string;
  title: string;
  categories: readonly string[];
  tags: readonly string[];
}

export const iconsList = [
  // ============================================
  // TRANSPORT (20 icons)
  // ============================================
  {
    id: "train",
    title: "Train",
    categories: ["transport"],
    tags: ["train", "rail", "transit", "public-transport", "travel"],
  },
  {
    id: "car",
    title: "Car",
    categories: ["transport"],
    tags: ["car", "automobile", "vehicle", "drive", "road-trip"],
  },
  {
    id: "taxi",
    title: "Taxi",
    categories: ["transport"],
    tags: ["taxi", "cab", "ride", "transport", "city"],
  },
  {
    id: "plane",
    title: "Plane",
    categories: ["transport"],
    tags: ["plane", "airplane", "flight", "airport", "travel"],
  },
  {
    id: "ferry",
    title: "Ferry",
    categories: ["transport"],
    tags: ["ferry", "boat", "water-transport", "crossing", "harbor"],
  },
  {
    id: "motorbike",
    title: "Motorbike",
    categories: ["transport"],
    tags: ["motorbike", "motorcycle", "bike", "ride", "touring"],
  },
  {
    id: "bicycle",
    title: "Bicycle",
    categories: ["transport", "sports"],
    tags: ["bicycle", "bike", "cycling", "pedal", "eco-friendly"],
  },
  {
    id: "bus",
    title: "Bus",
    categories: ["transport"],
    tags: ["bus", "coach", "public-transport", "transit", "travel"],
  },
  {
    id: "truck",
    title: "Truck",
    categories: ["transport"],
    tags: ["truck", "lorry", "cargo", "vehicle", "transport"],
  },
  {
    id: "helicopter",
    title: "Helicopter",
    categories: ["transport"],
    tags: ["helicopter", "aircraft", "flight", "aerial", "emergency"],
  },
  {
    id: "boat",
    title: "Boat",
    categories: ["transport", "activities"],
    tags: ["boat", "vessel", "water", "sailing", "marine"],
  },
  {
    id: "yacht",
    title: "Yacht",
    categories: ["transport", "activities"],
    tags: ["yacht", "boat", "luxury", "sailing", "marine"],
  },
  {
    id: "scooter",
    title: "Scooter",
    categories: ["transport"],
    tags: ["scooter", "moped", "urban", "ride", "city"],
  },
  {
    id: "subway",
    title: "Subway",
    categories: ["transport"],
    tags: ["subway", "metro", "underground", "transit", "urban"],
  },
  {
    id: "cable-car",
    title: "Cable Car",
    categories: ["transport", "activities"],
    tags: ["cable-car", "gondola", "mountain", "scenic", "aerial"],
  },
  {
    id: "tram",
    title: "Tram",
    categories: ["transport"],
    tags: ["tram", "streetcar", "trolley", "transit", "urban"],
  },
  {
    id: "caravan",
    title: "Caravan",
    categories: ["transport", "accommodation"],
    tags: ["caravan", "rv", "camper", "motorhome", "travel"],
  },
  {
    id: "van",
    title: "Van",
    categories: ["transport"],
    tags: ["van", "minibus", "vehicle", "transport", "camper"],
  },
  {
    id: "ambulance",
    title: "Ambulance",
    categories: ["transport", "utilities"],
    tags: ["ambulance", "emergency", "medical", "hospital", "rescue"],
  },
  {
    id: "speedboat",
    title: "Speedboat",
    categories: ["transport", "activities"],
    tags: ["speedboat", "boat", "water", "fast", "recreation"],
  },

  // ============================================
  // ACCOMMODATION (15 icons)
  // ============================================
  {
    id: "hotel",
    title: "Hotel",
    categories: ["accommodation"],
    tags: ["hotel", "lodging", "stay", "accommodation", "travel"],
  },
  {
    id: "motel",
    title: "Motel",
    categories: ["accommodation"],
    tags: ["motel", "roadside", "lodging", "stay", "accommodation"],
  },
  {
    id: "house",
    title: "House",
    categories: ["accommodation", "places"],
    tags: ["house", "home", "residence", "stay", "dwelling"],
  },
  {
    id: "cabin",
    title: "Cabin",
    categories: ["accommodation", "nature"],
    tags: ["cabin", "lodge", "cottage", "woods", "retreat"],
  },
  {
    id: "camping",
    title: "Camping",
    categories: ["accommodation", "activities", "nature"],
    tags: ["camping", "tent", "outdoor", "campsite", "nature"],
  },
  {
    id: "bed",
    title: "Bed",
    categories: ["accommodation"],
    tags: ["bed", "sleep", "rest", "lodging", "accommodation"],
  },
  {
    id: "hostel",
    title: "Hostel",
    categories: ["accommodation"],
    tags: ["hostel", "budget", "backpacker", "dorm", "travel"],
  },
  {
    id: "resort",
    title: "Resort",
    categories: ["accommodation", "activities"],
    tags: ["resort", "luxury", "vacation", "spa", "hotel"],
  },
  {
    id: "cottage",
    title: "Cottage",
    categories: ["accommodation", "nature"],
    tags: ["cottage", "cabin", "rural", "countryside", "retreat"],
  },
  {
    id: "lighthouse",
    title: "Lighthouse",
    categories: ["accommodation", "landmarks"],
    tags: ["lighthouse", "beacon", "coast", "maritime", "historic"],
  },
  {
    id: "rv-park",
    title: "RV Park",
    categories: ["accommodation"],
    tags: ["rv-park", "campground", "motorhome", "camping", "hookup"],
  },
  {
    id: "beach-house",
    title: "Beach House",
    categories: ["accommodation", "nature"],
    tags: ["beach-house", "coastal", "vacation", "seaside", "ocean"],
  },
  {
    id: "glamping",
    title: "Glamping",
    categories: ["accommodation", "activities"],
    tags: ["glamping", "luxury-camping", "tent", "outdoor", "comfort"],
  },
  {
    id: "farmhouse",
    title: "Farmhouse",
    categories: ["accommodation"],
    tags: ["farmhouse", "rural", "countryside", "farm", "agritourism"],
  },
  {
    id: "apartment",
    title: "Apartment",
    categories: ["accommodation"],
    tags: ["apartment", "flat", "rental", "stay", "accommodation"],
  },

  // ============================================
  // FOOD & DINING (30 icons)
  // ============================================
  {
    id: "restaurant",
    title: "Restaurant",
    categories: ["food", "places"],
    tags: ["restaurant", "dining", "food", "meal", "eat"],
  },
  {
    id: "cafe",
    title: "Cafe",
    categories: ["food", "places"],
    tags: ["cafe", "coffee", "coffeehouse", "snack", "casual"],
  },
  {
    id: "bar",
    title: "Bar",
    categories: ["food", "places"],
    tags: ["bar", "pub", "drinks", "nightlife", "alcohol"],
  },
  {
    id: "pizza",
    title: "Pizza",
    categories: ["food"],
    tags: ["pizza", "pizzeria", "italian", "food", "restaurant"],
  },
  {
    id: "burger",
    title: "Burger",
    categories: ["food"],
    tags: ["burger", "hamburger", "fast-food", "grill", "american"],
  },
  {
    id: "sandwich",
    title: "Sandwich",
    categories: ["food"],
    tags: ["sandwich", "deli", "sub", "lunch", "food"],
  },
  {
    id: "ice-cream",
    title: "Ice Cream",
    categories: ["food"],
    tags: ["ice-cream", "gelato", "dessert", "sweet", "frozen"],
  },
  {
    id: "bakery",
    title: "Bakery",
    categories: ["food", "shopping"],
    tags: ["bakery", "bread", "pastry", "cake", "baked-goods"],
  },
  {
    id: "coffee",
    title: "Coffee",
    categories: ["food"],
    tags: ["coffee", "espresso", "cafe", "beverage", "drink"],
  },
  {
    id: "tea",
    title: "Tea",
    categories: ["food"],
    tags: ["tea", "teahouse", "beverage", "drink", "cafe"],
  },
  {
    id: "wine",
    title: "Wine",
    categories: ["food", "activities"],
    tags: ["wine", "winery", "vineyard", "tasting", "alcohol"],
  },
  {
    id: "beer",
    title: "Beer",
    categories: ["food", "activities"],
    tags: ["beer", "brewery", "craft-beer", "pub", "alcohol"],
  },
  {
    id: "cocktail",
    title: "Cocktail",
    categories: ["food"],
    tags: ["cocktail", "bar", "drinks", "mixology", "alcohol"],
  },
  {
    id: "sushi",
    title: "Sushi",
    categories: ["food"],
    tags: ["sushi", "japanese", "seafood", "restaurant", "asian"],
  },
  {
    id: "taco",
    title: "Taco",
    categories: ["food"],
    tags: ["taco", "mexican", "food", "restaurant", "burrito"],
  },
  {
    id: "pasta",
    title: "Pasta",
    categories: ["food"],
    tags: ["pasta", "italian", "food", "restaurant", "noodles"],
  },
  {
    id: "salad",
    title: "Salad",
    categories: ["food"],
    tags: ["salad", "healthy", "vegetables", "fresh", "food"],
  },
  {
    id: "barbecue",
    title: "Barbecue",
    categories: ["food", "activities"],
    tags: ["barbecue", "bbq", "grill", "meat", "outdoor"],
  },
  {
    id: "donut",
    title: "Donut",
    categories: ["food"],
    tags: ["donut", "doughnut", "dessert", "sweet", "bakery"],
  },
  {
    id: "brunch",
    title: "Brunch",
    categories: ["food"],
    tags: ["brunch", "breakfast", "lunch", "meal", "restaurant"],
  },
  {
    id: "buffet",
    title: "Buffet",
    categories: ["food"],
    tags: ["buffet", "all-you-can-eat", "food", "restaurant", "variety"],
  },
  {
    id: "food-truck",
    title: "Food Truck",
    categories: ["food"],
    tags: ["food-truck", "street-food", "mobile", "vendor", "casual"],
  },
  {
    id: "deli",
    title: "Deli",
    categories: ["food", "shopping"],
    tags: ["deli", "delicatessen", "sandwich", "food", "market"],
  },
  {
    id: "dessert",
    title: "Dessert",
    categories: ["food"],
    tags: ["dessert", "sweet", "cake", "pastry", "treat"],
  },
  {
    id: "smoothie",
    title: "Smoothie",
    categories: ["food"],
    tags: ["smoothie", "juice", "healthy", "drink", "fruit"],
  },
  {
    id: "soup",
    title: "Soup",
    categories: ["food"],
    tags: ["soup", "broth", "hot", "comfort-food", "meal"],
  },
  {
    id: "fish-market",
    title: "Fish Market",
    categories: ["food", "shopping"],
    tags: ["fish-market", "seafood", "fresh", "market", "ocean"],
  },
  {
    id: "steakhouse",
    title: "Steakhouse",
    categories: ["food"],
    tags: ["steakhouse", "steak", "meat", "grill", "restaurant"],
  },
  {
    id: "breakfast",
    title: "Breakfast",
    categories: ["food"],
    tags: ["breakfast", "morning", "meal", "cafe", "food"],
  },
  {
    id: "noodles",
    title: "Noodles",
    categories: ["food"],
    tags: ["noodles", "ramen", "asian", "restaurant", "soup"],
  },

  // ============================================
  // ACTIVITIES & RECREATION (35 icons)
  // ============================================
  {
    id: "hiking",
    title: "Hiking",
    categories: ["activities", "nature", "sports"],
    tags: ["hiking", "trail", "outdoor", "walking", "nature"],
  },
  {
    id: "walking",
    title: "Walking",
    categories: ["activities", "sports"],
    tags: ["walking", "stroll", "pedestrian", "exercise", "outdoor"],
  },
  {
    id: "biking",
    title: "Biking",
    categories: ["activities", "sports"],
    tags: ["biking", "cycling", "bicycle", "ride", "outdoor"],
  },
  {
    id: "swimming",
    title: "Swimming",
    categories: ["activities", "sports"],
    tags: ["swimming", "pool", "water", "sport", "recreation"],
  },
  {
    id: "sightseeing",
    title: "Sightseeing",
    categories: ["activities", "travel"],
    tags: ["sightseeing", "tourism", "attractions", "explore", "landmarks"],
  },
  {
    id: "theater",
    title: "Theater",
    categories: ["activities", "culture"],
    tags: ["theater", "performance", "show", "arts", "entertainment"],
  },
  {
    id: "concert",
    title: "Concert",
    categories: ["activities", "culture"],
    tags: ["concert", "music", "live", "performance", "event"],
  },
  {
    id: "festival",
    title: "Festival",
    categories: ["activities", "culture"],
    tags: ["festival", "event", "celebration", "music", "cultural"],
  },
  {
    id: "shopping",
    title: "Shopping",
    categories: ["activities", "shopping"],
    tags: ["shopping", "retail", "store", "mall", "browse"],
  },
  {
    id: "golf",
    title: "Golf",
    categories: ["activities", "sports"],
    tags: ["golf", "course", "sport", "recreation", "outdoor"],
  },
  {
    id: "tennis",
    title: "Tennis",
    categories: ["activities", "sports"],
    tags: ["tennis", "court", "sport", "racquet", "recreation"],
  },
  {
    id: "soccer",
    title: "Soccer",
    categories: ["activities", "sports"],
    tags: ["soccer", "football", "sport", "field", "game"],
  },
  {
    id: "football",
    title: "Football",
    categories: ["activities", "sports"],
    tags: ["football", "american-football", "sport", "field", "game"],
  },
  {
    id: "basketball",
    title: "Basketball",
    categories: ["activities", "sports"],
    tags: ["basketball", "court", "sport", "hoop", "game"],
  },
  {
    id: "volleyball",
    title: "Volleyball",
    categories: ["activities", "sports"],
    tags: ["volleyball", "court", "sport", "beach", "game"],
  },
  {
    id: "fishing",
    title: "Fishing",
    categories: ["activities", "nature"],
    tags: ["fishing", "angling", "water", "outdoor", "recreation"],
  },
  {
    id: "rock-climbing",
    title: "Rock Climbing",
    categories: ["activities", "sports", "nature"],
    tags: ["rock-climbing", "climbing", "outdoor", "adventure", "sport"],
  },
  {
    id: "skateboarding",
    title: "Skateboarding",
    categories: ["activities", "sports"],
    tags: ["skateboarding", "skate", "sport", "park", "urban"],
  },
  {
    id: "surfing",
    title: "Surfing",
    categories: ["activities", "sports", "nature"],
    tags: ["surfing", "surf", "ocean", "beach", "water-sport"],
  },
  {
    id: "kayaking",
    title: "Kayaking",
    categories: ["activities", "sports", "nature"],
    tags: ["kayaking", "kayak", "water", "paddle", "outdoor"],
  },
  {
    id: "canoeing",
    title: "Canoeing",
    categories: ["activities", "sports", "nature"],
    tags: ["canoeing", "canoe", "water", "paddle", "outdoor"],
  },
  {
    id: "zip-lining",
    title: "Zip Lining",
    categories: ["activities", "nature"],
    tags: ["zip-lining", "zipline", "adventure", "outdoor", "aerial"],
  },
  {
    id: "paragliding",
    title: "Paragliding",
    categories: ["activities", "sports"],
    tags: ["paragliding", "flying", "adventure", "aerial", "sport"],
  },
  {
    id: "bungee-jumping",
    title: "Bungee Jumping",
    categories: ["activities"],
    tags: ["bungee-jumping", "extreme", "adventure", "jump", "thrill"],
  },
  {
    id: "horseback-riding",
    title: "Horseback Riding",
    categories: ["activities", "nature"],
    tags: ["horseback-riding", "horse", "equestrian", "outdoor", "trail"],
  },
  {
    id: "paintball",
    title: "Paintball",
    categories: ["activities", "sports"],
    tags: ["paintball", "game", "sport", "outdoor", "recreation"],
  },
  {
    id: "archery",
    title: "Archery",
    categories: ["activities", "sports"],
    tags: ["archery", "bow", "arrow", "sport", "target"],
  },
  {
    id: "bowling",
    title: "Bowling",
    categories: ["activities", "sports"],
    tags: ["bowling", "alley", "sport", "indoor", "recreation"],
  },
  {
    id: "roller-skating",
    title: "Roller Skating",
    categories: ["activities", "sports"],
    tags: ["roller-skating", "skate", "rink", "recreation", "sport"],
  },
  {
    id: "ice-skating",
    title: "Ice Skating",
    categories: ["activities", "sports", "seasonal"],
    tags: ["ice-skating", "skating", "rink", "winter", "sport"],
  },
  {
    id: "scuba-diving",
    title: "Scuba Diving",
    categories: ["activities", "sports", "nature"],
    tags: ["scuba-diving", "diving", "underwater", "ocean", "sport"],
  },
  {
    id: "snorkeling",
    title: "Snorkeling",
    categories: ["activities", "nature"],
    tags: ["snorkeling", "underwater", "ocean", "reef", "swimming"],
  },
  {
    id: "skiing",
    title: "Skiing",
    categories: ["activities", "sports", "seasonal"],
    tags: ["skiing", "ski", "snow", "winter", "mountain"],
  },
  {
    id: "snowboarding",
    title: "Snowboarding",
    categories: ["activities", "sports", "seasonal"],
    tags: ["snowboarding", "snowboard", "snow", "winter", "mountain"],
  },
  {
    id: "amusement-park",
    title: "Amusement Park",
    categories: ["activities", "places"],
    tags: ["amusement-park", "theme-park", "rides", "entertainment", "fun"],
  },

  // ============================================
  // NATURE & OUTDOORS (25 icons)
  // ============================================
  {
    id: "mountain",
    title: "Mountain",
    categories: ["nature", "photography"],
    tags: ["mountain", "peak", "alpine", "scenic", "hiking", "outdoor"],
  },
  {
    id: "beach",
    title: "Beach",
    categories: ["nature", "places"],
    tags: ["beach", "coast", "ocean", "sand", "seaside", "relaxation"],
  },
  {
    id: "park",
    title: "Park",
    categories: ["nature", "places"],
    tags: ["park", "green-space", "outdoor", "recreation", "nature"],
  },
  {
    id: "forest",
    title: "Forest",
    categories: ["nature"],
    tags: ["forest", "woods", "trees", "wilderness", "hiking", "nature"],
  },
  {
    id: "waterfall",
    title: "Waterfall",
    categories: ["nature", "photography"],
    tags: ["waterfall", "cascade", "water", "scenic", "hiking", "natural"],
  },
  {
    id: "lake",
    title: "Lake",
    categories: ["nature"],
    tags: ["lake", "water", "scenic", "fishing", "outdoor", "peaceful"],
  },
  {
    id: "river",
    title: "River",
    categories: ["nature"],
    tags: ["river", "water", "stream", "flow", "outdoor", "nature"],
  },
  {
    id: "ocean",
    title: "Ocean",
    categories: ["nature"],
    tags: ["ocean", "sea", "water", "marine", "coastal", "beach"],
  },
  {
    id: "glacier",
    title: "Glacier",
    categories: ["nature"],
    tags: ["glacier", "ice", "mountain", "arctic", "scenic", "nature"],
  },
  {
    id: "desert",
    title: "Desert",
    categories: ["nature"],
    tags: ["desert", "arid", "sand", "dunes", "scenic", "dry"],
  },
  {
    id: "valley",
    title: "Valley",
    categories: ["nature"],
    tags: ["valley", "scenic", "landscape", "nature", "hiking", "mountain"],
  },
  {
    id: "volcano",
    title: "Volcano",
    categories: ["nature", "landmarks"],
    tags: ["volcano", "mountain", "crater", "geology", "natural", "scenic"],
  },
  {
    id: "cave",
    title: "Cave",
    categories: ["nature", "activities"],
    tags: ["cave", "cavern", "underground", "exploration", "geology", "adventure"],
  },
  {
    id: "meadow",
    title: "Meadow",
    categories: ["nature"],
    tags: ["meadow", "field", "grassland", "flowers", "scenic", "peaceful"],
  },
  {
    id: "wetland",
    title: "Wetland",
    categories: ["nature"],
    tags: ["wetland", "marsh", "swamp", "ecosystem", "wildlife", "nature"],
  },
  {
    id: "island",
    title: "Island",
    categories: ["nature", "travel"],
    tags: ["island", "tropical", "ocean", "paradise", "beach", "remote"],
  },
  {
    id: "cliff",
    title: "Cliff",
    categories: ["nature", "photography"],
    tags: ["cliff", "rock-face", "scenic", "mountain", "dramatic", "edge"],
  },
  {
    id: "hill",
    title: "Hill",
    categories: ["nature"],
    tags: ["hill", "slope", "elevation", "scenic", "hiking", "viewpoint"],
  },
  {
    id: "trail",
    title: "Trail",
    categories: ["nature", "activities", "travel"],
    tags: ["trail", "path", "hiking", "walking", "outdoor", "route"],
  },
  {
    id: "scenic-overlook",
    title: "Scenic Overlook",
    categories: ["nature", "photography", "travel"],
    tags: ["overlook", "viewpoint", "scenic", "vista", "panorama", "photography"],
  },
  {
    id: "picnic-area",
    title: "Picnic Area",
    categories: ["nature", "activities"],
    tags: ["picnic", "outdoor", "park", "recreation", "food", "family"],
  },
  {
    id: "wildlife-sanctuary",
    title: "Wildlife Sanctuary",
    categories: ["nature"],
    tags: ["wildlife", "sanctuary", "animals", "conservation", "nature", "preserve"],
  },
  {
    id: "botanical-garden",
    title: "Botanical Garden",
    categories: ["nature", "places"],
    tags: ["botanical-garden", "plants", "flowers", "garden", "nature", "peaceful"],
  },
  {
    id: "national-park",
    title: "National Park",
    categories: ["nature", "travel"],
    tags: ["national-park", "protected", "wilderness", "nature", "hiking", "camping"],
  },
  {
    id: "hot-spring",
    title: "Hot Spring",
    categories: ["nature", "activities"],
    tags: ["hot-spring", "thermal", "spa", "relaxation", "nature", "water"],
  },

  // ============================================
  // SPORTS & FITNESS (20 icons)
  // ============================================
  {
    id: "running",
    title: "Running",
    categories: ["sports", "activities"],
    tags: ["running", "jogging", "exercise", "fitness", "sport", "outdoor"],
  },
  {
    id: "gym",
    title: "Gym",
    categories: ["sports", "places"],
    tags: ["gym", "fitness", "workout", "exercise", "training", "health"],
  },
  {
    id: "yoga",
    title: "Yoga",
    categories: ["sports", "activities"],
    tags: ["yoga", "meditation", "wellness", "fitness", "exercise", "mindfulness"],
  },
  {
    id: "pilates",
    title: "Pilates",
    categories: ["sports", "activities"],
    tags: ["pilates", "exercise", "fitness", "core", "training", "workout"],
  },
  {
    id: "crossfit",
    title: "CrossFit",
    categories: ["sports"],
    tags: ["crossfit", "fitness", "workout", "gym", "training", "exercise"],
  },
  {
    id: "boxing",
    title: "Boxing",
    categories: ["sports"],
    tags: ["boxing", "martial-arts", "gym", "sport", "training", "fitness"],
  },
  {
    id: "weightlifting",
    title: "Weightlifting",
    categories: ["sports"],
    tags: ["weightlifting", "gym", "strength", "training", "fitness", "barbell"],
  },
  {
    id: "rowing",
    title: "Rowing",
    categories: ["sports"],
    tags: ["rowing", "crew", "water", "sport", "fitness", "cardio"],
  },
  {
    id: "climbing-wall",
    title: "Climbing Wall",
    categories: ["sports", "activities"],
    tags: ["climbing-wall", "indoor-climbing", "gym", "sport", "training", "adventure"],
  },
  {
    id: "skate-park",
    title: "Skate Park",
    categories: ["sports", "places"],
    tags: ["skate-park", "skateboard", "bmx", "sport", "outdoor", "recreation"],
  },
  {
    id: "tennis-court",
    title: "Tennis Court",
    categories: ["sports", "places"],
    tags: ["tennis-court", "tennis", "sport", "recreation", "outdoor", "court"],
  },
  {
    id: "basketball-court",
    title: "Basketball Court",
    categories: ["sports", "places"],
    tags: ["basketball-court", "basketball", "sport", "outdoor", "recreation", "court"],
  },
  {
    id: "soccer-field",
    title: "Soccer Field",
    categories: ["sports", "places"],
    tags: ["soccer-field", "football", "sport", "outdoor", "pitch", "field"],
  },
  {
    id: "running-track",
    title: "Running Track",
    categories: ["sports", "places"],
    tags: ["running-track", "athletics", "sport", "running", "training", "oval"],
  },
  {
    id: "swimming-pool",
    title: "Swimming Pool",
    categories: ["sports", "places"],
    tags: ["swimming-pool", "pool", "swimming", "water", "recreation", "sport"],
  },
  {
    id: "baseball-field",
    title: "Baseball Field",
    categories: ["sports", "places"],
    tags: ["baseball-field", "baseball", "sport", "diamond", "outdoor", "recreation"],
  },
  {
    id: "stadium",
    title: "Stadium",
    categories: ["sports", "places"],
    tags: ["stadium", "arena", "sport", "event", "venue", "game"],
  },
  {
    id: "marathon",
    title: "Marathon",
    categories: ["sports", "culture"],
    tags: ["marathon", "running", "race", "event", "sport", "endurance"],
  },
  {
    id: "bike-race",
    title: "Bike Race",
    categories: ["sports", "culture"],
    tags: ["bike-race", "cycling", "race", "event", "sport", "competition"],
  },
  {
    id: "triathlon",
    title: "Triathlon",
    categories: ["sports", "culture"],
    tags: ["triathlon", "endurance", "race", "swimming", "cycling", "running"],
  },

  // ============================================
  // CULTURE & EVENTS (20 icons)
  // ============================================
  {
    id: "museum",
    title: "Museum",
    categories: ["culture", "places"],
    tags: ["museum", "gallery", "art", "culture", "exhibition", "education"],
  },
  {
    id: "art-gallery",
    title: "Art Gallery",
    categories: ["culture", "places"],
    tags: ["art-gallery", "gallery", "art", "exhibition", "culture", "museum"],
  },
  {
    id: "monument",
    title: "Monument",
    categories: ["culture", "landmarks"],
    tags: ["monument", "memorial", "landmark", "historic", "culture", "statue"],
  },
  {
    id: "music-festival",
    title: "Music Festival",
    categories: ["culture", "activities"],
    tags: ["music-festival", "festival", "concert", "music", "event", "outdoor"],
  },
  {
    id: "parade",
    title: "Parade",
    categories: ["culture", "activities"],
    tags: ["parade", "celebration", "event", "festival", "march", "cultural"],
  },
  {
    id: "fair",
    title: "Fair",
    categories: ["culture", "activities"],
    tags: ["fair", "carnival", "festival", "event", "rides", "entertainment"],
  },
  {
    id: "market",
    title: "Market",
    categories: ["culture", "shopping"],
    tags: ["market", "bazaar", "vendors", "shopping", "local", "food"],
  },
  {
    id: "convention",
    title: "Convention",
    categories: ["culture", "activities"],
    tags: ["convention", "conference", "event", "expo", "trade-show", "gathering"],
  },
  {
    id: "exhibition",
    title: "Exhibition",
    categories: ["culture"],
    tags: ["exhibition", "expo", "show", "display", "art", "event"],
  },
  {
    id: "cultural-center",
    title: "Cultural Center",
    categories: ["culture", "places"],
    tags: ["cultural-center", "arts", "community", "culture", "venue", "events"],
  },
  {
    id: "opera",
    title: "Opera",
    categories: ["culture", "activities"],
    tags: ["opera", "theater", "performance", "arts", "music", "classical"],
  },
  {
    id: "ballet",
    title: "Ballet",
    categories: ["culture", "activities"],
    tags: ["ballet", "dance", "performance", "arts", "theater", "classical"],
  },
  {
    id: "film-festival",
    title: "Film Festival",
    categories: ["culture", "activities"],
    tags: ["film-festival", "cinema", "movies", "event", "screening", "culture"],
  },
  {
    id: "street-fair",
    title: "Street Fair",
    categories: ["culture", "activities"],
    tags: ["street-fair", "festival", "vendors", "food", "event", "community"],
  },
  {
    id: "night-market",
    title: "Night Market",
    categories: ["culture", "shopping"],
    tags: ["night-market", "market", "food", "shopping", "vendors", "nightlife"],
  },
  {
    id: "comedy-club",
    title: "Comedy Club",
    categories: ["culture", "activities"],
    tags: ["comedy-club", "comedy", "entertainment", "nightlife", "show", "venue"],
  },
  {
    id: "jazz-club",
    title: "Jazz Club",
    categories: ["culture", "activities"],
    tags: ["jazz-club", "jazz", "music", "nightlife", "venue", "live-music"],
  },
  {
    id: "gallery-walk",
    title: "Gallery Walk",
    categories: ["culture", "activities"],
    tags: ["gallery-walk", "art", "culture", "event", "galleries", "walking"],
  },
  {
    id: "fireworks",
    title: "Fireworks",
    categories: ["culture", "activities"],
    tags: ["fireworks", "celebration", "event", "festival", "display", "night"],
  },
  {
    id: "sports-event",
    title: "Sports Event",
    categories: ["culture", "sports"],
    tags: ["sports-event", "game", "match", "competition", "sport", "venue"],
  },

  // ============================================
  // PHOTOGRAPHY & ART (15 icons)
  // ============================================
  {
    id: "camera",
    title: "Camera",
    categories: ["photography"],
    tags: ["camera", "photography", "photo", "picture", "lens", "shoot"],
  },
  {
    id: "viewpoint",
    title: "Viewpoint",
    categories: ["photography", "travel", "nature"],
    tags: ["viewpoint", "scenic", "vista", "overlook", "photography", "panorama"],
  },
  {
    id: "photo-spot",
    title: "Photo Spot",
    categories: ["photography", "travel"],
    tags: ["photo-spot", "photography", "scenic", "picture", "instagram", "selfie"],
  },
  {
    id: "sunset-spot",
    title: "Sunset Spot",
    categories: ["photography", "nature"],
    tags: ["sunset", "photography", "scenic", "golden-hour", "viewpoint", "dusk"],
  },
  {
    id: "sunrise-spot",
    title: "Sunrise Spot",
    categories: ["photography", "nature"],
    tags: ["sunrise", "photography", "scenic", "dawn", "morning", "viewpoint"],
  },
  {
    id: "photo-walk",
    title: "Photo Walk",
    categories: ["photography", "activities"],
    tags: ["photo-walk", "photography", "walking", "tour", "scenic", "exploration"],
  },
  {
    id: "urban-art",
    title: "Urban Art",
    categories: ["photography", "culture"],
    tags: ["urban-art", "street-art", "graffiti", "mural", "photography", "art"],
  },
  {
    id: "mural",
    title: "Mural",
    categories: ["photography", "culture"],
    tags: ["mural", "wall-art", "street-art", "painting", "photography", "public-art"],
  },
  {
    id: "sculpture",
    title: "Sculpture",
    categories: ["photography", "culture"],
    tags: ["sculpture", "art", "statue", "installation", "public-art", "photography"],
  },
  {
    id: "architecture",
    title: "Architecture",
    categories: ["photography", "culture"],
    tags: ["architecture", "building", "design", "structure", "photography", "urban"],
  },
  {
    id: "street-photography",
    title: "Street Photography",
    categories: ["photography", "activities"],
    tags: ["street-photography", "urban", "candid", "photography", "city", "life"],
  },
  {
    id: "landscape-photography",
    title: "Landscape Photography",
    categories: ["photography", "nature"],
    tags: ["landscape", "photography", "nature", "scenic", "outdoor", "vista"],
  },
  {
    id: "wildlife-photography",
    title: "Wildlife Photography",
    categories: ["photography", "nature"],
    tags: ["wildlife-photography", "animals", "nature", "photography", "safari", "birds"],
  },
  {
    id: "panorama",
    title: "Panorama",
    categories: ["photography"],
    tags: ["panorama", "panoramic", "wide", "vista", "scenic", "photography"],
  },
  {
    id: "photo-studio",
    title: "Photo Studio",
    categories: ["photography", "places"],
    tags: ["photo-studio", "studio", "photography", "portrait", "professional", "indoor"],
  },

  // ============================================
  // UTILITIES & SERVICES (20 icons)
  // ============================================
  {
    id: "fuel",
    title: "Fuel",
    categories: ["utilities", "places"],
    tags: ["fuel", "gas-station", "petrol", "refuel", "service", "gas"],
  },
  {
    id: "parking",
    title: "Parking",
    categories: ["utilities", "travel"],
    tags: ["parking", "car-park", "lot", "garage", "vehicle", "park"],
  },
  {
    id: "wifi",
    title: "WiFi",
    categories: ["utilities"],
    tags: ["wifi", "internet", "wireless", "connection", "hotspot", "online"],
  },
  {
    id: "atm",
    title: "ATM",
    categories: ["utilities", "places"],
    tags: ["atm", "cash", "money", "bank", "withdrawal", "banking"],
  },
  {
    id: "restroom",
    title: "Restroom",
    categories: ["utilities"],
    tags: ["restroom", "bathroom", "toilet", "wc", "facilities", "amenities"],
  },
  {
    id: "charging-station",
    title: "Charging Station",
    categories: ["utilities"],
    tags: ["charging-station", "ev-charging", "electric", "vehicle", "charge", "power"],
  },
  {
    id: "phone-charging",
    title: "Phone Charging",
    categories: ["utilities"],
    tags: ["phone-charging", "charging", "power", "battery", "mobile", "device"],
  },
  {
    id: "luggage-storage",
    title: "Luggage Storage",
    categories: ["utilities", "travel"],
    tags: ["luggage-storage", "storage", "bags", "locker", "travel", "baggage"],
  },
  {
    id: "laundromat",
    title: "Laundromat",
    categories: ["utilities", "places"],
    tags: ["laundromat", "laundry", "washing", "service", "cleaning", "clothes"],
  },
  {
    id: "car-wash",
    title: "Car Wash",
    categories: ["utilities"],
    tags: ["car-wash", "cleaning", "vehicle", "service", "auto", "wash"],
  },
  {
    id: "hospital",
    title: "Hospital",
    categories: ["utilities", "places"],
    tags: ["hospital", "medical", "emergency", "healthcare", "clinic", "health"],
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    categories: ["utilities", "places"],
    tags: ["pharmacy", "drugstore", "medicine", "prescription", "health", "chemist"],
  },
  {
    id: "police-station",
    title: "Police Station",
    categories: ["utilities", "places"],
    tags: ["police-station", "police", "law", "safety", "emergency", "security"],
  },
  {
    id: "fire-station",
    title: "Fire Station",
    categories: ["utilities", "places"],
    tags: ["fire-station", "fire", "emergency", "safety", "rescue", "firefighter"],
  },
  {
    id: "post-office",
    title: "Post Office",
    categories: ["utilities", "places"],
    tags: ["post-office", "mail", "postal", "shipping", "service", "letters"],
  },
  {
    id: "library",
    title: "Library",
    categories: ["utilities", "places"],
    tags: ["library", "books", "reading", "study", "public", "education"],
  },
  {
    id: "bike-rack",
    title: "Bike Rack",
    categories: ["utilities", "travel"],
    tags: ["bike-rack", "bicycle", "parking", "cycling", "storage", "rack"],
  },
  {
    id: "water-fountain",
    title: "Water Fountain",
    categories: ["utilities"],
    tags: ["water-fountain", "drinking-water", "fountain", "hydration", "public", "water"],
  },
  {
    id: "shower",
    title: "Shower",
    categories: ["utilities"],
    tags: ["shower", "facilities", "bathroom", "wash", "camping", "beach"],
  },
  {
    id: "veterinary",
    title: "Veterinary",
    categories: ["utilities", "places"],
    tags: ["veterinary", "vet", "animal", "pet", "clinic", "healthcare"],
  },

  // ============================================
  // LANDMARKS & HERITAGE (15 icons)
  // ============================================
  {
    id: "church",
    title: "Church",
    categories: ["landmarks", "places"],
    tags: ["church", "chapel", "religious", "worship", "christian", "historic"],
  },
  {
    id: "castle",
    title: "Castle",
    categories: ["landmarks", "culture"],
    tags: ["castle", "fortress", "historic", "medieval", "palace", "monument"],
  },
  {
    id: "temple",
    title: "Temple",
    categories: ["landmarks", "places"],
    tags: ["temple", "shrine", "religious", "worship", "spiritual", "historic"],
  },
  {
    id: "mosque",
    title: "Mosque",
    categories: ["landmarks", "places"],
    tags: ["mosque", "religious", "worship", "islamic", "prayer", "historic"],
  },
  {
    id: "synagogue",
    title: "Synagogue",
    categories: ["landmarks", "places"],
    tags: ["synagogue", "religious", "worship", "jewish", "temple", "historic"],
  },
  {
    id: "statue",
    title: "Statue",
    categories: ["landmarks", "culture"],
    tags: ["statue", "monument", "sculpture", "memorial", "landmark", "art"],
  },
  {
    id: "bridge",
    title: "Bridge",
    categories: ["landmarks", "places"],
    tags: ["bridge", "landmark", "structure", "architecture", "crossing", "engineering"],
  },
  {
    id: "tower",
    title: "Tower",
    categories: ["landmarks", "places"],
    tags: ["tower", "landmark", "structure", "tall", "viewpoint", "historic"],
  },
  {
    id: "arch",
    title: "Arch",
    categories: ["landmarks", "culture"],
    tags: ["arch", "monument", "landmark", "gateway", "historic", "architecture"],
  },
  {
    id: "memorial",
    title: "Memorial",
    categories: ["landmarks", "culture"],
    tags: ["memorial", "monument", "remembrance", "historic", "tribute", "landmark"],
  },
  {
    id: "historic-building",
    title: "Historic Building",
    categories: ["landmarks", "culture"],
    tags: ["historic-building", "heritage", "old", "architecture", "landmark", "preserved"],
  },
  {
    id: "ruins",
    title: "Ruins",
    categories: ["landmarks", "culture"],
    tags: ["ruins", "ancient", "archaeological", "historic", "remains", "heritage"],
  },
  {
    id: "palace",
    title: "Palace",
    categories: ["landmarks", "culture"],
    tags: ["palace", "royal", "castle", "historic", "grand", "architecture"],
  },
  {
    id: "fort",
    title: "Fort",
    categories: ["landmarks", "culture"],
    tags: ["fort", "fortress", "military", "historic", "defense", "castle"],
  },
  {
    id: "heritage-site",
    title: "Heritage Site",
    categories: ["landmarks", "culture"],
    tags: ["heritage-site", "unesco", "historic", "cultural", "protected", "landmark"],
  },

  // ============================================
  // SHOPPING & COMMERCE (15 icons)
  // ============================================
  {
    id: "supermarket",
    title: "Supermarket",
    categories: ["shopping", "places"],
    tags: ["supermarket", "grocery", "food", "store", "shopping", "market"],
  },
  {
    id: "shopping-center",
    title: "Shopping Center",
    categories: ["shopping", "places"],
    tags: ["shopping-center", "mall", "retail", "shops", "stores", "shopping"],
  },
  {
    id: "boutique",
    title: "Boutique",
    categories: ["shopping"],
    tags: ["boutique", "fashion", "clothing", "shop", "retail", "specialty"],
  },
  {
    id: "bookstore",
    title: "Bookstore",
    categories: ["shopping", "places"],
    tags: ["bookstore", "books", "shop", "reading", "literature", "retail"],
  },
  {
    id: "antique-shop",
    title: "Antique Shop",
    categories: ["shopping"],
    tags: ["antique-shop", "antiques", "vintage", "collectibles", "shop", "retro"],
  },
  {
    id: "music-store",
    title: "Music Store",
    categories: ["shopping"],
    tags: ["music-store", "instruments", "records", "music", "shop", "retail"],
  },
  {
    id: "sports-store",
    title: "Sports Store",
    categories: ["shopping"],
    tags: ["sports-store", "sporting-goods", "equipment", "shop", "retail", "athletic"],
  },
  {
    id: "electronics-store",
    title: "Electronics Store",
    categories: ["shopping"],
    tags: ["electronics-store", "tech", "gadgets", "computers", "shop", "retail"],
  },
  {
    id: "toy-store",
    title: "Toy Store",
    categories: ["shopping"],
    tags: ["toy-store", "toys", "games", "children", "shop", "retail"],
  },
  {
    id: "pet-store",
    title: "Pet Store",
    categories: ["shopping"],
    tags: ["pet-store", "pets", "animals", "supplies", "shop", "retail"],
  },
  {
    id: "hardware-store",
    title: "Hardware Store",
    categories: ["shopping"],
    tags: ["hardware-store", "tools", "diy", "home-improvement", "shop", "retail"],
  },
  {
    id: "jewelry-store",
    title: "Jewelry Store",
    categories: ["shopping"],
    tags: ["jewelry-store", "jewelry", "gems", "watches", "shop", "luxury"],
  },
  {
    id: "florist",
    title: "Florist",
    categories: ["shopping"],
    tags: ["florist", "flowers", "plants", "shop", "bouquet", "garden"],
  },
  {
    id: "gift-shop",
    title: "Gift Shop",
    categories: ["shopping"],
    tags: ["gift-shop", "souvenirs", "gifts", "shop", "retail", "tourist"],
  },
  {
    id: "farmers-market",
    title: "Farmers Market",
    categories: ["shopping", "food"],
    tags: ["farmers-market", "market", "fresh", "local", "produce", "organic"],
  },

  // ============================================
  // TRAVEL & NAVIGATION (15 icons)
  // ============================================
  {
    id: "checkpoint",
    title: "Checkpoint",
    categories: ["travel"],
    tags: ["checkpoint", "waypoint", "marker", "navigation", "route", "stop"],
  },
  {
    id: "waypoint",
    title: "Waypoint",
    categories: ["travel"],
    tags: ["waypoint", "marker", "navigation", "route", "gps", "point"],
  },
  {
    id: "trailhead",
    title: "Trailhead",
    categories: ["travel", "nature", "activities"],
    tags: ["trailhead", "trail", "start", "hiking", "parking", "access"],
  },
  {
    id: "rest-stop",
    title: "Rest Stop",
    categories: ["travel"],
    tags: ["rest-stop", "rest-area", "highway", "break", "facilities", "stop"],
  },
  {
    id: "information-point",
    title: "Information Point",
    categories: ["travel", "utilities"],
    tags: ["information", "info", "help", "tourist", "visitor", "assistance"],
  },
  {
    id: "tourist-office",
    title: "Tourist Office",
    categories: ["travel", "places"],
    tags: ["tourist-office", "information", "visitor-center", "tourism", "help", "guidance"],
  },
  {
    id: "visitor-center",
    title: "Visitor Center",
    categories: ["travel", "places"],
    tags: ["visitor-center", "information", "welcome", "tourist", "center", "museum"],
  },
  {
    id: "border-crossing",
    title: "Border Crossing",
    categories: ["travel"],
    tags: ["border-crossing", "checkpoint", "customs", "immigration", "border", "international"],
  },
  {
    id: "bus-station",
    title: "Bus Station",
    categories: ["travel", "transport"],
    tags: ["bus-station", "terminal", "transit", "public-transport", "depot", "stop"],
  },
  {
    id: "train-station",
    title: "Train Station",
    categories: ["travel", "transport"],
    tags: ["train-station", "railway", "terminal", "transit", "depot", "station"],
  },
  {
    id: "airport",
    title: "Airport",
    categories: ["travel", "transport"],
    tags: ["airport", "flight", "terminal", "aviation", "travel", "international"],
  },
  {
    id: "ferry-terminal",
    title: "Ferry Terminal",
    categories: ["travel", "transport"],
    tags: ["ferry-terminal", "port", "harbor", "dock", "boat", "water-transport"],
  },
  {
    id: "meeting-point",
    title: "Meeting Point",
    categories: ["travel"],
    tags: ["meeting-point", "rendezvous", "gather", "meetup", "location", "marker"],
  },
  {
    id: "landmark-marker",
    title: "Landmark Marker",
    categories: ["travel", "landmarks"],
    tags: ["landmark", "marker", "point-of-interest", "poi", "notable", "significant"],
  },
  {
    id: "route-marker",
    title: "Route Marker",
    categories: ["travel"],
    tags: ["route-marker", "trail-marker", "navigation", "path", "direction", "sign"],
  },

  // ============================================
  // SEASONAL & WEATHER (10 icons)
  // ============================================
  {
    id: "sunny",
    title: "Sunny",
    categories: ["seasonal"],
    tags: ["sunny", "sun", "weather", "clear", "bright", "summer"],
  },
  {
    id: "rainy",
    title: "Rainy",
    categories: ["seasonal"],
    tags: ["rainy", "rain", "weather", "wet", "precipitation", "storm"],
  },
  {
    id: "snowy",
    title: "Snowy",
    categories: ["seasonal"],
    tags: ["snowy", "snow", "weather", "winter", "cold", "precipitation"],
  },
  {
    id: "cloudy",
    title: "Cloudy",
    categories: ["seasonal"],
    tags: ["cloudy", "clouds", "weather", "overcast", "gray", "sky"],
  },
  {
    id: "winter-activity",
    title: "Winter Activity",
    categories: ["seasonal", "activities"],
    tags: ["winter", "snow", "cold", "seasonal", "sport", "skiing"],
  },
  {
    id: "summer-beach",
    title: "Summer Beach",
    categories: ["seasonal", "nature"],
    tags: ["summer", "beach", "sun", "vacation", "hot", "seaside"],
  },
  {
    id: "fall-foliage",
    title: "Fall Foliage",
    categories: ["seasonal", "nature"],
    tags: ["fall", "autumn", "leaves", "foliage", "colors", "seasonal"],
  },
  {
    id: "spring-blossom",
    title: "Spring Blossom",
    categories: ["seasonal", "nature"],
    tags: ["spring", "blossom", "flowers", "bloom", "seasonal", "nature"],
  },
  {
    id: "windy",
    title: "Windy",
    categories: ["seasonal"],
    tags: ["windy", "wind", "weather", "breezy", "gust", "air"],
  },
  {
    id: "foggy",
    title: "Foggy",
    categories: ["seasonal"],
    tags: ["foggy", "fog", "weather", "mist", "visibility", "hazy"],
  },

  // ============================================
  // MAP CONTROLS & OTHER (10 icons)
  // ============================================
  {
    id: "folder",
    title: "Folder",
    categories: ["other"],
    tags: ["folder", "collection", "organize", "group", "category", "container"],
  },
  {
    id: "map-pin",
    title: "Map Pin",
    categories: ["other"],
    tags: ["map-pin", "marker", "location", "pin", "point", "place"],
  },
  {
    id: "compass",
    title: "Compass",
    categories: ["other", "travel"],
    tags: ["compass", "navigation", "direction", "orientation", "north", "tool"],
  },
  {
    id: "map",
    title: "Map",
    categories: ["other"],
    tags: ["map", "cartography", "navigation", "geography", "atlas", "guide"],
  },
  {
    id: "map-pin-line",
    title: "Map Pin Line",
    categories: ["other"],
    tags: ["map-pin-line", "marker", "location", "outline", "pin", "point"],
  },
  {
    id: "star",
    title: "Star",
    categories: ["other"],
    tags: ["star", "favorite", "bookmark", "highlight", "important", "rating"],
  },
  {
    id: "flag",
    title: "Flag",
    categories: ["other"],
    tags: ["flag", "marker", "destination", "goal", "finish", "important"],
  },
  {
    id: "heart",
    title: "Heart",
    categories: ["other"],
    tags: ["heart", "favorite", "love", "like", "bookmark", "save"],
  },
  {
    id: "bookmark",
    title: "Bookmark",
    categories: ["other"],
    tags: ["bookmark", "save", "favorite", "mark", "remember", "collection"],
  },
  {
    id: "custom-marker",
    title: "Custom Marker",
    categories: ["other"],
    tags: ["custom", "marker", "personalized", "unique", "special", "user-defined"],
  },
] as const;

export type IconType = (typeof iconsList)[number]["id"];
